import json
import sys

import pandas as pd
import yfinance as yf


def main():
    symbols = json.loads(sys.argv[1])
    tickers = [item["ticker"] for item in symbols]
    frame = yf.download(
        tickers=tickers,
        period="5d",
        interval="5m",
        group_by="ticker",
        auto_adjust=False,
        prepost=False,
        progress=False,
        threads=True,
        timeout=20,
    )

    prices = {}
    if frame is None or frame.empty:
        print(json.dumps(prices))
        return

    for item in symbols:
        ticker = item["ticker"]
        try:
            if isinstance(frame.columns, pd.MultiIndex):
                if ticker in frame.columns.get_level_values(0):
                    history = frame[ticker]
                elif ticker in frame.columns.get_level_values(1):
                    history = frame.xs(ticker, axis=1, level=1)
                else:
                    continue
            else:
                history = frame

            close = history["Close"].dropna()
            if close.empty:
                continue

            daily_close = close.groupby(close.index.date).last()
            price = float(daily_close.iloc[-1])
            previous = float(daily_close.iloc[-2]) if len(daily_close) > 1 else None
            change = ((price / previous) - 1) * 100 if previous else None
            prices[item["symbol"]] = {
                "price": price,
                "changePct": change,
                "timestamp": close.index[-1].isoformat(),
            }
        except (KeyError, IndexError, TypeError, ValueError):
            continue

    print(json.dumps(prices))


if __name__ == "__main__":
    main()
