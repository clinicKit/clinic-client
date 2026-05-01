import { DoctorsTable } from '../components/Tables/DoctorsTable';
import { useLocalization } from '../hooks/useLocalization';

export const DoctorsPage = () => {
  const { t } = useLocalization();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">{t.pages.doctors}</h1>
      </div>
      <DoctorsTable />
    </div>
  );
};
