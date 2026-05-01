// components/LanguageSwitcher.tsx
import { useLocalization } from '../../hooks/useLocalization';

type Language = 'ru' | 'kk';

interface LanguageSwitcherProps {
  lang: Language;
  setLang: (lang: Language) => void;
  variant?: 'default' | 'compact' | 'full';
  className?: string;
}

export const LanguageSwitcher = ({ 
  lang, 
  setLang, 
  variant = 'default',
  className = ''
}: LanguageSwitcherProps) => {
  const { t } = useLocalization();
  const variants = {
    default: 'bg-bg-secondary rounded-lg p-1 gap-2',
    compact: 'bg-transparent gap-1',
    full: 'bg-bg-secondary rounded-lg p-1.5 gap-3 w-full'
  };

  const buttonStyles = {
    default: 'px-3 py-1 rounded text-sm font-medium',
    compact: 'px-2 py-0.5 rounded text-xs font-medium',
    full: 'px-4 py-2 rounded-md text-sm font-medium flex-1'
  };

  return (
    <div className={`flex items-center ${variants[variant]} ${className}`}>
      <button
        onClick={() => setLang('ru')}
        className={`${buttonStyles[variant]} transition-colors ${
          lang === 'ru' 
            ? 'bg-white text-accent-600 shadow-sm' 
            : 'text-text-muted hover:text-text-primary'
        }`}
      >
        {variant === 'full' ? t.common.languageNames.ru : 'RU'}
      </button>
      <button
        onClick={() => setLang('kk')}
        className={`${buttonStyles[variant]} transition-colors ${
          lang === 'kk' 
            ? 'bg-white text-accent-600 shadow-sm' 
            : 'text-text-muted hover:text-text-primary'
        }`}
      >
        {variant === 'full' ? t.common.languageNames.kk : 'KK'}
      </button>
    </div>
  );
};
