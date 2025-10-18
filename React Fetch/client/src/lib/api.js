// src/lib/api.js
const BASE = import.meta.env.VITE_API_URL;

function authHeaders() {
  const t = localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function http(path, { method='GET', body, headers } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...headers },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'omit',
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.arrayBuffer();
}

export const api = {

  listProducts: async () => {
  const r = await http('/api/products');    // devuelve {data:[...], message:'...'}
  return Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);},
  
  // Auth
  register: (data) => http('/api/v1/auth/register', { method:'POST', body:data }), // :contentReference[oaicite:10]{index=10}
  login:    (data) => http('/api/v1/auth/authenticate', { method:'POST', body:data }), // :contentReference[oaicite:11]{index=11}

  // Productos
  listProducts: () => http('/api/products'),                // GET público :contentReference[oaicite:12]{index=12}
  getProduct:   (id) => http(`/api/products/${id}`),        // :contentReference[oaicite:13]{index=13}
  createProduct:(dto)=> http('/api/products',{method:'POST',body:dto}), // ADMIN :contentReference[oaicite:14]{index=14}
  patchProduct: (id, dto)=> http(`/api/products/${id}`,{method:'PATCH',body:dto}), // :contentReference[oaicite:15]{index=15}
  deleteProduct:(id)=> http(`/api/products/${id}`,{method:'DELETE'}),    // :contentReference[oaicite:16]{index=16}
  activateProduct:(id)=> http(`/api/products/${id}/activar`,{method:'PATCH'}), // :contentReference[oaicite:17]{index=17}

  // Categorías
  listCategories: ()=> http('/categories'),                       // :contentReference[oaicite:18]{index=18}
  createCategory: (dto)=> http('/categories',{method:'POST',body:dto}), // :contentReference[oaicite:19]{index=19}
  deleteCategory: (id)=> http(`/categories/${id}`,{method:'DELETE'}),   // :contentReference[oaicite:20]{index=20}

  // Compras
  myOrders: ()=> http('/api/compras/mias'),                            // :contentReference[oaicite:21]{index=21}
  createOrder:(payload)=> http('/api/compras',{method:'POST',body:payload}), // requiere USER :contentReference[oaicite:22]{index=22}

  // Imágenes (binario)
  getImage: (productId, imageId)=> http(`/api/products/${productId}/images/${imageId}`), // :contentReference[oaicite:23]{index=23}
};
