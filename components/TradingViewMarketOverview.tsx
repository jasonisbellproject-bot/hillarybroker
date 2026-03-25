'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewMarketOverview() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    if (container.current.querySelector('script')) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "colorTheme": "dark",
        "dateRange": "1D",
        "showChart": true,
        "locale": "en",
        "width": "100%",
        "height": "100%",
        "largeChartUrl": "",
        "isTransparent": true,
        "showSymbolLogo": true,
        "showFloatingTooltip": true,
        "plotLineColorGrowing": "rgba(34, 197, 94, 1)",
        "plotLineColorFalling": "rgba(239, 68, 68, 1)",
        "gridLineColor": "rgba(255, 255, 255, 0.06)",
        "scaleFontColor": "rgba(255, 255, 255, 0.5)",
        "belowLineFillColorGrowing": "rgba(34, 197, 94, 0.12)",
        "belowLineFillColorFalling": "rgba(239, 68, 68, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(34, 197, 94, 0)",
        "belowLineFillColorFallingBottom": "rgba(239, 68, 68, 0)",
        "symbolActiveColor": "rgba(34, 197, 94, 0.12)",
        "tabs": [
          {
            "title": "Crypto",
            "symbols": [
              { "s": "BINANCE:BTCUSD", "d": "Bitcoin" },
              { "s": "BINANCE:ETHUSD", "d": "Ethereum" },
              { "s": "BINANCE:BNBUSD", "d": "BNB" },
              { "s": "BINANCE:SOLUSD", "d": "Solana" },
              { "s": "BINANCE:XRPUSD", "d": "XRP" },
              { "s": "BINANCE:ADAUSD", "d": "Cardano" }
            ],
            "originalTitle": "Crypto"
          },
          {
            "title": "DeFi",
            "symbols": [
              { "s": "BINANCE:LINKUSD", "d": "Chainlink" },
              { "s": "BINANCE:UNIUSD", "d": "Uniswap" },
              { "s": "BINANCE:AAVEUSD", "d": "Aave" },
              { "s": "BINANCE:MKRUSD", "d": "Maker" }
            ],
            "originalTitle": "DeFi"
          }
        ]
      }`;

    container.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

export default memo(TradingViewMarketOverview);
