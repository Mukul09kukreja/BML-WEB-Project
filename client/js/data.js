// Catalog data for the StockPie prototype.
// This is sample content used by the page scripts, not a database or live feed.
// Account, contact and newsletter submissions are stored separately by the server.

// This immediately invoked function keeps page variables private instead of adding globals.
(function () {
  'use strict';

  // Fixed sample quotes. These arrays are data, not live market feeds.
  const assets = [
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'stocks', price: 231.41, changePct: 1.24, marketSize: '$3.48T', volume: 41200000 },
    { symbol: 'MSFT', name: 'Microsoft', type: 'stocks', price: 428.15, changePct: 0.62, marketSize: '$3.18T', volume: 18400000 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stocks', price: 138.72, changePct: 4.62, marketSize: '$3.40T', volume: 289000000 },
    { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stocks', price: 248.19, changePct: -3.42, marketSize: '$0.79T', volume: 96400000 },
    { symbol: 'JPM', name: 'JPMorgan Chase', type: 'stocks', price: 241.8, changePct: 0.31, marketSize: '$0.69T', volume: 8900000 },

    { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'etfs', price: 525.64, changePct: 0.84, marketSize: '$1.21T', volume: 5800000 },
    { symbol: 'VTI', name: 'Vanguard Total Market ETF', type: 'etfs', price: 291.35, changePct: 0.79, marketSize: '$0.48T', volume: 3200000 },
    { symbol: 'QQQ', name: 'Invesco Nasdaq 100 ETF', type: 'etfs', price: 512.4, changePct: 1.05, marketSize: '$0.31T', volume: 41600000 },
    { symbol: 'VXUS', name: 'Vanguard Total Intl. ETF', type: 'etfs', price: 63.12, changePct: -0.24, marketSize: '$0.09T', volume: 2700000 },

    { symbol: 'SPX', name: 'S&P 500 Index', type: 'indices', price: 5842.91, changePct: 0.74, marketSize: null, volume: null },
    { symbol: 'IXIC', name: 'Nasdaq Composite', type: 'indices', price: 18712.75, changePct: 1.12, marketSize: null, volume: null },
    { symbol: 'NIFTY', name: 'Nifty 50', type: 'indices', price: 24854.3, changePct: 0.42, marketSize: null, volume: null },

    { symbol: 'AGG', name: 'iShares Core Bond ETF', type: 'bonds', price: 101.82, changePct: -0.12, marketSize: '$112B', volume: 8100000 },
    { symbol: 'BND', name: 'Vanguard Total Bond ETF', type: 'bonds', price: 73.44, changePct: -0.08, marketSize: '$68B', volume: 4700000 },

    { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'commodities', price: 252.81, changePct: 0.18, marketSize: '$76B', volume: 6300000 },
    { symbol: 'SLV', name: 'iShares Silver Trust', type: 'commodities', price: 31.27, changePct: -0.42, marketSize: '$14B', volume: 12100000 },

    { symbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'currencies', price: 1.0842, changePct: -0.11, marketSize: null, volume: null, decimals: 4 },
    { symbol: 'USD/INR', name: 'US Dollar / Indian Rupee', type: 'currencies', price: 84.12, changePct: 0.05, marketSize: null, volume: null }
  ];

  // Big index cards on market-overview.html plus the home page ticker strip.
  const indices = [
    { name: 'S&P 500', value: 5842.91, changePct: 0.74, format: 'points' },
    { name: 'NASDAQ', value: 18712.75, changePct: 1.12, format: 'points' },
    { name: 'DOW JONES', value: 42387.57, changePct: -0.21, format: 'points' },
    { name: 'NIFTY 50', value: 24854.3, changePct: 0.42, format: 'points' },
    { name: 'SENSEX', value: 81361.87, changePct: 0.36, format: 'points' },
    { name: 'GOLD', value: 2735.4, changePct: 0.18, format: 'usd' }
  ];

  // Fixed sample points make range switching easy to explain: choose an array, redraw the line.
  const charts = {
    '1D': [100, 101, 100, 103, 102, 105, 104, 106],
    '1W': [100, 98, 103, 101, 108, 105, 110, 112],
    '1M': [100, 104, 101, 108, 106, 112, 110, 118],
    '3M': [100, 102, 109, 105, 114, 112, 122, 125],
    '1Y': [100, 108, 104, 116, 112, 124, 120, 132],
    '5Y': [100, 112, 108, 124, 120, 138, 146, 160],
    All: [100, 105, 115, 110, 128, 124, 140, 154]
  };

  const ticker = indices.slice(0, 5);

  // Articles are fictional demonstration content; Home and News both read this one catalog.
  const news = [
    {
      category: 'Global markets',
      readMins: 6,
      date: 'Oct 28, 2025',
      title: 'What a changing rate cycle means for investors',
      excerpt: 'Principles and context for navigating complexity with confidence.',
      imageClass: 'img-news-1',
      body: [
        'When central banks pause or reverse a hiking cycle, the assets that led the previous decade rarely lead the next one. Long-duration bonds start to earn their place again, and the discount rate applied to future earnings stops rising for the first time in two years.',
        'For a passive investor the practical question is not "which sector wins" but "is my allocation still the one I chose". A balanced plan rebalances back to target rather than chasing the new leader, which is exactly the discipline that keeps drawdowns survivable.'
      ]
    },
    {
      category: 'Economy',
      readMins: 6,
      date: 'Oct 26, 2025',
      title: 'Reading the signals beneath headline volatility',
      excerpt: 'Principles and context for navigating complexity with confidence.',
      imageClass: 'img-news-2',
      body: [
        'Daily index moves are the loudest number on a terminal and usually the least informative. Credit spreads, earnings revisions and the shape of the yield curve carry more information about where the cycle is heading than a single afternoon of price action.',
        'Index funds spare you from acting on those signals every day, which is a feature. Reviewing them quarterly is enough to decide whether your target allocation still matches your horizon.'
      ]
    },
    {
      category: 'Technology',
      readMins: 5,
      date: 'Oct 24, 2025',
      title: 'Concentration risk is hiding inside your index fund',
      excerpt: 'Principles and context for navigating complexity with confidence.',
      imageClass: 'img-news-3',
      body: [
        'A market-cap weighted index is a momentum strategy in disguise. When the largest seven companies make up a third of the index, "diversified" stops meaning what most investors assume it means.',
        'Equal-weight and international funds are the usual antidotes. The trade-off is tracking error, and that is fine as long as the deviation is deliberate and written down before the year starts.'
      ]
    },
    {
      category: 'ETFs',
      readMins: 4,
      date: 'Oct 22, 2025',
      title: 'The one number that quietly decides your long-term return',
      excerpt: 'Principles and context for navigating complexity with confidence.',
      imageClass: 'img-news-1',
      body: [
        'Expense ratios are charged on your whole balance every year, which makes them compound against you. A 1.2% fund and a 0.05% fund tracking the same market diverge by roughly a quarter of your final balance over thirty years.',
        'Before comparing returns, compare costs. It is the only part of a fund\'s future you can actually measure today.'
      ]
    },
    {
      category: 'Stocks',
      readMins: 7,
      date: 'Oct 20, 2025',
      title: 'Earnings season without the noise',
      excerpt: 'Principles and context for navigating complexity with confidence.',
      imageClass: 'img-news-2',
      body: [
        'Three quarters of reported results beat a lowered estimate, so "beat" on its own tells you very little. Revenue trajectory and forward guidance revisions are the parts that survive the press release.',
        'For a passive holder, earnings season is mostly a reminder that individual stock outcomes are wide. Diversification is how you stop one disappointing report from becoming your whole year.'
      ]
    },
    {
      category: 'Global markets',
      readMins: 5,
      date: 'Oct 17, 2025',
      title: 'Currency moves and your international allocation',
      excerpt: 'Principles and context for navigating complexity with confidence.',
      imageClass: 'img-news-3',
      body: [
        'An unhedged international fund gives you foreign equity returns plus a currency bet. In a strong dollar year that bet can wipe out an otherwise healthy equity gain.',
        'Choose hedged or unhedged deliberately, based on what you spend in rather than what the dollar did last quarter.'
      ]
    }
  ];

  // Supplementary overview rows are sample data rather than calculations from the holdings.
  const sectors = [
    { label: 'Technology', changePct: 1.82 },
    { label: 'Financials', changePct: 0.64 },
    { label: 'Energy', changePct: -0.38 },
    { label: 'Healthcare', changePct: 0.21 },
    { label: 'Industrials', changePct: 0.12 },
    { label: 'Utilities', changePct: -0.09 }
  ];

  const movers = [
    { symbol: 'NVDA', changePct: 4.62 },
    { symbol: 'AVGO', changePct: 3.1 },
    { symbol: 'MSFT', changePct: 2.18 },
    { symbol: 'AMD', changePct: 1.84 },
    { symbol: 'INTC', changePct: -1.95 },
    { symbol: 'TSLA', changePct: -3.42 }
  ];

  const macro = [
    { label: 'US 10Y', value: '4.18%' },
    { label: 'VIX', value: '18.62' },
    { label: 'DXY', value: '103.84' },
    { label: 'Fed rate', value: '5.25%' }
  ];

  // Store shares/average cost once; use catalog prices to derive current sample value and gain.
  const portfolio = {
    cash: 3196.15,
    positions: [
      { symbol: 'VOO', shares: 40, averageCost: 450 },
      { symbol: 'AAPL', shares: 120, averageCost: 190 },
      { symbol: 'MSFT', shares: 60, averageCost: 380 },
      { symbol: 'AGG', shares: 300, averageCost: 102 },
      { symbol: 'GLD', shares: 80, averageCost: 210 }
    ]
  };
  // Add each position's cost and value to the cash balance using a normal loop.
  portfolio.cost = portfolio.cash;
  portfolio.value = portfolio.cash;
  portfolio.positions.forEach(function (position) {
    const asset = assets.find(function (item) { return item.symbol === position.symbol; });
    position.name = asset.name;
    position.price = asset.price;
    portfolio.cost += position.shares * position.averageCost;
    portfolio.value += position.shares * position.price;
  });
  portfolio.gain = portfolio.value - portfolio.cost;
  portfolio.returnPct = portfolio.gain / portfolio.cost * 100;

  // Publish the catalog for later script tags; data.js must load before page controllers that use it.
  window.STOCKPIE = {
    assets: assets,
    portfolio: portfolio,
    indices: indices,
    ticker: ticker,
    news: news,
    sectors: sectors,
    movers: movers,
    macro: macro,
    charts: charts
  };
})();
