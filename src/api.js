const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function sendChat(message, sessionId) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });
  if (!res.ok) throw new Error('请求失败');
  return res.json();
}

export async function getStatus() {
  const res = await fetch(`${BASE}/api/status`);
  return res.json();
}

export async function setStatus(status, detail) {
  const res = await fetch(`${BASE}/api/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, detail }),
  });
  return res.json();
}

export async function getMemories(type, limit = 20) {
  const q = type ? `?type=${type}&limit=${limit}` : `?limit=${limit}`;
  const res = await fetch(`${BASE}/api/memory${q}`);
  return res.json();
}
