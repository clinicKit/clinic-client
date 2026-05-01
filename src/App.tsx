import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocalizationProvider } from './context/LocalizationContext';
import { UIProvider } from './context/UIContext';
import { Layout } from './components/Layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { ServicesPage } from './pages/ServicesPage';
import { SettingsPage } from './pages/SettingsPage';
import { SchedulesPage } from './pages/SchedulesPage';
import { ToothChartPage } from './pages/ToothChartPage';
import { PublicBookingPage } from './pages/PublicBookingPage';
import { PrivateRoute } from './components/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <LocalizationProvider>
        <AuthProvider>
          <UIProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/book/:slug" element={<PublicBookingPage />} />
              <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/patients" element={<PatientsPage />} />
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/schedules" element={<SchedulesPage />} />
                <Route path="/teeth" element={<ToothChartPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </UIProvider>
        </AuthProvider>
      </LocalizationProvider>
    </BrowserRouter>
  );
}
