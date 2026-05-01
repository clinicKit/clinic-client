import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Bell, 
  BarChart3, 
  Shield, 
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Navigation } from '../components/Landing/Navigation';
import { Hero } from '../components/Landing/Hero';
import { Features } from '../components/Landing/Features';
import { ProsCons } from '../components/Landing/ProsCons';
import { PricingCard } from '../components/Landing/PricingCard';
import { Footer } from '../components/Landing/Footer';
import { useLocalization } from '../hooks/useLocalization';

export const LandingPage = () => {
  const { t } = useLocalization();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  const featuresList = [
    {
      icon: Calendar,
      title: t.features.items[0].title,
      description: t.features.items[0].description,
    },
    {
      icon: Users,
      title: t.features.items[1].title,
      description: t.features.items[1].description,
    },
    {
      icon: Bell,
      title: t.features.items[2].title,
      description: t.features.items[2].description,
    },
    {
      icon: BarChart3,
      title: t.features.items[3].title,
      description: t.features.items[3].description,
    },
    {
      icon: Shield,
      title: t.features.items[4].title,
      description: t.features.items[4].description,
    },
    {
      icon: Zap,
      title: t.features.items[5].title,
      description: t.features.items[5].description,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <Hero />
      
      <Features 
        title={t.features.title}
        subtitle={t.features.subtitle}
        features={featuresList}
      />
      
      <ProsCons 
        title={t.proscons.title}
        pros={t.proscons.pros}
        cons={t.proscons.cons}
      />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">{t.pricing.title}</h2>
            <p className="text-xl text-text-secondary mb-8">{t.pricing.subtitle}</p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 bg-bg-secondary rounded-lg p-1 relative">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-accent-600 shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {t.pricing.monthly}
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-accent-600 shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {t.pricing.yearly}
              </button>
              <span className="absolute -top-2 -right-16 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full">
                {t.pricing.save}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.pricing.plans.map((plan, index) => (
              <PricingCard
                key={index}
                plan={plan}
                billingPeriod={billingPeriod}
                ctaText={t.pricing.cta}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-text-secondary mb-4">
              {t.pricing.customPlan}
            </p>
            <Button variant="ghost" onClick={() => window.location.href = 'mailto:support@tisq.kz'}>
              {t.pricing.contact}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-600 to-accent-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">{t.cta.title}</h2>
          <p className="text-xl text-accent-50 mb-8">{t.cta.subtitle}</p>
          <Button size="lg" className="text-accent-600 hover:bg-accent-50" onClick={() => navigate('/register')}>
            {t.cta.button}
          </Button>
        </div>
      </section>

      <Footer translations={t} />
    </div>
  );
};
