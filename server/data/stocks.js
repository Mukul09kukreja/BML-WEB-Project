// Stocks: server logic and supporting functions.
// NSE stocks available through Yahoo Finance's .NS ticker suffix.
module.exports = [
  ['RELIANCE', 'Reliance Industries'],
  ['TCS', 'Tata Consultancy Services'],
  ['INFY', 'Infosys'],
  ['HDFCBANK', 'HDFC Bank'],
  ['ICICIBANK', 'ICICI Bank'],
  ['AXISBANK', 'Axis Bank'],
  ['TATAMOTORS', 'Tata Motors'],
  ['SBIN', 'State Bank of India'],
  ['WIPRO', 'Wipro'],
  ['ITC', 'ITC Limited']
].map(([symbol, name]) => ({ symbol, name, exchange: 'NSE' }));
