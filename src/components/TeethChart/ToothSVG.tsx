import React, { useEffect, useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import type { ToothStatus, TeethMap } from '../../types/teeth';
import { STATUS_COLORS, UPPER_RIGHT, UPPER_LEFT, LOWER_LEFT, LOWER_RIGHT } from '../../types/teeth';

interface ToothSVGProps {
  teethData: TeethMap;
  onToothClick: (toothNumber: number) => void;
  onToothContextMenu: (e: React.MouseEvent, toothNumber: number) => void;
  readOnly?: boolean;
}

// Dental arch layout (viewer's perspective, left to right)
const UPPER_TEETH = [...UPPER_RIGHT, ...UPPER_LEFT];
const LOWER_TEETH = [...LOWER_RIGHT, ...LOWER_LEFT];
const ALL_TEETH = [...UPPER_TEETH, ...LOWER_TEETH];

interface ToothSvgData {
  viewBox: string;
  toothPath: string;
  width: number;
  height: number;
}

function parseSvg(text: string): ToothSvgData | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  const paths = doc.querySelectorAll('path');
  if (!svg || !paths[0]) return null;

  const viewBox = svg.getAttribute('viewBox') || '0 0 100 100';
  const [, , w, h] = viewBox.split(' ').map(Number);

  return {
    viewBox,
    toothPath: paths[0].getAttribute('d') || '',
    width: w,
    height: h,
  };
}

// Individual tooth component
const SingleTooth: React.FC<{
  num: number;
  data: ToothSvgData | null;
  status: ToothStatus;
  isLower: boolean;
  readOnly: boolean;
  statusLabel: string;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}> = ({ num, data, status, isLower, readOnly, statusLabel, onClick, onContextMenu }) => {
  const [hovered, setHovered] = useState(false);

  const color = STATUS_COLORS[status];
  const isMissing = status === 'missing';

  if (!data) {
    return (
      <div className="flex flex-col items-center" style={{ width: 32 }}>
        <div className="w-full h-20 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !readOnly && onClick()}
      onContextMenu={(e) => {
        if (readOnly) return;
        e.preventDefault();
        onContextMenu(e);
      }}
      style={{ cursor: readOnly ? 'default' : 'pointer' }}
    >
      {/* Tooth number — upper */}
      {!isLower && (
        <span
          className={`text-[10px] leading-none font-bold transition-colors ${
            hovered ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {num}
        </span>
      )}

      {/* Tooth SVG */}
      <svg
        viewBox={data.viewBox}
        style={{
          width: Math.max(18, data.width * 0.55),
          height: data.height * 0.55,
          // transform: isLower ? 'scaleY(-1)' : undefined,
          transition: 'filter 0.2s ease',
          filter: hovered ? 'drop-shadow(0 0 3px rgba(0,0,0,0.3))' : 'none',
        }}
      >
        <path
          d={data.toothPath}
          fill={isMissing ? '#E5E7EB' : color}
          fillOpacity={hovered ? 1 : isMissing ? 0.3 : 0.7}
          stroke={hovered ? '#1E293B' : '#64748B'}
          strokeWidth={hovered ? 2 : 0.5}
          style={{ transition: 'all 0.2s ease' }}
        />
      </svg>

      {/* Tooth number — lower */}
      {isLower && (
        <span
          className={`text-[10px] leading-none font-bold transition-colors ${
            hovered ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {num}
        </span>
      )}

      {/* Tooltip */}
      {hovered && (
        <div
          className="absolute z-50 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-medium rounded-md shadow-lg whitespace-nowrap pointer-events-none"
          style={{
            [isLower ? 'bottom' : 'top']: '-24px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {num} — {statusLabel}
        </div>
      )}
    </div>
  );
};

export const ToothSVG: React.FC<ToothSVGProps> = ({
  teethData,
  onToothClick,
  onToothContextMenu,
  readOnly = false,
}) => {
  const { t } = useLocalization();
  const [svgCache, setSvgCache] = useState<Record<number, ToothSvgData>>({});

  // Fetch and parse all individual tooth SVGs once on mount
  useEffect(() => {
    Promise.all(
      ALL_TEETH.map((num) =>
        fetch(`/tooth/${num}.svg`)
          .then((r) => r.text())
          .then((text) => ({ num, data: parseSvg(text) }))
          .catch(() => ({ num, data: null }))
      )
    ).then((results) => {
      const cache: Record<number, ToothSvgData> = {};
      results.forEach(({ num, data }) => {
        if (data) cache[num] = data;
      });
      setSvgCache(cache);
    });
  }, []);

  const getStatus = (num: number): ToothStatus =>
    (teethData[String(num)]?.status as ToothStatus) || 'healthy';

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex flex-col items-center min-w-full px-2 py-4">
        {/* Upper jaw */}
        <div className="flex justify-center items-end gap-px">
          {UPPER_TEETH.map((num) => {
            const status = getStatus(num);
            return (
              <SingleTooth
                key={num}
                num={num}
                data={svgCache[num] || null}
                status={status}
                isLower={false}
                readOnly={readOnly}
                statusLabel={t.teeth.statuses[status]}
                onClick={() => onToothClick(num)}
                onContextMenu={(e) => onToothContextMenu(e, num)}
              />
            );
          })}
        </div>

        {/* Bite line */}
        <div className="w-full flex items-center my-1.5">
          <div className="flex-1 border-t border-dashed border-gray-300" />
        </div>

        {/* Lower jaw */}
        <div className="flex justify-center items-start gap-px">
          {LOWER_TEETH.map((num) => {
            const status = getStatus(num);
            return (
              <SingleTooth
                key={num}
                num={num}
                data={svgCache[num] || null}
                status={status}
                isLower={true}
                readOnly={readOnly}
                statusLabel={t.teeth.statuses[status]}
                onClick={() => onToothClick(num)}
                onContextMenu={(e) => onToothContextMenu(e, num)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
