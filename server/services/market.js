// Fetch and cache Yahoo Finance quotes and track whether they are recent enough.
const { EventEmitter } = require('node:events');
const { execFile } = require('node:child_process');
const path = require('node:path');
const { promisify } = require('node:util');
const catalog = require('../data/stocks');

const execFileAsync = promisify(execFile);
const helper = path.join(__dirname, '../helpers/yahoo_prices.py');

class Market extends EventEmitter {
  constructor(config = process.env) {
    super();
    this.config = config;
    this.quotes = new Map();
    this.status = 'Yahoo Finance quotes are starting';
  }

  list() {
    return catalog.map(asset => {
      const quote = this.quotes.get(asset.symbol);
      return {
        symbol: asset.symbol,
        name: asset.name,
        exchange: asset.exchange,
        currency: 'INR',
        price: quote?.price ?? null,
        changePct: quote?.changePct ?? null,
        timestamp: quote?.timestamp ?? null,
        stale: !quote?.timestamp || Date.now() - quote.updatedAt > 240000 || Date.now() - Date.parse(quote.timestamp) > 15 * 60000 || Date.parse(quote.timestamp) > Date.now() + 60000,
        source: 'Yahoo Finance (yfinance)'
      };
    });
  }

  payload() { return { status: this.status, assets: this.list() }; }
  publish() { this.emit('update', this.payload()); }

  async refresh() {
    try {
      const symbols = catalog.map(asset => ({ symbol: asset.symbol, ticker: `${asset.symbol}.NS` }));
      const python = this.config.YFINANCE_PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
      const { stdout } = await execFileAsync(python, [helper, JSON.stringify(symbols)], {
        timeout: 45000,
        maxBuffer: 1024 * 1024
      });
      const results = JSON.parse(stdout);
      for (const asset of catalog) {
        const quote = results[asset.symbol];
        if (!quote || !Number.isFinite(quote.price) || quote.price <= 0) continue;
        this.quotes.set(asset.symbol, {
          price: quote.price,
          changePct: Number.isFinite(quote.changePct) ? quote.changePct : null,
          timestamp: Number.isFinite(Date.parse(quote.timestamp)) ? quote.timestamp : null,
          updatedAt: Date.now()
        });
      }
      const count = catalog.filter(asset => Number.isFinite(results[asset.symbol]?.price) && results[asset.symbol].price > 0).length;
      this.status = count ? `Yahoo Finance · ${count} NSE prices updated` : 'Yahoo Finance returned no prices';
    } catch (error) {
      const detail = `${error.stderr || ''}\n${error.message || ''}`;
      if (/No module named ['"]?(yfinance|pandas)/i.test(detail)) {
        this.status = 'Market data setup needed: run python -m pip install -r requirements.txt';
      } else if (error.code === 'ENOENT' || error.code === 'EACCES' || error.code === 'UNKNOWN') {
        this.status = 'Python is unavailable. Install Python, then run python -m pip install -r requirements.txt';
      } else {
        this.status = 'Yahoo Finance is temporarily unavailable. Try again later.';
      }
    }
    this.publish();
  }

  start() {
    this.refresh();
    this.timer = setInterval(() => this.refresh(), 180000);
    this.timer.unref();
    this.freshnessTimer = setInterval(() => this.publish(), 30000);
    this.freshnessTimer.unref();
  }

  stop() { clearInterval(this.timer); clearInterval(this.freshnessTimer); }
}

module.exports = Market;
