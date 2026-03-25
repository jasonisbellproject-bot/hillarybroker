'use client';

import React, { useEffect, useRef, memo } from 'react';

interface HotlistWidgetProps {
  width?: string;
  height?: string;
}

function TradingViewHotlist({ width = "100%", height = "100%" }: HotlistWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    if (container.current.querySelector('script')) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "colorTheme": "dark",
        "dateRange": "1D",
        "exchange": "CRYPTO",
        "showChart": true,
        "locale": "en",
        "largeChartUrl": "",
        "isTransparent": true,
        "showSymbolLogo": true,
        "showFloatingTooltip": true,
        "width": "${width}",
        "height": "${height}",
        "plotLineColorGrowing": "rgba(34, 197, 94, 1)",
        "plotLineColorFalling": "rgba(239, 68, 68, 1)",
        "gridLineColor": "rgba(255, 255, 255, 0.06)",
        "scaleFontColor": "rgba(255, 255, 255, 0.5)",
        "belowLineFillColorGrowing": "rgba(34, 197, 94, 0.12)",
        "belowLineFillColorFalling": "rgba(239, 68, 68, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(34, 197, 94, 0)",
        "belowLineFillColorFallingBottom": "rgba(239, 68, 68, 0)",
        "symbolActiveColor": "rgba(34, 197, 94, 0.12)"
      }`;

    container.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

export default memo(TradingViewHotlist);
