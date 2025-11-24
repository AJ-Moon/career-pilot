const BASE_URL = "https://career-pilot-s24d.onrender.com";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }), 
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || res.statusText);
  }

  return await res.json();
}

