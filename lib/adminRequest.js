export async function adminRequest(url, options) {
  const response = await fetch(url, options);
  let data;
  try { data = await response.json(); } catch { throw new Error('The request could not be confirmed. Please try again.'); }
  if (!response.ok) throw new Error(data.error || 'The request failed. Please try again.');
  return data;
}
