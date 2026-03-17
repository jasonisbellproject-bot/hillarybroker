"use client";
import Link from 'next/link';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { TrendingUp, Gift, Users, Coins } from 'lucide-react';

interface BtcData {
  price: number | null;
  high: number | null;
  low: number | null;
  change: number | null;
  loading: boolean;
  error: string | null;
}

export default function HeroSection() {
  const [btcData, setBtcData] = useState<BtcData>({
    price: null,
    high: null,
    low: null,
    change: null,
    loading: true,
    error: null
  });
  const [btcChartData, setBtcChartData] = useState<number[]>([]);
  const [btcChartLabels, setBtcChartLabels] = useState<string[]>([]);
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function fetchBTC() {
      try {
        setBtcData(prev => ({ ...prev, loading: true, error: null }));
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_high=true&include_24hr_low=true&include_24hr_change=true');
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        setBtcData({
          price: data.bitcoin.usd,
          high: data.bitcoin.usd_24h_high,
          low: data.bitcoin.usd_24h_low,
          change: data.bitcoin.usd_24h_change,
          loading: false,
          error: null
        });
      } catch (e) {
        setBtcData(prev => ({ ...prev, loading: false, error: 'Failed to load BTC data' }));
      }
    }
    fetchBTC();
    const interval = setInterval(fetchBTC, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchBTCChart() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily');
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        const prices = data.prices.map((p: [number, number]) => p[1]);
        const labels = data.prices.map((p: [number, number]) => {
          const d = new Date(p[0]);
          return `${d.getMonth() + 1}/${d.getDate()}`;
        });
        setBtcChartData(prices);
        setBtcChartLabels(labels);
      } catch (e) {
        setBtcChartData([]);
        setBtcChartLabels([]);
      }
    }
    fetchBTCChart();
  }, []);

  useEffect(() => {
    let chartInstance: ChartJS | null = null;
    if (chartRef.current && btcChartData.length > 0 && btcChartLabels.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;
      chartInstance = new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: btcChartLabels,
          datasets: [
            {
              label: 'BTC Price',
              data: btcChartData,
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              tension: 0.4,
              pointRadius: 0,
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            x: {
              display: true,
              grid: { display: false },
              ticks: { color: '#374151', font: { size: 10 } },
            },
            y: {
              display: false,
              grid: { display: false },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [btcChartData, btcChartLabels]);

  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <section className="pt-32 pb-20 px-0 sm:px-0 lg:px-0 w-full flex items-stretch min-h-[70vh] border border-green-500/30 bg-gray-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl relative overflow-hidden" style={{ boxShadow: '0 8px 32px 0 rgba(34, 197, 94, 0.15), 0 1.5px 8px 0 rgba(34, 197, 94, 0.10)' }}>
      <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'linear-gradient(120deg,rgba(0,0,0,0.08) 0%,rgba(34,197,94,0.08) 100%)', zIndex: 1 }} />
      <Particles
        id="tsparticles"
        className="fixed inset-0 z-0"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: 0 },
          background: { color: "#111827" },
          particles: {
            number: { value: 30, density: { enable: true, area: 800 } },
            color: { value: "#22c55e" },
            shape: {
              type: ["image", "circle"],
              image: [
                {
                  src: "https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/rocket.svg",
                  width: 32,
                  height: 32,
                },
              ],
            },
            opacity: { value: 0.5 },
            size: { value: 6, random: { enable: true, minimumValue: 3 } },
            move: {
              enable: true,
              speed: 1,
              direction: "right",
              random: false,
              straight: false,
              outModes: { default: "out" },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: false },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              push: { quantity: 2 },
            },
          },
          detectRetina: false,
        }}
      />
      <div className="relative z-10 flex flex-col lg:flex-row gap-10 w-full h-full items-stretch justify-between">
        {/* Hero Card Content */}
        <div className="flex-1 flex flex-col items-start justify-center p-10 min-w-0">
          <span className="relative z-10 inline-block bg-green-500/80 text-white font-semibold px-4 py-1 rounded-full mb-4 text-sm shadow-lg shadow-green-500/20">🤩 Award-winning investing firm</span>
          <h1 className="relative z-10 text-5xl md:text-6xl font-extrabold mb-6 text-foreground leading-tight drop-shadow-[0_2px_16px_rgba(34,197,94,0.15)]">
            We are focused on <br />
            <span className="text-green-600 drop-shadow-[0_2px_16px_rgba(34,197,94,0.25)]">Disruptive Innovation</span>
          </h1>
          <p className="relative z-10 text-lg md:text-2xl text-muted-foreground mb-8 max-w-xl drop-shadow-[0_1px_8px_rgba(0,0,0,0.10)]">
            With a commitment to excellence and a passion for wealth creation, we specialize in empowering investors like you to navigate the complexities of the financial markets with confidence.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full">
            <Link 
              href="/signup" 
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-green-500/30 border border-green-400/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ boxShadow: '0 2px 16px 0 rgba(34,197,94,0.15)' }}
              aria-label="Sign up to start earning with Clearway Capital"
            >
              Get Started
            </Link>
            <Link 
              href="/services" 
              className="flex-1 bg-gray-800/80 hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 border border-green-500/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Learn more about Clearway Capital services"
            >
              Learn More
            </Link>
          </div>
        </div>
        {/* Right Column - Ticker Card */}
        <div className="flex-1 flex items-center justify-end w-full min-w-0">
          <div className="p-6 w-full max-w-md relative rounded-2xl bg-gray-800/90 border border-green-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <img src="https://res.cloudinary.com/dfwysasj5/image/upload/v1/media_cdn/IMG_4796_v4smby" alt="BTC" className="w-8 h-8" />
                <span className="text-foreground font-bold text-lg">BTC/USDT</span>
              </div>
              <div className="text-right">
                {btcData.loading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : btcData.error ? (
                  <div className="text-red-500 text-xs">{btcData.error}</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-foreground">
                      {typeof btcData.price === 'number' ? `$${btcData.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '--'}
                    </div>
                    <div className={btcData.change != null && btcData.change >= 0 ? "text-green-600 text-sm font-semibold" : "text-red-600 text-sm font-semibold"}>
                      {btcData.change != null ? `${btcData.change >= 0 ? '+' : ''}${btcData.change.toFixed(2)}%` : '--'}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-6 h-32 w-full">
              <canvas ref={chartRef} className="w-full h-full" />
            </div>
            <div className="flex items-center justify-between mb-2 text-muted-foreground text-xs">
              <span>24h High: <span className="text-foreground">{btcData.loading || btcData.error || typeof btcData.high !== 'number' ? '--' : `$${btcData.high.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}</span></span>
              <span>24h Low: <span className="text-foreground">{btcData.loading || btcData.error || typeof btcData.low !== 'number' ? '--' : `$${btcData.low.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}</span></span>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Recent Activities</h4>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li>Buy: 0.025 BTC @ $65,432.10</li>
                <li>Copy Trade: +$1,250 profit</li>
                <li>Stake: 0.1 BTC in Flexible Pool</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}