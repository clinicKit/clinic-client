import type { ReactNode } from 'react';
import { useLocalization } from './LocalizationContext';

export const BookingLocalizationProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

export const useBookingLocalization = useLocalization;
