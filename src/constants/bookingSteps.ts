import { Stethoscope, User, Calendar, Phone } from 'lucide-react';

export const BOOKING_STEP_ICONS = [
  { number: 1, key: 'service', icon: Stethoscope },
  { number: 2, key: 'doctor', icon: User },
  { number: 3, key: 'date', icon: Calendar },
  { number: 4, key: 'contacts', icon: Phone },
] as const;
