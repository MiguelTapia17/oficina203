const API_URL = "https://tudominio.com";

export function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  return fetch(API_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers
    }
  });
}
