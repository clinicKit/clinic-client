import React, { useEffect, useRef } from 'react';
import type { ToothStatus } from '../../types/teeth';
import { useLocalization } from '../../hooks/useLocalization';
import { STATUS_COLORS, TOOTH_STATUSES } from '../../types/teeth';
import { Eye, ImagePlus } from 'lucide-react';

interface ToothContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  toothNumber: number;
  onClose: () => void;
  onStatusChange: (toothNumber: number, status: ToothStatus) => void;
  onOpenDetails: (toothNumber: number) => void;
  onAddImage: (toothNumber: number) => void;
}

export const ToothContextMenu: React.FC<ToothContextMenuProps> = ({
  visible,
  x,
  y,
  toothNumber,
  onClose,
  onStatusChange,
  onOpenDetails,
  onAddImage,
}) => {
  const { t, interpolate } = useLocalization();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (visible) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [visible, onClose]);

  if (!visible) return null;

  // Adjust position so menu doesn't overflow viewport
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 360);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 w-52 animate-in"
      style={{ left: adjustedX, top: adjustedY }}
    >
      <div className="px-3 py-2 border-b border-gray-100">
        <p className="text-xs font-semibold text-text-muted">{interpolate(t.teeth.toothLabel, { number: toothNumber })}</p>
      </div>

      {/* Status options */}
      <div className="py-1">
        {TOOTH_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => {
              onStatusChange(toothNumber, s);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: STATUS_COLORS[s] }}
            />
            <span>{t.teeth.statuses[s]}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-gray-100 py-1">
        <button
          onClick={() => {
            onOpenDetails(toothNumber);
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
        >
          <Eye size={14} className="text-text-muted" />
          <span>{t.teeth.contextMenu.openDetails}</span>
        </button>
        <button
          onClick={() => {
            onAddImage(toothNumber);
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
        >
          <ImagePlus size={14} className="text-text-muted" />
          <span>{t.teeth.contextMenu.addImage}</span>
        </button>
      </div>
    </div>
  );
};
