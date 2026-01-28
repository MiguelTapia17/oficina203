/**
 * Servicio centralizado de la API Logística
 * Aquí se definen todas las llamadas HTTP
 */

const API_BASE = "https://comerciald4.sg-host.com/api";
const API_KEY = "UPCH2026";

// Login
export async function apiLogin(usuario, password) {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-KEY": API_KEY,
    },
    body: JSON.stringify({ usuario, password }),
  });

  return response.json();
}

// Endpoints protegidos
export async function apiGet(endpoint) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/${endpoint}`, {
    headers: {
      Accept: "application/json",
      "X-API-KEY": API_KEY,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  
  return response.json();
}

/**
 * Llamada a la API para obtener las categorías
 */
// export async function apiGetCategorias() {
//   const response = await apiGet("categorias");  // 'categorias' es el endpoint que asumo tienes
//   return response.data; 
// }

