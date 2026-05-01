import { useLocalization } from '../../hooks/useLocalization';

type Status = 'scheduled' | 'confirmed' | 'cancelled' | 'no_show';

const statusConfig: Record<Status, { translationKey: Status; className: string }> = {
  scheduled: { translationKey: 'scheduled', className: 'bg-accent-50 text-accent-700' },
  confirmed: { translationKey: 'confirmed', className: 'bg-accent-100 text-accent-700' },
  cancelled: { translationKey: 'cancelled', className: 'bg-red-50 text-red-600' },
  no_show: { translationKey: 'no_show', className: 'bg-amber-50 text-amber-600' },
};

export const Badge = ({ status }: { status: Status }) => {
  const { t } = useLocalization();
  const config = statusConfig[status] || statusConfig.scheduled;
  return (
    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${config.className}`}>
      {t.appointmentStatuses[config.translationKey]}
    </span>
  );
};
