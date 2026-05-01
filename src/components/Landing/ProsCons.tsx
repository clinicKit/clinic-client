import { Check, X } from 'lucide-react';

interface ProsConsProps {
  title: string;
  pros: {
    title: string;
    items: string[];
  };
  cons: {
    title: string;
    items: string[];
  };
}

export const ProsCons = ({ title, pros, cons }: ProsConsProps) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary mb-4">{title}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pros */}
          <div className="bg-white rounded-xl p-8 border border-border-light">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Check className="text-green-600" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">{pros.title}</h3>
            </div>
            <ul className="space-y-3">
              {pros.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="bg-white rounded-xl p-8 border border-border-light">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <X className="text-amber-600" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">{cons.title}</h3>
            </div>
            <ul className="space-y-3">
              {cons.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
