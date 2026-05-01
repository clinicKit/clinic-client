import { StatsBar } from '../components/Stats/StatsBar';
import { AppointmentCalendar } from '../components/Calendar/AppointmentCalendar';

export const DashboardPage = () => (
  <div className="space-y-6">
    <StatsBar />
    <AppointmentCalendar />
  </div>
);