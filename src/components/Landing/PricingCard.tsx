import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';
import { Button } from '../ui/Button';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  features: PricingFeature[];
  popular: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  billingPeriod: 'monthly' | 'yearly';
  ctaText: string;
}

export const PricingCard = ({ plan, billingPeriod, ctaText }: PricingCardProps) => {
  const navigate = useNavigate();
  const { t, interpolate, localeCode } = useLocalization();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const currentPrice = plan.price[billingPeriod];
  const monthlyEquivalent = billingPeriod === 'yearly' ? plan.price.yearly / 12 : plan.price.monthly;
  const originalMonthlyPrice = plan.price.monthly;
  const savings = billingPeriod === 'yearly' ? originalMonthlyPrice - monthlyEquivalent : 0;

  return (
    <div
      className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl flex flex-col ${
        plan.popular
          ? 'border-accent-600 shadow-lg scale-105'
          : 'border-border-light hover:border-accent-200'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-accent-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            {t.pricing.popular}
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
        <p className="text-text-secondary text-sm mb-4">{plan.description}</p>
        
        <div className="mb-2">
          {billingPeriod === 'yearly' && savings > 0 && (
            <div className="mb-2">
              <span className="text-lg line-through text-red-500 font-semibold">
                {formatPrice(originalMonthlyPrice)}
              </span>
              <span className="text-xs text-text-muted ml-1">{t.common.perMonth}</span>
            </div>
          )}
          <div>
            <span className="text-4xl font-bold text-text-primary">
              {formatPrice(billingPeriod === 'yearly' ? monthlyEquivalent : currentPrice)}
            </span>
            <span className="text-text-muted text-sm ml-1">{t.common.perMonth}</span>
          </div>
          {billingPeriod === 'yearly' && (
            <div className="mt-1">
              <span className="text-sm text-green-600 font-medium">
                {interpolate(t.pricing.savingsPerMonth, { amount: formatPrice(savings) })}
              </span>
            </div>
          )}
        </div>
        
        {billingPeriod === 'yearly' && (
          <span className="text-text-muted text-xs">
            {interpolate(t.pricing.yearlyTotal, { amount: formatPrice(currentPrice) })}
          </span>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, fIndex) => (
          <li key={fIndex} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            ) : (
              <X className="text-text-muted flex-shrink-0 mt-0.5" size={20} />
            )}
            <span className={feature.included ? 'text-text-primary' : 'text-text-muted line-through'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <Button
        className="w-full mt-auto"
        variant={plan.popular ? 'primary' : 'secondary'}
        onClick={() => navigate('/register')}
      >
        {ctaText}
      </Button>
    </div>
  );
};
