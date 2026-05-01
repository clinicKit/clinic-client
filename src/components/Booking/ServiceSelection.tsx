import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';
import type { Service } from '../../types/booking';

interface ServiceSelectionProps {
  services: Service[];
  selectedService: number | null;
  onSelect: (id: number) => void;
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  services,
  selectedService,
  onSelect,
}) => {
  const { t } = useLocalization();

  return (
    <div className="space-y-4 min-h-[300px]">
      <p className="text-lg text-text-primary mb-4">{t.booking.serviceSelection.title}</p>
      <div className="grid gap-3">
        {services.map(service => (
          <button
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={`group p-3 border-2 rounded-xl text-left transition-all transform hover:scale-[1.02] ${
              selectedService === service.id
                ? 'border-accent-600 bg-accent-50 shadow-lg'
                : 'border-gray-200 hover:border-accent-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-lg text-text-primary group-hover:text-accent-600 transition-colors">
                  {service.name}
                </div>
                <div className="flex items-center text-sm text-text-muted mt-2">
                  <Clock className="inline mr-2" size={16} />
                  <span>{service.duration_minutes} {t.booking.serviceSelection.minutes}</span>
                </div>
              </div>
              {selectedService === service.id && (
                <CheckCircle className="text-accent-600" size={28} />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
