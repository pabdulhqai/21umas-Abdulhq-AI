export async function chatProClient(prompt: string, history: any[] = []) {
  const resp = await fetch('/api/geminiChat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, history }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err?.error || 'Request failed');
  }
  return resp.json();
}
