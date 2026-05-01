import { useAuth } from '../../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';
import { AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export const TrialBanner = () => {
  const { user } = useAuth();
  const { t, interpolate } = useLocalization();
  const navigate = useNavigate();

  if (!user || !user.trial_end_date) return null;

  const trialEnd = new Date(user.trial_end_date);
  const now = new Date();
  const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Don't show if trial hasn't started or is expired
  if (daysLeft < 0 || user.is_trial_expired) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600 shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-red-900 text-sm sm:text-base">{t.trial.expiredTitle}</h3>
              <p className="text-xs sm:text-sm text-red-700">
                {t.trial.expiredMessage}
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/')} className="w-full sm:w-auto text-sm">
            {t.trial.choosePlan}
          </Button>
        </div>
      </div>
    );
  }

  // Show warning if less than 3 days left
  if (daysLeft <= 3) {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 sm:p-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="text-amber-600 shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-amber-900 text-sm sm:text-base">
                {interpolate(t.trial.warningTitle, { days: daysLeft })}
              </h3>
              <p className="text-xs sm:text-sm text-amber-700">
                {t.trial.warningMessage}
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate('/')} className="w-full sm:w-auto text-sm">
            {t.trial.choosePlan}
          </Button>
        </div>
      </div>
    );
  }

  // Show info banner for first few days
  if (daysLeft >= 4) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4">
        <div className="flex items-start sm:items-center gap-3">
          <Clock className="text-blue-600 shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-blue-900 text-sm sm:text-base">
              {interpolate(t.trial.infoTitle, { days: daysLeft })}
            </h3>
            <p className="text-xs sm:text-sm text-blue-700">
              {t.trial.infoMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
