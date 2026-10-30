// Thin API client for Tier 2. The base URL is injected via VITE_API_URL so the
// client stays portable; it defaults to the local docker-compose API.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function parseError(response) {
  // Surface a clean, specific message without leaking server internals.
  try {
    const data = await response.json();
    if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
      return data.detail[0].msg;
    }
    if (typeof data?.detail === "string") return data.detail;
  } catch {
    /* fall through to generic message */
  }
  return "Something went wrong. Please try again.";
}

export async function listContributions() {
  const response = await fetch(`${BASE_URL}/contributions`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function createContribution({ body, topic }) {
  const response = await fetch(`${BASE_URL}/contributions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body, topic: topic || null }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function getProvisionalConfig() {
  const response = await fetch(`${BASE_URL}/config/provisional`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}
