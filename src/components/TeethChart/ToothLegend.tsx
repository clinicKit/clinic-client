import React from 'react';
import type { ToothStatus } from '../../types/teeth';
import { useLocalization } from '../../hooks/useLocalization';
import { STATUS_COLORS, TOOTH_STATUSES } from '../../types/teeth';

export const ToothLegend: React.FC = () => {
  const { t } = useLocalization();
  const statuses: ToothStatus[] = TOOTH_STATUSES;

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {statuses.map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: STATUS_COLORS[s] }}
          />
          <span className="text-sm text-text-secondary">{t.teeth.statuses[s]}</span>
        </div>
      ))}
    </div>
  );
};
