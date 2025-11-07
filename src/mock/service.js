import AxiosMockAdapter from "axios-mock-adapter";
import { getDb, createId } from "./db";
import { deepClone } from "@/utils/helpers";
import { toCurrency } from "@/utils/format";

const normalize = (keyword = "") => keyword.trim().toLowerCase();

const parseParams = (config) => {
  if (config.params) return config.params;
  if (config.url?.includes("?")) {
    const query = config.url.split("?")[1];
    const search = new URLSearchParams(query);
    return Object.fromEntries(search.entries());
  }
  return {};
};

const parseBody = (config) => {
  if (!config.data) return {};
  try {
    return JSON.parse(config.data);
  } catch (error) {
    return {};
  }
};

const buildCategoryTree = (products) => {
  const map = new Map();
  products.forEach((item) => {
    if (!map.has(item.categoryId)) {
      map.set(item.categoryId, {
        id: item.categoryId,
        name: item.categoryName,
        children: []
      });
    }
    const parent = map.get(item.categoryId);
    if (!parent.children.some((child) => child.id === item.subCategoryId)) {
      parent.children.push({ id: item.subCategoryId, name: item.subCategoryName });
    }
  });
  return Array.from(map.values());
};

const pickUser = (db, userId) =>
  db.users.find((user) => user.id === userId) || db.users[0];

export const setupMockServer = (http) => {
  const mock = new AxiosMockAdapter(http, { delayResponse: 400 });

  // 商品列表
  mock.onGet("/products").reply((config) => {
    const db = getDb();
    const {
      categoryId = "all",
      keyword = "",
      page = 1,
      pageSize = 12,
      sort = "default"
    } = parseParams(config);

    let items = [...db.products];

    if (categoryId !== "all") {
      items = items.filter(
        (item) => item.categoryId === categoryId || item.subCategoryId === categoryId
      );
    }

    if (keyword) {
      const key = normalize(keyword);
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(key) ||
          item.description?.toLowerCase().includes(key)
      );
    }

    if (sort === "price") {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === "rating") {
      items.sort((a, b) => b.rating - a.rating);
    }

    const pageNumber = Number(page);
    const size = Number(pageSize);
    const start = (pageNumber - 1) * size;
    const sliced = items.slice(start, start + size);

    return [
      200,
      {
        items: sliced,
        total: items.length,
        page: pageNumber,
        pageSize: size,
        categoryTree: buildCategoryTree(db.products)
      }
    ];
  });

  mock.onGet(/\/products\/([^/]+)\/recommendations/).reply((config) => {
    const db = getDb();
    const parts = config.url.split("/");
    const productId = parts[parts.length - 2];
    const { limit = 4 } = parseParams(config);
    const current = db.products.find((item) => item.id === productId);
    const pool = current
      ? db.products.filter((item) => item.categoryId === current.categoryId && item.id !== productId)
      : db.products;
    return [200, pool.slice(0, Number(limit))];
  });

  mock.onGet(/\/products\/([^/]+)\/comments/).reply((config) => {
    const db = getDb();
    const parts = config.url.split("/");
    const productId = parts[parts.length - 2];
    const comments = db.comments.filter((item) => item.productId === productId);
    return [200, comments];
  });

  mock.onGet(/\/products\/([^/]+)$/).reply((config) => {
    const db = getDb();
    const id = config.url.split("/").pop();
    const product = db.products.find((item) => item.id === id);
    if (!product) return [404, { message: "未找到商品" }];
    return [200, product];
  });

  // Auth
  mock.onPost("/auth/login").reply((config) => {
    const db = getDb();
    const { username, password } = parseBody(config);
    const target = db.users.find(
      (user) => user.username === username && user.password === password
    );
    if (!target) {
      return [401, { message: "用户名或密码错误" }];
    }
    const { password: _ignored, ...rest } = target;
    const session = {
      token: `FAKE_TOKEN_${target.id}`,
      user: rest
    };
    return [200, session];
  });

  mock.onPost("/auth/register").reply((config) => {
    const db = getDb();
    const { username, email, password } = parseBody(config);
    const exists = db.users.some((user) => user.username === username);
    if (exists) {
      return [409, { message: "用户名已存在" }];
    }
    const user = {
      id: createId("u"),
      username,
      password,
      email,
      nickname: username,
      avatar: `https://picsum.photos/seed/${username}/120/120`,
      addresses: [],
      favorites: []
    };
    db.users.push(user);
    const { password: _pw, ...rest } = user;
    return [
      200,
      {
        token: `FAKE_TOKEN_${user.id}`,
        user: rest
      }
    ];
  });

  mock.onGet(/\/auth\/profile\/([^/]+)/).reply((config) => {
    const db = getDb();
    const id = config.url.split("/").pop();
    const target = db.users.find((user) => user.id === id);
    if (!target) return [404, { message: "用户不存在" }];
    const profile = { ...target };
    delete profile.password;
    return [200, profile];
  });

  mock.onPost("/auth/password").reply((config) => {
    const db = getDb();
    const { id, password } = parseBody(config);
    const target = db.users.find((user) => user.id === id);
    if (target) {
      target.password = password;
    }
    return [200, true];
  });

  // Orders
  mock.onGet("/orders").reply((config) => {
    const db = getDb();
    const { userId } = parseParams(config);
    const user = pickUser(db, userId);
    const orders = db.orders.filter((order) => order.userId === user.id);
    return [200, deepClone(orders)];
  });

  mock.onGet(/\/orders\/([^/]+)/).reply((config) => {
    const db = getDb();
    const id = config.url.split("/").pop();
    const order = db.orders.find((item) => item.id === id);
    if (!order) return [404, { message: "订单不存在" }];
    return [200, order];
  });

  mock.onPost("/orders").reply((config) => {
    const db = getDb();
    const { items = [], addressId, userId } = parseBody(config);
    const amount = items.reduce((sum, item) => sum + item.price * item.count, 0);
    const order = {
      id: createId("o"),
      userId: userId || db.users[0].id,
      addressId,
      status: "待支付",
      amount: Number(toCurrency(amount)),
      createdAt: new Date().toISOString(),
      items
    };
    db.orders.unshift(order);
    return [200, order];
  });

  mock.onPost(/\/orders\/([^/]+)\/pay/).reply((config) => {
    const db = getDb();
    const id = config.url.split("/")[2];
    const target = db.orders.find((order) => order.id === id);
    if (target) {
      target.status = "已支付";
    }
    return [200, target];
  });

  mock.onPost(/\/orders\/([^/]+)\/cancel/).reply((config) => {
    const db = getDb();
    const id = config.url.split("/")[2];
    const target = db.orders.find((order) => order.id === id);
    if (target && target.status === "待支付") {
      target.status = "已取消";
    }
    return [200, target];
  });

  // User information
  mock.onGet("/user/addresses").reply((config) => {
    const db = getDb();
    const { userId } = parseParams(config);
    const user = pickUser(db, userId);
    return [200, deepClone(user?.addresses || [])];
  });

  mock.onPost("/user/addresses").reply((config) => {
    const db = getDb();
    const payload = parseBody(config);
    const user = pickUser(db, payload.userId);
    if (!user) return [404, []];
    const address = { ...payload, id: createId("addr") };
    user.addresses.push(address);
    return [200, deepClone(user.addresses)];
  });

  mock.onPut(/\/user\/addresses\/([^/]+)/).reply((config) => {
    const db = getDb();
    const id = config.url.split("/").pop();
    const payload = parseBody(config);
    const user = pickUser(db, payload.userId);
    if (!user) return [404, []];
    user.addresses = user.addresses.map((item) =>
      item.id === id ? { ...item, ...payload } : item
    );
    return [200, deepClone(user.addresses)];
  });

  mock.onDelete(/\/user\/addresses\/([^/]+)/).reply((config) => {
    const db = getDb();
    const id = config.url.split("/").pop();
    const { userId } = parseParams(config);
    const user = pickUser(db, userId);
    if (!user) return [404, []];
    user.addresses = user.addresses.filter((item) => item.id !== id);
    return [200, deepClone(user.addresses)];
  });

  mock.onGet("/user/favorites").reply((config) => {
    const db = getDb();
    const { userId } = parseParams(config);
    const user = pickUser(db, userId);
    if (!user) return [200, []];
    const favorites = db.products.filter((product) => user.favorites?.includes(product.id));
    return [200, favorites];
  });

  mock.onPost("/user/favorites/toggle").reply((config) => {
    const db = getDb();
    const { productId, userId } = parseBody(config);
    const user = pickUser(db, userId);
    if (!user) return [404, []];
    if (user.favorites?.includes(productId)) {
      user.favorites = user.favorites.filter((id) => id !== productId);
    } else {
      user.favorites = [...(user.favorites || []), productId];
    }
    return [200, deepClone(user.favorites)];
  });
};
