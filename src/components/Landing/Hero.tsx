import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLocalization } from '../../hooks/useLocalization';

export const Hero = () => {
  const { t } = useLocalization();
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
            {t.hero.title}
          </h1>
          <p className="text-xl text-text-secondary mb-8">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')}>
              {t.hero.cta}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
              {t.hero.demo}
            </Button>
          </div>
        </div>

        {/* Hero Image/Animation */}
        <div className="mt-16 relative">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-border-light">
            <div className="aspect-video bg-gradient-to-br from-accent-100 to-accent-50 rounded-lg flex items-center justify-center">
              <Calendar size={120} className="text-accent-600 opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
