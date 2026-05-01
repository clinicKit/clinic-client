import { PatientsTable } from '../components/Tables/PatientsTable';
import { useLocalization } from '../hooks/useLocalization';

export const PatientsPage = () => {
  const { t } = useLocalization();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">{t.pages.patients}</h1>
      </div>
      <PatientsTable />
    </div>
  );
};
