import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';
import { Button } from '../ui/Button';

interface SuccessScreenProps {
  onReset: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onReset }) => {
  const { t } = useLocalization();

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">{t.booking.success.title}</h2>
        <p className="text-text-muted mb-6">
          {t.booking.success.message}
        </p>
        <Button onClick={onReset}>{t.booking.success.createAnother}</Button>
      </div>
    </div>
  );
};
