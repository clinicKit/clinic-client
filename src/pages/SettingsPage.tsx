import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Copy, Check, ExternalLink } from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const [copied, setCopied] = useState(false);

  const bookingUrl = user?.booking_slug 
    ? `${window.location.origin}/book/${user.booking_slug}`
    : '';

  const copyToClipboard = () => {
    if (bookingUrl) {
      navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">{t.settings.title}</h1>

      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">{t.settings.clinicInfo}</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-text-muted">{t.settings.clinicName}</p>
            <p className="text-base text-text-primary font-medium">{user?.clinic_name}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">{t.settings.adminEmail}</p>
            <p className="text-base text-text-primary font-medium">{user?.email}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">{t.settings.bookingLink}</h2>
        <p className="text-sm text-text-muted mb-4">
          {t.settings.bookingLinkDescription}
        </p>
        
        {bookingUrl && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg border border-border-light">
              <code className="flex-1 text-sm text-accent-600 break-all">
                {bookingUrl}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyToClipboard}
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={16} className="mr-1" />
                    {t.common.copied}
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1" />
                    {t.common.copy}
                  </>
                )}
              </Button>
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(bookingUrl, '_blank')}
            >
              <ExternalLink size={16} className="mr-2" />
              {t.settings.openBookingPage}
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">{t.settings.aboutSystem}</h2>
        <p className="text-sm text-text-muted">
          {t.settings.systemDescription}
        </p>
      </Card>
    </div>
  );
};
