import { useState, useEffect } from "react";
import type { FC } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
}

function generateInitialData(days: number = 30): number[] {
  const data: number[] = [];
  let base = 142000;
  for (let i = 0; i < days; i++) {
    base += (Math.random() - 0.42) * 8000;
    if (base < 80000) base = 80000;
    data.push(Math.round(base));
  }
  return data;
}

const Sparkline: FC<SparklineProps> = ({ data, width = 480, height = 140 }) => {
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const pad = { top: 8, right: 8, bottom: 8, left: 8 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;

  const px = (i: number): number => pad.left + (i / (data.length - 1)) * W;
  const py = (v: number): number => pad.top + H - ((v - min) / (max - min || 1)) * H;

  const points = data.map((v, i) => `${px(i)},${py(v)}`).join(" L ");
  const linePath = `M ${points}`;
  const fillPath = `M ${px(0)},${pad.top + H} L ${points} L ${px(data.length - 1)},${pad.top + H} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      style={{ display: "block" }}
      role="img"
      aria-label="Revenue trend chart"
    >
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      <path d={fillPath} fill="url(#revGrad)" />
      <path
        d={linePath}
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const RevenueChart: FC = () => {
  const [data, setData] = useState<number[]>(() => generateInitialData(30));

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev: number[]) => {
        const last = prev[prev.length - 1];
        const newVal = Math.max(60000, Math.round(last + (Math.random() - 0.45) * 6000));
        return [...prev.slice(1), newVal];
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return <Sparkline data={data} />;
};

export { RevenueChart };