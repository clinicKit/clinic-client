import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  MessageSquareMore,
  Calendar,
  Users,
  Bell,
  BarChart3,
  Shield,
  Zap,
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Navigation } from '../components/Landing/Navigation';
import { Footer } from '../components/Landing/Footer';
import { useLocalization } from '../hooks/useLocalization';

export const LandingPage = () => {
  const { t } = useLocalization();
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff_0%,#fffaf7_48%,#ffffff_100%)] text-text-primary">
      <Navigation />

      <section className="relative overflow-hidden px-4 pb-12 pt-20 sm:pb-20 sm:pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(255,237,213,0.9),transparent_34%),radial-gradient(circle_at_top_right,rgba(224,231,255,0.7),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,250,247,0.75))]" />
        <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-100/50 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-8 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl mt-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm text-text-secondary shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(17,24,39,0.04)] backdrop-blur-md">
              <Sparkles size={16} className="text-accent-600" />
              <span>{t.features.subtitle}</span>
            </div>

            <h1 className="mt-4 sm:mt-6 text-[2.25rem] leading-[1.1] font-medium tracking-[-0.04em] text-[#20212b] sm:text-5xl md:text-6xl lg:text-[5.25rem]">
              {t.hero.title}
            </h1>
            <p className="mt-4 sm:mt-6 max-w-2xl text-base leading-7 text-[#5d6470] sm:text-lg sm:leading-8 md:text-xl">
              {t.hero.subtitle}
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="rounded-full bg-[#20212b] px-7 py-3.5 text-white shadow-[0_12px_24px_-8px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:bg-[#2a2c37]"
              >
                {t.hero.cta}
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/login')}
                className="rounded-full border-white/80 bg-white/80 px-7 py-3.5 text-[#20212b] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(17,24,39,0.04)] backdrop-blur-md hover:bg-white"
              >
                {t.hero.demo}
              </Button>
            </div>
          </div>
          

          <div className="relative mt-8 lg:mt-0">
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.76))] p-2 shadow-[0_0_0_1px_rgba(17,24,39,0.06),0_24px_48px_-24px_rgba(17,24,39,0.28)] backdrop-blur-md">
              <div className="overflow-hidden rounded-[1.6rem] border border-white/80 bg-[#fbfaf8]">
                <div className="grid gap-3 sm:gap-4 border-b border-[#eef1ef] bg-[radial-gradient(circle_at_top,rgba(255,237,213,0.55),transparent_40%),linear-gradient(180deg,#fff,#fbfaf8)] p-3 sm:p-5 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[1.5rem] bg-white/90 p-4 sm:p-5 shadow-[0_0_0_1px_rgba(17,24,39,0.04),0_12px_24px_-18px_rgba(17,24,39,0.2)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">clinicKit</p>
                        <h3 className="mt-2 text-lg sm:text-xl font-semibold text-[#20212b]">{t.features.items[0].title}</h3>
                      </div>
                      <div className="rounded-2xl bg-[#20212b] p-3 text-white shadow-[0_10px_20px_-8px_rgba(0,0,0,0.45)]">
                        <Calendar size={22} />
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {[
                        { time: '09:00', title: t.features.items[1].title, tone: 'bg-[#fff0e3]' },
                        { time: '11:30', title: t.features.items[2].title, tone: 'bg-[#e9f1ff]' },
                        { time: '15:00', title: t.features.items[3].title, tone: 'bg-[#ecf7f0]' },
                      ].map((slot) => (
                        <div key={slot.time} className="flex items-center gap-3 rounded-2xl border border-[#eef1ef] bg-white p-3">
                          <div className={`rounded-xl px-3 py-2 text-sm font-semibold text-[#20212b] ${slot.tone}`}>
                            {slot.time}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#20212b]">{slot.title}</p>
                            <p className="text-xs text-text-secondary">{t.features.items[5].title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="rounded-[1.5rem] bg-[#20212b] p-4 sm:p-5 text-white shadow-[0_16px_30px_-18px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-white/10 p-3">
                          <MessageSquareMore size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-white/70">{t.features.items[2].title}</p>
                          <p className="text-xl font-semibold">WhatsApp</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-white/75">{t.features.items[2].description}</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-4 sm:p-5 shadow-[0_0_0_1px_rgba(17,24,39,0.04),0_12px_24px_-18px_rgba(17,24,39,0.2)]">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-[#e9f1ff] p-3 text-[#20212b]">
                          <BarChart3 size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#20212b]">{t.features.items[3].title}</p>
                          <p className="text-xs text-text-secondary">{t.features.items[3].description}</p>
                        </div>
                      </div>
                      {/* <div className="mt-5 flex items-end gap-2">
                        <RevenueChart />
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* <div className="grid gap-3 p-5 sm:grid-cols-3">
                  {workflowSteps.map((step) => (
                    <div key={step.title} className="rounded-[1.4rem] border border-[#eef1ef] bg-white/85 p-4">
                      <div className="inline-flex rounded-2xl bg-[#f5f4f0] p-3 text-[#20212b]">
                        <step.icon size={18} />
                      </div>
                      <h4 className="mt-4 text-base font-semibold text-[#20212b]">{step.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-text-secondary">{step.description}</p>
                    </div>
                  ))}
                </div> */}
              </div>
            </div>

            <div className="hidden sm:block absolute -bottom-5 -left-4 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-sm text-text-secondary shadow-[0_8px_24px_-16px_rgba(0,0,0,0.22)] backdrop-blur-md">
              {t.proscons.pros.items[2]}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-12 sm:py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#edf0ee] bg-white px-4 py-2 text-sm text-text-secondary shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <Stethoscope size={16} className="text-accent-600" />
              {t.features.title}
            </div>
            <h2 className="mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.03em] text-[#20212b]">
              {t.proscons.title}
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-text-secondary">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-6 sm:grid-cols-2">
              {featuresList.slice(0, 4).map((feature, index) => (
                <div
                  key={feature.title}
                  className="group rounded-[2rem] bg-white p-2 shadow-[0_0_0_1px_rgba(17,24,39,0.06),0_20px_40px_-28px_rgba(17,24,39,0.28)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="h-full rounded-[1.6rem] border border-white/80 bg-[linear-gradient(180deg,#fff,#fbfaf8)] p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="rounded-[1.1rem] bg-[#20212b] p-3 text-white shadow-[0_12px_24px_-10px_rgba(0,0,0,0.4)]">
                        <feature.icon size={22} />
                      </div>
                      <span className="text-sm font-medium text-text-secondary">0{index + 1}</span>
                    </div>
                    <h3 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-medium tracking-[-0.03em] text-[#20212b]">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-text-secondary">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div id="about" className="rounded-[2rem] bg-[#20212b] p-2 shadow-[0_20px_48px_-24px_rgba(0,0,0,0.38)]">
              <div className="flex h-full flex-col rounded-[1.65rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 sm:p-7 text-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <Shield size={22} />
                  </div>
                  <p className="text-sm uppercase tracking-[0.18em] text-white/60">{t.nav.about}</p>
                </div>

                <h3 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-medium tracking-[-0.03em]">
                  {t.proscons.pros.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-white/72">
                  {t.proscons.pros.items[0]}
                </p>

                <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                  {t.proscons.pros.items.slice(1, 6).map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-[#9ee3bf]" />
                      <span className="text-sm leading-6 text-white/82">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {featuresList.slice(4).map((feature) => (
              <div
                key={feature.title}
                className="rounded-[2rem] border border-[#edf0ee] bg-white/90 p-5 sm:p-7 shadow-[0_12px_24px_-20px_rgba(17,24,39,0.25)]"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-[1.1rem] bg-[#f5f4f0] p-3 text-[#20212b]">
                    <feature.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-medium tracking-[-0.03em] text-[#20212b]">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-text-secondary">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="px-4 py-12 sm:py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-[linear-gradient(135deg,#20212b_0%,#2f3140_100%)] p-2 shadow-[0_28px_56px_-28px_rgba(0,0,0,0.45)]">
          <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-5 py-10 sm:px-6 sm:py-14 md:px-10 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75">
              <Zap size={16} className="text-[#9ee3bf]" />
              {t.cta.subtitle}
            </div>
            <h2 className="mx-auto mt-4 sm:mt-6 max-w-3xl text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.03em] text-white">{t.cta.title}</h2>
            <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-white/72">{t.hero.subtitle}</p>
            <div className="mt-6 sm:mt-8 flex flex-col justify-center gap-3 sm:gap-4 sm:flex-row">
              <Button
                size="lg"
                className="rounded-full px-7 py-3.5 text-[#20212b] hover:bg-[#f4f4f2]"
                onClick={() => navigate('/register')}
              >
                {t.cta.button}
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full border-white/15 bg-white/5 px-7 py-3.5 text-white hover:bg-white/10"
                onClick={() => navigate('/login')}
              >
                {t.hero.demo}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer translations={t} />
    </div>
  );
};
