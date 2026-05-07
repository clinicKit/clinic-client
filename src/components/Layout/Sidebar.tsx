import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Stethoscope, 
  Settings, 
  Scissors, 
  Clock, 
  ScanLine,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';
import { useUI } from '../../context/UIContext';

const linkConfig = [
  { to: '/dashboard', icon: Calendar, key: 'dashboard' },
  { to: '/patients', icon: Users, key: 'patients' },
  { to: '/doctors', icon: Stethoscope, key: 'doctors' },
  { to: '/services', icon: Scissors, key: 'services' },
  { to: '/schedules', icon: Clock, key: 'schedules' },
  { to: '/teeth', icon: ScanLine, key: 'teeth' },
  { to: '/settings', icon: Settings, key: 'settings' },
] as const;

export const Sidebar = () => {
  const { t } = useLocalization();
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUI();

  const handleLinkClick = () => {
    // On mobile, close sidebar after clicking a link
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <aside 
        className={`fixed left-0 top-0 h-full bg-white border-r border-border-light p-4 flex flex-col transition-all duration-300 z-30 
          ${sidebarCollapsed 
            ? 'w-20 -translate-x-full md:translate-x-0' 
            : 'w-64 translate-x-0'
          }`}
      >
        <div className={`mb-8 flex items-center justify-between ${sidebarCollapsed ? 'px-1' : 'px-3'} py-2`}>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-accent-600">clinicKit</h1>
              <span className="text-xs text-text-muted">{t.layout.sidebar.subtitle}</span>
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} className="hidden md:block" />}
            {!sidebarCollapsed && <X size={20} className="md:hidden" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {linkConfig.map(({ to, icon: Icon, key }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleLinkClick}
              title={sidebarCollapsed ? t.layout.sidebar.links[key] : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent-50 text-accent-700'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
              }
            >
              <Icon size={sidebarCollapsed ? 22 : 18} />
              <span className={sidebarCollapsed ? 'hidden' : 'block'}>
                {t.layout.sidebar.links[key]}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
