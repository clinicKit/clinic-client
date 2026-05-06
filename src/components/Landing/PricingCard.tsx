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
      className={`relative flex h-full flex-col rounded-[2rem] p-2 transition-all duration-300 hover:-translate-y-1 ${
        plan.popular
          ? 'bg-[#20212b] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.42)] md:-translate-y-2'
          : 'bg-white shadow-[0_0_0_1px_rgba(17,24,39,0.06),0_18px_36px_-26px_rgba(17,24,39,0.28)]'
      }`}
    >
      <div
        className={`flex h-full flex-col rounded-[1.65rem] border p-8 ${
          plan.popular
            ? 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] text-white'
            : 'border-[#edf0ee] bg-[linear-gradient(180deg,#fff,#fbfaf8)] text-text-primary'
        }`}
      >
        {plan.popular && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <span className="rounded-full bg-white px-4 py-1 text-sm font-medium text-[#20212b]">
            {t.pricing.popular}
            </span>
          </div>
        )}

        <div className="mb-6 text-center">
          <h3 className={`mb-2 text-2xl font-medium tracking-[-0.03em] ${plan.popular ? 'text-white' : 'text-[#20212b]'}`}>{plan.name}</h3>
          <p className={`mb-4 text-sm ${plan.popular ? 'text-white/68' : 'text-text-secondary'}`}>{plan.description}</p>
        
          <div className="mb-2">
            {billingPeriod === 'yearly' && savings > 0 && (
              <div className="mb-2">
                <span className={`text-lg font-semibold line-through ${plan.popular ? 'text-white/45' : 'text-red-500'}`}>
                  {formatPrice(originalMonthlyPrice)}
                </span>
                <span className={`ml-1 text-xs ${plan.popular ? 'text-white/55' : 'text-text-muted'}`}>{t.common.perMonth}</span>
              </div>
            )}
            <div>
              <span className={`text-4xl font-semibold tracking-[-0.04em] ${plan.popular ? 'text-white' : 'text-[#20212b]'}`}>
                {formatPrice(billingPeriod === 'yearly' ? monthlyEquivalent : currentPrice)}
              </span>
              <span className={`ml-1 text-sm ${plan.popular ? 'text-white/55' : 'text-text-muted'}`}>{t.common.perMonth}</span>
            </div>
            {billingPeriod === 'yearly' && (
              <div className="mt-1">
                <span className={`text-sm font-medium ${plan.popular ? 'text-[#9ee3bf]' : 'text-green-600'}`}>
                  {interpolate(t.pricing.savingsPerMonth, { amount: formatPrice(savings) })}
                </span>
              </div>
            )}
          </div>
        </div>

        {billingPeriod === 'yearly' && (
          <span className={`text-center text-xs ${plan.popular ? 'text-white/52' : 'text-text-muted'}`}>
            {interpolate(t.pricing.yearlyTotal, { amount: formatPrice(currentPrice) })}
          </span>
        )}

        <ul className="mb-8 mt-8 flex-1 space-y-3">
          {plan.features.map((feature, fIndex) => (
            <li key={fIndex} className="flex items-start gap-3">
              {feature.included ? (
                <Check className={`${plan.popular ? 'text-[#9ee3bf]' : 'text-green-600'} mt-0.5 flex-shrink-0`} size={20} />
              ) : (
                <X className={`${plan.popular ? 'text-white/35' : 'text-text-muted'} mt-0.5 flex-shrink-0`} size={20} />
              )}
              <span
                className={
                  feature.included
                    ? plan.popular ? 'text-white/86' : 'text-text-primary'
                    : plan.popular ? 'text-white/40 line-through' : 'text-text-muted line-through'
                }
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <Button
          className={`mt-auto w-full rounded-full ${
            plan.popular
              ? 'text-[#20212b] hover:bg-[#f4f4f2]'
              : 'border-[#e7ebe8] bg-[#f5f4f0] text-[#20212b] hover:bg-[#ece9e1]'
          }`}
          variant={plan.popular ? 'primary' : 'secondary'}
          onClick={() => navigate('/register')}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};
