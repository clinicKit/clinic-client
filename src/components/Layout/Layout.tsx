import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TrialBanner } from '../Banner/TrialBanner';
import { useUI } from '../../context/UIContext';

export const Layout = () => {
  const { sidebarCollapsed } = useUI();

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <div 
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          sidebarCollapsed ? 'md:ml-20 ml-0' : 'md:ml-64 ml-0'
        }`}
      >
        <Header />
        <main className="p-6">
          <TrialBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
};