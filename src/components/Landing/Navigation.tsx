// Updated Navigation component using the hook
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useLocalization } from '../../hooks/useLocalization';

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { lang, setLang, t } = useLocalization();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-border-light z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-accent-600">TisQ</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-text-secondary hover:text-accent-600 transition-colors">
              {t.nav.features}
            </a>
            <a href="#pricing" className="text-text-secondary hover:text-accent-600 transition-colors">
              {t.nav.pricing}
            </a>
            <a href="#about" className="text-text-secondary hover:text-accent-600 transition-colors">
              {t.nav.about}
            </a>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher Component */}
            <LanguageSwitcher lang={lang} setLang={setLang} />

            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                {t.nav.login}
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                {t.nav.register}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-text-secondary hover:text-accent-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-light">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-text-secondary hover:text-accent-600">
                {t.nav.features}
              </a>
              <a href="#pricing" className="text-text-secondary hover:text-accent-600">
                {t.nav.pricing}
              </a>
              <a href="#about" className="text-text-secondary hover:text-accent-600">
                {t.nav.about}
              </a>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="flex-1">
                  {t.nav.login}
                </Button>
                <Button size="sm" onClick={() => navigate('/register')} className="flex-1">
                  {t.nav.register}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};