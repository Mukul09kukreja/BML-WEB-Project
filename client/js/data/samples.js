// Samples: browser page behavior and helpers.
// Educational articles and the illustrative landing-page chart.
// Market prices and portfolios come from the server.
(function () {
  'use strict';

  // Fixed sample points make range switching easy to explain: choose an array, redraw the line.
  const charts = {
    '1W': [100, 98, 103, 101, 108, 105, 110, 112],
    '1M': [100, 104, 101, 108, 106, 112, 110, 118],
    '1Y': [100, 108, 104, 116, 112, 124, 120, 132],
    '5Y': [100, 112, 108, 124, 120, 138, 146, 160],
  };

  // Articles are fictional demonstration content; Home and News both read this one catalog.
  const news = [
    {
      category: 'Global markets',
      date: 'Oct 28, 2025',
      title: 'What a changing rate cycle means for investors',
      excerpt: 'Explore how interest-rate changes can affect different asset classes.',
      imageClass: 'img-news-1',
      body: [
        'When central banks pause or reverse a hiking cycle, the assets that led the previous decade rarely lead the next one. Long-duration bonds start to earn their place again, and the discount rate applied to future earnings stops rising for the first time in two years.',
        'For a passive investor the practical question is not "which sector wins" but "is my allocation still the one I chose". A balanced plan rebalances back to target rather than chasing the new leader, which is exactly the discipline that keeps drawdowns survivable.'
      ]
    },
    {
      category: 'Economy',
      date: 'Oct 26, 2025',
      title: 'Reading the signals beneath headline volatility',
      excerpt: 'Look beyond daily price swings to understand the questions behind the headlines.',
      imageClass: 'img-news-2',
      body: [
        'Daily index moves are the loudest number on a terminal and usually the least informative. Credit spreads, earnings revisions and the shape of the yield curve carry more information about where the cycle is heading than a single afternoon of price action.',
        'Index funds spare you from acting on those signals every day, which is a feature. Reviewing them quarterly is enough to decide whether your target allocation still matches your horizon.'
      ]
    },
    {
      category: 'Technology',
      date: 'Oct 24, 2025',
      title: 'Concentration risk is hiding inside your index fund',
      excerpt: 'Learn why holding an index fund does not mean every company has an equal weight.',
      imageClass: 'img-news-3',
      body: [
        'A market-cap weighted index is a momentum strategy in disguise. When the largest seven companies make up a third of the index, "diversified" stops meaning what most investors assume it means.',
        'Equal-weight and international funds are the usual antidotes. The trade-off is tracking error, and that is fine as long as the deviation is deliberate and written down before the year starts.'
      ]
    },
    {
      category: 'ETFs',
      date: 'Oct 22, 2025',
      title: 'The one number that quietly decides your long-term return',
      excerpt: 'Understand how recurring fund fees affect what stays invested over time.',
      imageClass: 'img-news-1',
      body: [
        'Expense ratios are charged on your whole balance every year, which makes them compound against you. A 1.2% fund and a 0.05% fund tracking the same market diverge by roughly a quarter of your final balance over thirty years.',
        'Before comparing returns, compare costs. It is the only part of a fund\'s future you can actually measure today.'
      ]
    },
    {
      category: 'Stocks',
      date: 'Oct 20, 2025',
      title: 'Earnings season without the noise',
      excerpt: 'A guide to reading company results in the context of a diversified portfolio.',
      imageClass: 'img-news-2',
      body: [
        'Three quarters of reported results beat a lowered estimate, so "beat" on its own tells you very little. Revenue trajectory and forward guidance revisions are the parts that survive the press release.',
        'For a passive holder, earnings season is mostly a reminder that individual stock outcomes are wide. Diversification is how you stop one disappointing report from becoming your whole year.'
      ]
    },
    {
      category: 'Global markets',
      date: 'Oct 17, 2025',
      title: 'Currency moves and your international allocation',
      excerpt: 'See how exchange rates add another dimension to overseas investments.',
      imageClass: 'img-news-3',
      body: [
        'An unhedged international fund gives you foreign equity returns plus a currency bet. In a strong dollar year that bet can wipe out an otherwise healthy equity gain.',
        'Choose hedged or unhedged deliberately, based on what you spend in rather than what the dollar did last quarter.'
      ]
    }
  ];

  window.STOCKPIE = { news, charts };
})();
