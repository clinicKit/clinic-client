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
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[1.75rem] border border-white/70 bg-white/78 shadow-[0_12px_30px_-18px_rgba(17,24,39,0.28),0_0_0_1px_rgba(17,24,39,0.04)] backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-5">
          <button className="flex items-center gap-3" onClick={() => navigate('/')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#20212b] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.45)]">
              <span className="text-base font-semibold text-white">T</span>
            </div>
            <div className="text-left">
              <span className="block text-lg font-semibold tracking-[-0.03em] text-[#20212b]">TisQ</span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-text-secondary">Clinic OS</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:flex">
            <a href="#features" className="rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-[#f5f4f0] hover:text-[#20212b]">
              {t.nav.features}
            </a>
            <a href="#pricing" className="rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-[#f5f4f0] hover:text-[#20212b]">
              {t.nav.pricing}
            </a>
            <a href="#about" className="rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-[#f5f4f0] hover:text-[#20212b]">
              {t.nav.about}
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher Component */}
            <LanguageSwitcher lang={lang} setLang={setLang} />

            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" className="rounded-full px-4 text-[#20212b]" onClick={() => navigate('/login')}>
                {t.nav.login}
              </Button>
              <Button size="sm" className="rounded-full bg-[#20212b] px-4 text-white hover:bg-[#2a2c37]" onClick={() => navigate('/register')}>
                {t.nav.register}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="rounded-full p-2 text-text-secondary transition-colors hover:bg-[#f5f4f0] hover:text-[#20212b] md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[#eef1ef] px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <a href="#features" className="rounded-2xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-[#f5f4f0] hover:text-[#20212b]">
                {t.nav.features}
              </a>
              <a href="#pricing" className="rounded-2xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-[#f5f4f0] hover:text-[#20212b]">
                {t.nav.pricing}
              </a>
              <a href="#about" className="rounded-2xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-[#f5f4f0] hover:text-[#20212b]">
                {t.nav.about}
              </a>
              <div className="flex gap-2 pt-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="flex-1 rounded-full text-[#20212b]">
                  {t.nav.login}
                </Button>
                <Button size="sm" onClick={() => navigate('/register')} className="flex-1 rounded-full bg-[#20212b] text-white hover:bg-[#2a2c37]">
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
