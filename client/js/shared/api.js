// Send API requests and share account and quote state between page scripts.
// Server identity is kept in memory. Cookies are HttpOnly; localStorage is never authentication.
window.API = {
  user: null, csrf: null, market: { assets: [] }, error: '',
  async request(url, method = 'GET', body, headers = {}) {
    const requestHeaders = { ...headers };
    if (body !== undefined) requestHeaders['Content-Type'] = 'application/json';
    if (method !== 'GET') requestHeaders['X-CSRF-Token'] = API.csrf || '';
    const options = {
      method, credentials: 'same-origin', signal: AbortSignal.timeout(15000),
      headers: requestHeaders
    };
    if (body !== undefined) options.body = JSON.stringify(body);
    const response = await fetch(url, options);
    let data;
    try {
      data = await response.json();
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid response');
    } catch {
      // The server may have saved a trade before its response was damaged.
      // Leave the HTTP status unset so callers retain the pending request ID.
      throw new Error('The server returned an invalid response. Please retry.');
    }
    if (!response.ok) throw Object.assign(new Error(data.error || 'Request failed. Please try again.'), { status: response.status });
    return data;
  },
  async session() {
    const data = await API.request('/api/session');
    API.user = data.user; API.csrf = data.csrf;
    return data;
  },
  applyMarket(data) {
    API.market = data;
    document.querySelectorAll('[data-feed-status]').forEach(el => { el.textContent = data.status; });
    window.dispatchEvent(new CustomEvent('market:update', { detail: data }));
  }
};
API.ready = (async () => {
  const results = await Promise.allSettled([API.session(), API.request('/api/quotes')]);
  if (results[0].status === 'rejected') API.error = results[0].reason.message;
  if (results[1].status === 'fulfilled') API.applyMarket(results[1].value);
  else { API.market.status = 'Market data unavailable'; }
})();
document.addEventListener('DOMContentLoaded', async () => {
  await API.ready;
  if (document.querySelector('.navbar')) {
    const status = document.createElement('p'); status.className = 'feed-status'; status.dataset.feedStatus = ''; status.setAttribute('role', 'status');
    status.textContent = API.market.status || 'Market data unavailable'; document.querySelector('.navbar').after(status);
    if (API.error) { const note = document.createElement('p'); note.className = 'feed-status'; note.textContent = API.error; status.after(note); }
  }
  const stream = new EventSource('/api/market/stream');
  stream.onmessage = event => { try { API.applyMarket(JSON.parse(event.data)); } catch { /* Wait for next valid update. */ } };
  stream.onerror = () => API.applyMarket({
    ...API.market,
    status: 'Market connection interrupted · reconnecting',
    assets: API.market.assets.map(asset => ({ ...asset, stale: true }))
  });
  window.addEventListener('pagehide', () => stream.close());
});
