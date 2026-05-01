import { useApi } from '../../hooks/useApi';
import { useLocalization } from '../../hooks/useLocalization';
import { Card } from '../ui/Card';
import { CalendarCheck, CalendarX, UserX, Percent } from 'lucide-react';

interface Stats {
  total: number;
  confirmed: number;
  cancelled: number;
  no_show: number;
  rate: string;
}

const statCards = [
  { key: 'total', labelKey: 'total', icon: CalendarCheck, color: 'text-accent-600', bg: 'bg-accent-50' },
  { key: 'confirmed', labelKey: 'confirmed', icon: Percent, color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'cancelled', labelKey: 'cancelled', icon: CalendarX, color: 'text-red-500', bg: 'bg-red-50' },
  { key: 'no_show', labelKey: 'noShow', icon: UserX, color: 'text-amber-600', bg: 'bg-amber-50' },
] as const;

export const StatsBar = () => {
  const { data: stats, loading } = useApi<Stats>('/stats/summary', { period: 'this_month' });
  const { t, interpolate } = useLocalization();
  const attendanceLabel = interpolate(t.stats.attendanceRate, { rate: '' });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <div className="h-16 bg-bg-secondary rounded-sm" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map(({ key, labelKey, icon: Icon, color, bg }) => (
        <Card key={key} className="hover:shadow-md transition-shadow cursor-default">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm text-text-muted mb-1">{t.stats[labelKey]}</p>
              <p className="text-xl sm:text-2xl font-bold text-text-primary">{stats[key]}</p>
            </div>
            <div className={`p-2 rounded-md sm:p-2.5 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
          </div>
        </Card>
      ))}
      <Card className="col-span-1 sm:col-span-2 lg:col-span-4 bg-accent-50 border-accent-100">
        <div className="flex items-center gap-3">
          <Percent size={20} className="text-accent-600" />
          <span className="text-xs sm:text-sm text-accent-700">
            {attendanceLabel}
            <strong>{stats.rate}</strong>
          </span>
        </div>
      </Card>
    </div>
  );
};
