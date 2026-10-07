// Centralized API Client connecting Frontend to Node.js / MongoDB Backend

const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token") || localStorage.getItem("ise_jwt_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.warn(`[API Error: ${endpoint}]`, error.message);
    throw error;
  }
}

// Authentication Service
export const authApi = {
  login: (email, password = "Password@123", role = "admin") =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role })
    }),

  signup: ({ name, dept, email, password }) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, dept, email, password })
    }),

  googleLogin: ({ email, name, role }) =>
    request("/auth/google", {
      method: "POST",
      body: JSON.stringify({ email, name, role })
    }),

  getMe: () => request("/auth/me"),

  getStatus: () => request("/auth/status")
};

// Employees Service
export const employeeApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.dept) query.set("dept", params.dept);
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    const qs = query.toString();
    return request(`/employees${qs ? `?${qs}` : ""}`);
  },

  getById: (id) => request(`/employees/${id}`),

  create: (employeeData) =>
    request("/employees", {
      method: "POST",
      body: JSON.stringify(employeeData)
    }),

  update: (id, updateData) =>
    request(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData)
    }),

  delete: (id) =>
    request(`/employees/${id}`, {
      method: "DELETE"
    })
};

// Orders Service
export const orderApi = {
  getAll: () => request("/orders"),

  create: (orderData) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData)
    }),

  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    })
};

// Production Tasks Service
export const taskApi = {
  getAll: () => request("/tasks"),

  create: (taskData) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData)
    }),

  updateStatus: (id, status) =>
    request(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    })
};

// Inventory Service
export const inventoryApi = {
  getAll: () => request("/inventory"),

  updateStock: (id, updateData) =>
    request(`/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData)
    })
};

// Notifications Service
export const notificationApi = {
  getAll: (audience) => request(`/notifications${audience ? `?audience=${audience}` : ""}`),

  create: ({ audience, title, body }) =>
    request("/notifications", {
      method: "POST",
      body: JSON.stringify({ audience, title, body })
    }),

  markRead: (id) =>
    request(`/notifications/${id}/read`, {
      method: "PATCH"
    }),

  markAllRead: (audience) =>
    request("/notifications/read-all", {
      method: "PATCH",
      body: JSON.stringify({ audience })
    })
};

// Products Service
export const productApi = {
  getAll: () => request("/products")
};

// Analytics & Reports Service
export const analyticsApi = {
  get: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/analytics${qs ? `?${qs}` : ""}`);
  }
};

