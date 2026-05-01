import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { t } = useLocalization();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-2 border-accent-500 border-t-transparent rounded-full" />
          <p className="text-sm text-text-muted">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" />;
  return <>{children}</>;
};
