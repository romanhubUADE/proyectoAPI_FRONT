// src/lib/api.js
const BASE = import.meta.env.VITE_API_URL;

function authHeader() {
  const t = localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function http(path, { method='GET', body, headers } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { ...(body ? { 'Content-Type':'application/json' } : {}), ...authHeader(), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) throw new Error(typeof data === 'string' ? data : data?.message || `${res.status} ${res.statusText}`);
  return data;
}

// --- normalizadores ---
const normalizeImage = (prodId) => (img) =>
  img?.url || `${BASE}/api/products/${prodId}/images/${img?.id}`;

const normalizeProduct = (dto) => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  price: dto.price,
  stock: dto.stock,
  categoryId: dto.categoryId,
  category: dto.categoryDescription,
  activo: dto.activo ?? true,
  images: Array.isArray(dto.images) ? dto.images.map(normalizeImage(dto.id)) : [],
  discount: Number(dto.descuento) || 0,
});

export const api = {
  // Auth
  register: (data) => http('/api/v1/auth/register', { method: 'POST', body: data }),
  login:    (data) => http('/api/v1/auth/authenticate', { method: 'POST', body: data }),

  // Productos
  listProducts: async () => {
    const r = await http('/api/products');              // { data:[...], message } o []
    const arr = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
    return arr.map(normalizeProduct);
  },
  getProduct: async (id) => {
    const dto = await http(`/api/products/${id}`);      // ProductResponseDTO
    return normalizeProduct(dto);
  },
  createProduct: (dto) => http('/api/products', { method: 'POST', body: dto }),
  patchProduct:  (id, dto) => http(`/api/products/${id}`, { method: 'PATCH', body: dto }),
  deleteProduct: (id) => http(`/api/products/${id}`, { method: 'DELETE' }),
  activateProduct: (id) => http(`/api/products/${id}/activar`, { method: 'PATCH' }),

  // Categorías
  listCategories:  () => http('/categories'),
  createCategory:  (dto) => http('/categories', { method: 'POST', body: dto }),
  deleteCategory:  (id) => http(`/categories/${id}`, { method: 'DELETE' }),

  // solo agrega/ajusta esta función:
  myOrders: async () => {
  const r = await http('/api/compras/mias'); // requiere token
  // normaliza a []
  if (Array.isArray(r)) return r;
  if (Array.isArray(r?.data)) return r.data;
  if (Array.isArray(r?.content)) return r.content;
  return [];
  },

  createOrder:(payload) => http('/api/compras', { method: 'POST', body: payload }),

  // Utilidad para armar URL binaria si hiciera falta en algún componente
  getImageUrl: (productId, imageId) => `${BASE}/api/products/${productId}/images/${imageId}`,
};