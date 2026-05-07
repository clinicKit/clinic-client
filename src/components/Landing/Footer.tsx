import type { TranslationTree } from '../../translations';

interface FooterProps {
  translations: TranslationTree;
}

export const Footer = ({ translations }: FooterProps) => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-white">{translations.footer.company}</span>
            </div>
            <p className="text-gray-400">{translations.footer.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">{translations.footer.linksTitle}</h4>
            <ul className="space-y-2 text-gray-400">
              {translations.footer.links.map((link) => (
                <li key={link}>
                  <a href="#features" className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">{translations.footer.contactsTitle}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: algalyq@gmail.com</li>
              <li>Tel: +7 (777) 390-39-07</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>{translations.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};
