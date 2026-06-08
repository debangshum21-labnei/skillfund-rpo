import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");
  const symbol = searchParams.get("symbol");

  if (!ticker) {
    return NextResponse.json({ error: "Missing ticker" }, { status: 400 });
  }

  // Define static fallback prices
  const fallbackPrices: Record<string, number> = {
    "AAPL": 189.5,
    "EURUSD": 1.0861,
    "BTCUSDT": 62021,
    "XAUUSD": 2326.5,
    "NIFTY50": 22400,
  };

  try {
    let price: number | null = null;

    if (ticker === "BTCUSDT") {
      // Fetch from Binance public API (keyless, CORS-enabled, reliable)
      const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", {
        next: { revalidate: 5 } // cache for 5 seconds
      });
      if (res.ok) {
        const data = await res.json();
        price = parseFloat(data.price);
      }
    } else if (ticker === "EURUSD") {
      // Fetch from a free public exchange rate API (keyless, reliable)
      const res = await fetch("https://open.er-api.com/v6/latest/USD", {
        next: { revalidate: 30 } // cache for 30 seconds
      });
      if (res.ok) {
        const data = await res.json();
        const rate = data?.rates?.EUR;
        if (rate) {
          price = 1 / rate; // EUR/USD rate is 1 / USD/EUR rate
        }
      }
    } else {
      // Try to fetch from Yahoo Finance chart endpoint.
      // If we are rate-limited, this will fail and fall back gracefully.
      let yfSymbol = ticker;
      if (ticker === "XAUUSD") yfSymbol = "GC=F";
      else if (ticker === "NIFTY50") yfSymbol = "^NSEI";

      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${yfSymbol}?interval=1m&range=1d`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          },
          next: { revalidate: 10 } // cache for 10 seconds
        }
      );

      if (res.ok) {
        const data = await res.json();
        const regularMarketPrice = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
        if (regularMarketPrice) {
          price = regularMarketPrice;
        }
      }
    }

    if (price !== null && !isNaN(price)) {
      return NextResponse.json({ price, mock: false });
    } else {
      // Return the fallback price but indicate it's mock
      const fallback = fallbackPrices[ticker] || 100;
      return NextResponse.json({ price: fallback, mock: true });
    }
  } catch (err) {
    const fallback = fallbackPrices[ticker] || 100;
    return NextResponse.json({ price: fallback, mock: true });
  }
}
