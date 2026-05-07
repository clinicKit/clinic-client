import React from 'react';
import { Phone, FileText } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';
import { Input } from '../ui/Input';
import type { Service, Doctor } from '../../types/booking';

interface PatientInfoFormProps {
  patientPhone: string;
  patientFirstName: string;
  patientLastName: string;
  notes: string;
  selectedDate: string;
  selectedTime: string;
  selectedService: Service | undefined;
  selectedDoctor: Doctor | undefined;
  onPhoneChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export const PatientInfoForm: React.FC<PatientInfoFormProps> = ({
  patientPhone,
  patientFirstName,
  patientLastName,
  notes,
  selectedDate,
  selectedTime,
  selectedService,
  selectedDoctor,
  onPhoneChange,
  onFirstNameChange,
  onLastNameChange,
  onNotesChange,
}) => {
  const { t } = useLocalization();

  // Custom date formatter using translation data
  const formatSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = t.booking.dateTimeSelection.months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month.toLowerCase()} ${year} г.`;
  };

  // Phone number formatter
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // If empty, return empty
    if (digits.length === 0) return '';
    
    let formatted = '+7';
    
    // Add first group (xxx)
    if (digits.length > 1) {
      formatted += ' (' + digits.substring(1, 4);
      
      // Close parenthesis and add second group
      if (digits.length >= 4) {
        formatted += ')-' + digits.substring(4, 7);
        
        // Add third group
        if (digits.length >= 7) {
          formatted += '-' + digits.substring(7, 9);
          
          // Add fourth group
          if (digits.length >= 9) {
            formatted += '-' + digits.substring(9, 11);
          }
        }
      }
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    
    // Allow clearing the field
    if (input === '' || input === '+' || input === '+7' || input === '+7 ') {
      onPhoneChange('');
      return;
    }
    
    // If user starts typing without +7, add it
    if (!input.startsWith('+7')) {
      input = '+7' + input;
    }
    
    // Format the phone number
    const formatted = formatPhoneNumber(input);
    onPhoneChange(formatted);
  };

  return (
    <div className="space-y-5 min-h-[300px]">
      <p className="text-lg text-text-primary mb-4">{t.booking.patientInfo.title}</p>
      
      <div>
        <label className="block text-base font-semibold text-text-primary mb-2">
          <Phone className="inline mr-2" size={18} />
          {t.booking.patientInfo.phone} {t.booking.patientInfo.required}
        </label>
        <Input
          type="tel"
          placeholder="+7 (xxx)-xxx-xx-xx"
          value={patientPhone}
          onChange={handlePhoneChange}
          className="text-lg p-3"
          maxLength={25}
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-base font-semibold text-text-primary mb-2">
            {t.booking.patientInfo.firstName} {t.booking.patientInfo.required}
          </label>
          <Input
            type="text"
            placeholder={t.booking.patientInfo.firstNamePlaceholder}
            value={patientFirstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="text-lg p-3"
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-text-primary mb-2">
            {t.booking.patientInfo.lastName}
          </label>
          <Input
            type="text"
            placeholder={t.booking.patientInfo.lastNamePlaceholder}
            value={patientLastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            className="text-lg p-3"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-base font-semibold text-text-primary mb-2">
          <FileText className="inline mr-2" size={18} />
          {t.booking.patientInfo.notes}
        </label>
        <textarea
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent text-base"
          rows={3}
          placeholder={t.booking.patientInfo.notesPlaceholder}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
      
      {/* Summary */}
      <div className="mt-6 p-5 bg-accent-50 border-2 border-accent-200 rounded-xl">
        <h3 className="font-bold text-text-primary mb-3">{t.booking.patientInfo.bookingDetails}</h3>
        <div className="space-y-2 text-sm">
          <p><strong>{t.booking.patientInfo.service}</strong> {selectedService?.name}</p>
          <p><strong>{t.booking.patientInfo.doctor}</strong> {selectedDoctor?.name}</p>
          <p><strong>{t.booking.patientInfo.date}</strong> {formatSelectedDate(selectedDate)}</p>
          <p><strong>{t.booking.patientInfo.time}</strong> {selectedTime}</p>
          <p><strong>{t.booking.patientInfo.duration}</strong> {selectedService?.duration_minutes} {t.booking.serviceSelection.minutes}</p>
        </div>
      </div>
    </div>
  );
};
