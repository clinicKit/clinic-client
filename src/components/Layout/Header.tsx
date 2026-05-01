import { useAuth } from '../../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useUI } from '../../context/UIContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLocalization();
  const { toggleSidebar } = useUI();

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-border-light px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg hover:bg-bg-secondary text-text-secondary md:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-xs font-medium text-text-secondary">{t.layout.header.clinic}</h2>
          <p className="text-sm md:text-base font-semibold text-text-primary truncate max-w-[150px] md:max-w-none">
            {user?.clinic_name}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <LanguageSwitcher lang={lang} setLang={setLang} variant="compact" />
        <span className="text-xs md:text-sm text-text-muted hidden md:inline">{user?.email}</span>
        <Button variant="ghost" size="sm" onClick={logout} className="px-2 md:px-3">
          <LogOut size={16} className="md:mr-2" />
          <span className="hidden md:inline">{t.layout.header.logout}</span>
        </Button>
      </div>
    </header>
  );
};
