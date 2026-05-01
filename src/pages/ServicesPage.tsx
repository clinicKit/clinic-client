import { ServicesTable } from '../components/Tables/ServicesTable';
import { useLocalization } from '../hooks/useLocalization';

export const ServicesPage = () => {
  const { t } = useLocalization();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">{t.pages.services}</h1>
      </div>
      <ServicesTable />
    </div>
  );
};
