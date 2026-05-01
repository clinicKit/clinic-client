import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, clinicName, address);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || t.auth.register.errorFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-bg-card rounded-lg shadow-md border border-border-light p-8">
          <h1 className="text-2xl font-bold text-text-primary text-center mb-6">
            {t.auth.register.title}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t.auth.register.clinicName}
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder={t.auth.register.clinicPlaceholder}
              required
            />

            <Input
              label={t.auth.register.address}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t.auth.register.addressPlaceholder}
              required
            />

            <Input
              label={t.auth.register.adminEmail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@clinic.com"
              required
            />

            <div>
              <Input
                label={t.auth.register.password}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                maxLength={72}
                required
              />
              <p className="mt-1 text-xs text-text-muted">
                {t.auth.register.passwordHint}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              {t.auth.register.submit}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            {t.auth.register.hasAccount}{' '}
            <Link to="/login" className="text-accent-600 hover:text-accent-700 font-medium">
              {t.auth.register.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
