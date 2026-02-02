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