'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewTickerTape() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    if (container.current.querySelector('script')) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          { "proName": "BINANCE:BTCUSD", "title": "BTC/USD" },
          { "proName": "BINANCE:ETHUSD", "title": "ETH/USD" },
          { "proName": "BINANCE:BNBUSD", "title": "BNB/USD" },
          { "proName": "BINANCE:SOLUSD", "title": "SOL/USD" },
          { "proName": "BINANCE:XRPUSD", "title": "XRP/USD" },
          { "proName": "BINANCE:ADAUSD", "title": "ADA/USD" },
          { "proName": "BINANCE:DOGEUSD", "title": "DOGE/USD" },
          { "proName": "BINANCE:DOTUSD", "title": "DOT/USD" },
          { "proName": "BINANCE:AVAXUSD", "title": "AVAX/USD" },
          { "proName": "BINANCE:LINKUSD", "title": "LINK/USD" }
        ],
        "showSymbolLogo": true,
        "isTransparent": true,
        "displayMode": "adaptive",
        "colorTheme": "dark",
        "locale": "en"
      }`;

    container.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TradingViewTickerTape);
