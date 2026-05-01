import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';
import { Button } from '../ui/Button';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  canProceed,
  isSubmitting,
  onNext,
  onBack,
  onSubmit,
}) => {
  const { t } = useLocalization();

  return (
    <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
      {currentStep > 1 && (
        <Button
          variant="secondary"
          onClick={onBack}
          className="flex-1"
          size="lg"
        >
          <ChevronLeft className="mr-2" size={20} />
          {t.booking.navigation.back}
        </Button>
      )}
      
      {currentStep < totalSteps ? (
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1"
          size="lg"
        >
          {t.booking.navigation.next}
          <ChevronRight className="ml-2" size={20} />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !canProceed}
          className="flex-1 bg-green-600 hover:bg-green-700"
        //   size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {t.booking.navigation.submitting}
            </>
          ) : (
            <>
              <CheckCircle className="mr-2" size={24} />
              {t.booking.navigation.confirm}
            </>
          )}
        </Button>
      )}
    </div>
  );
};
