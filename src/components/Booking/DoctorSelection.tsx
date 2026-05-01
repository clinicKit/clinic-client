import React from 'react';
import { User, CheckCircle } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';
import type { Doctor } from '../../types/booking';

interface DoctorSelectionProps {
  doctors: Doctor[];
  selectedDoctor: number | null;
  onSelect: (id: number) => void;
}

export const DoctorSelection: React.FC<DoctorSelectionProps> = ({
  doctors,
  selectedDoctor,
  onSelect,
}) => {
  const { t } = useLocalization();

  return (
    <div className="space-y-4 min-h-[300px]">
      <p className="text-lg text-text-primary mb-4">{t.booking.doctorSelection.title}</p>
      <div className="grid gap-3">
        {doctors.map(doctor => (
          <button
            key={doctor.id}
            onClick={() => onSelect(doctor.id)}
            className={`group p-3 border-2 rounded-xl text-left transition-all transform hover:scale-[1.02] ${
              selectedDoctor === doctor.id
                ? 'border-accent-600 bg-accent-50 shadow-lg'
                : 'border-gray-200 hover:border-accent-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center">
                  <User className="text-accent-600" size={24} />
                </div>
                <div>
                  <div className="font-semibold text-lg text-text-primary group-hover:text-accent-600 transition-colors">
                    {doctor.name}
                  </div>
                  {doctor.specialty && (
                    <div className="text-sm text-text-muted mt-1">{doctor.specialty}</div>
                  )}
                </div>
              </div>
              {selectedDoctor === doctor.id && (
                <CheckCircle className="text-accent-600" size={28} />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
