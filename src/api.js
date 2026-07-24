const BASE_URL = "https://famme-marketplace-backend.onrender.com/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("femme_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Ocorreu um erro. Tenta novamente.");
  }
  return data;
}

export const api = {
  // Autenticação de clientes
  registerUser: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  loginUser: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  // Autenticação de vendedoras
  registerSeller: (body) => request("/auth/seller/register", { method: "POST", body: JSON.stringify(body) }),
  loginSeller: (body) => request("/auth/seller/login", { method: "POST", body: JSON.stringify(body) }),

  // Produtos
  listProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ""}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (body) => request("/products", { method: "POST", body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  // Encomendas
  createOrder: (body) => request("/orders", { method: "POST", body: JSON.stringify(body) }),
  myOrders: () => request("/orders/minhas"),
  sellerOrders: () => request("/orders/vendedora"),
};
