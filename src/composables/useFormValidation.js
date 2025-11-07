import { reactive, computed } from "vue";

export const validators = {
  required: (message = "此字段为必填项") => (value) => {
    return value?.toString().trim() ? "" : message;
  },

  minLength: (min, message) => (value) => {
    const msg = message || `最少需要 ${min} 个字符`;
    return value?.length >= min ? "" : msg;
  },

  maxLength: (max, message) => (value) => {
    const msg = message || `最多允许 ${max} 个字符`;
    return value?.length <= max ? "" : msg;
  },

  email: (message = "请输入有效的邮箱地址") => (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !value || emailRegex.test(value) ? "" : message;
  },

  pattern: (regex, message = "格式不正确") => (value) => {
    return !value || regex.test(value) ? "" : message;
  },

  username: (message = "用户名只能包含字母、数字和下划线，3-20个字符") => (value) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return !value || usernameRegex.test(value) ? "" : message;
  },

  password: (message = "密码至少6个字符") => (value) => {
    return !value || value.length >= 6 ? "" : message;
  },

  match: (targetValue, message = "两次输入不一致") => (value) => {
    return value === targetValue ? "" : message;
  }
};

export const useFormValidation = (schema) => {
  const fields = reactive({});
  const errors = reactive({});
  const touched = reactive({});

  // 初始化字段
  Object.keys(schema).forEach((key) => {
    fields[key] = schema[key].defaultValue ?? "";
    errors[key] = "";
    touched[key] = false;
  });

  const validate = (fieldName) => {
    if (!schema[fieldName]) return true;

    const value = fields[fieldName];
    const rules = schema[fieldName].rules || [];

    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[fieldName] = error;
        return false;
      }
    }

    errors[fieldName] = "";
    return true;
  };

  const validateAll = () => {
    let isValid = true;
    Object.keys(schema).forEach((fieldName) => {
      touched[fieldName] = true;
      if (!validate(fieldName)) {
        isValid = false;
      }
    });
    return isValid;
  };

  const onBlur = (fieldName) => {
    touched[fieldName] = true;
    validate(fieldName);
  };

  const reset = () => {
    Object.keys(schema).forEach((key) => {
      fields[key] = schema[key].defaultValue ?? "";
      errors[key] = "";
      touched[key] = false;
    });
  };

  const isValid = computed(() => {
    return Object.values(errors).every((error) => !error);
  });

  const hasErrors = computed(() => {
    return Object.values(errors).some((error) => error);
  });

  return {
    fields,
    errors,
    touched,
    validate,
    validateAll,
    onBlur,
    reset,
    isValid,
    hasErrors
  };
};

