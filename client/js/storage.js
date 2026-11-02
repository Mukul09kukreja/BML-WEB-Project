// localStorage stores strings. These helpers convert objects to/from JSON safely.
const Store = {
  get: function (key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch (error) { return fallback; }
  },
  set: function (key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (error) { return false; }
  },
  remove: function (key) {
    try { localStorage.removeItem(key); } catch (error) { /* Storage can be blocked. */ }
  },
  user: function () {
    const user = Store.get('stockpie.user', null);
    return user && typeof user.email === 'string' && user.email.includes('@') ? user : null;
  },
  setUser: function (email) { Store.set('stockpie.user', { email: email }); },
  clearUser: function () { Store.remove('stockpie.user'); },
  watchlist: function () {
    const list = Store.get('stockpie.watchlist', []);
    return Array.isArray(list) ? list : [];
  },
  toggleWatchlist: function (symbol) {
    let list = Store.watchlist();
    if (list.includes(symbol)) list = list.filter(function (item) { return item !== symbol; });
    else list.push(symbol);
    Store.set('stockpie.watchlist', list);
  }
};
