const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function createApi(token) {
  async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (response.status === 204) return null;

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Falha na requisicao.");
    }

    return data;
  }

  return {
    login: (payload) =>
      request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    register: (payload) =>
      request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
    listGoals: () => request("/api/goals"),
    createGoal: (payload) =>
      request("/api/goals", { method: "POST", body: JSON.stringify(payload) }),
    seedDefaultGoal: () => request("/api/goals/seed-default", { method: "POST" }),
    storageGet: (key) => request(`/api/storage/${encodeURIComponent(key)}`),
    storageList: (prefix) => request(`/api/storage?prefix=${encodeURIComponent(prefix)}`),
    storageSet: (key, value) =>
      request(`/api/storage/${encodeURIComponent(key)}`, {
        method: "PUT",
        body: JSON.stringify({ value }),
      }),
    storageDelete: (key) =>
      request(`/api/storage/${encodeURIComponent(key)}`, { method: "DELETE" }),
  };
}
