import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BOOKING_STEP_ICONS } from '../constants/bookingSteps';
import type { ClinicInfo, Service, Doctor, TimeSlot, Step } from '../types/booking';
import { LoadingSpinner } from '../components/Booking/LoadingSpinner';
import { SuccessScreen } from '../components/Booking/SuccessScreen';
import { ProgressSteps } from '../components/Booking/ProgressSteps';
import { ServiceSelection } from '../components/Booking/ServiceSelection';
import { DoctorSelection } from '../components/Booking/DoctorSelection';
import { DateTimeSelection } from '../components/Booking/DateTimeSelection';
import { PatientInfoForm } from '../components/Booking/PatientInfoForm';
import { NavigationButtons } from '../components/Booking/NavigationButtons';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { useLocalization } from '../hooks/useLocalization';

export const PublicBookingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, setLang, t, interpolate } = useLocalization();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const [patientPhone, setPatientPhone] = useState('');
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [notes, setNotes] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const steps: Step[] = BOOKING_STEP_ICONS.map(({ number, key, icon }) => ({
    number,
    icon,
    title: t.booking.steps[key],
  }));

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const [clinicRes, servicesRes, doctorsRes] = await Promise.all([
          axios.get(`${apiUrl}/booking/${slug}/info`),
          axios.get(`${apiUrl}/booking/${slug}/services`),
          axios.get(`${apiUrl}/booking/${slug}/doctors`),
        ]);

        setClinicInfo(clinicRes.data);
        setServices(servicesRes.data);
        setDoctors(doctorsRes.data);
      } catch (error) {
        console.error('Error loading booking data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, apiUrl]);

  useEffect(() => {
    if (!slug || !selectedDate || !selectedDoctor || !selectedService) {
      setAvailableSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const response = await axios.get(
          `${apiUrl}/booking/${slug}/available-slots`,
          {
            params: {
              doctor_id: selectedDoctor,
              service_id: selectedService,
              date: selectedDate
            }
          }
        );
        setAvailableSlots(response.data);
      } catch (error) {
        console.error('Error loading slots:', error);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [slug, selectedDate, selectedDoctor, selectedService, apiUrl]);

  const handleSubmit = async () => {
    if (!selectedService || !selectedDoctor || !selectedDate || !selectedTime) {
      alert(t.booking.errors.fillAllFields);
      return;
    }

    const service = services.find(s => s.id === selectedService);
    if (!service) return;

    const startTime = new Date(`${selectedDate}T${selectedTime}`).toISOString();
    const endTime = new Date(new Date(startTime).getTime() + service.duration_minutes * 60000).toISOString();

    setSubmitting(true);
    try {
      await axios.post(`${apiUrl}/booking/${slug}/book`, {
        patient_phone: patientPhone,
        patient_first_name: patientFirstName,
        patient_last_name: patientLastName,
        service_id: selectedService,
        doctor_id: selectedDoctor,
        start_time: startTime,
        end_time: endTime,
        notes,
      });

      setSuccess(true);
    } catch (error) {
      console.error('Booking error:', error);
      alert(t.booking.errors.bookingFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  const canProceed = (): boolean => {
    if (step === 1) return selectedService !== null;
    if (step === 2) return selectedDoctor !== null;
    if (step === 3) return !!(selectedDate && selectedTime);
    if (step === 4) return !!(patientPhone && patientFirstName);
    return false;
  };

  const getSelectedService = () => services.find(s => s.id === selectedService);
  const getSelectedDoctor = () => doctors.find(d => d.id === selectedDoctor);

  if (loading) return <LoadingSpinner message={t.booking.loading} />;
  if (!clinicInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">{t.booking.clinicNotFound}</h1>
          <p className="text-text-muted">{t.booking.checkLink}</p>
        </div>
      </div>
    );
  }
  if (success) return <SuccessScreen onReset={handleReset} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-accent-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-3">{clinicInfo.clinic_name}</h1>
          <p className="text-text-muted text-lg">{clinicInfo.address}</p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps steps={steps} currentStep={step} />

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-primary">
              {interpolate(t.booking.stepTitle, { current: step, total: 4 })}
            </h2>
            <p className="text-text-muted mt-1">{steps[step - 1].title}</p>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <ServiceSelection
              services={services}
              selectedService={selectedService}
              onSelect={setSelectedService}
            />
          )}

          {step === 2 && (
            <DoctorSelection
              doctors={doctors}
              selectedDoctor={selectedDoctor}
              onSelect={setSelectedDoctor}
            />
          )}

          {step === 3 && (
            <DateTimeSelection
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              availableSlots={availableSlots}
              loadingSlots={loadingSlots}
              onDateChange={(date) => {
                setSelectedDate(date);
                setSelectedTime('');
              }}
              onTimeChange={setSelectedTime}
            />
          )}

          {step === 4 && (
            <PatientInfoForm
              patientPhone={patientPhone}
              patientFirstName={patientFirstName}
              patientLastName={patientLastName}
              notes={notes}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedService={getSelectedService()}
              selectedDoctor={getSelectedDoctor()}
              onPhoneChange={setPatientPhone}
              onFirstNameChange={setPatientFirstName}
              onLastNameChange={setPatientLastName}
              onNotesChange={setNotes}
            />
          )}

          {/* Navigation */}
          <NavigationButtons
            currentStep={step}
            totalSteps={4}
            canProceed={canProceed()}
            isSubmitting={submitting}
            onNext={() => setStep(step + 1)}
            onBack={() => setStep(step - 1)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};
