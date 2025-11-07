import productsData from "./products.json";
import usersData from "./users.json";
import ordersData from "./orders.json";
import commentsData from "./comments.json";

const clone = (data) => JSON.parse(JSON.stringify(data));

// 简易内存数据库：所有 mock API 共用此对象
const db = {
  products: clone(productsData),
  users: clone(usersData),
  orders: clone(ordersData),
  comments: clone(commentsData)
};

export const getDb = () => db;

export const resetDb = () => {
  db.products = clone(productsData);
  db.users = clone(usersData);
  db.orders = clone(ordersData);
  db.comments = clone(commentsData);
};

export const createId = (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9999)}`;