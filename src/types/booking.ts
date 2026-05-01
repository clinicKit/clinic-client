export interface ClinicInfo {
  clinic_id: number;
  clinic_name: string;
  address: string;
  timezone: string;
}

export interface Service {
  id: number;
  name: string;
  duration_minutes: number;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string | null;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Step {
  number: number;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}