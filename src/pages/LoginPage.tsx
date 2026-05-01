import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || t.auth.login.errorFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-md">
        <div className="bg-bg-card rounded-lg shadow-md border border-border-light p-8">
          <h1 className="text-2xl font-bold text-text-primary text-center mb-6">
            {t.auth.login.title}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@clinic.com"
              required
            />

            <Input
              label={t.auth.login.password}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              maxLength={72}
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              {t.auth.login.submit}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            {t.auth.login.noAccount}{' '}
            <Link to="/register" className="text-accent-600 hover:text-accent-700 font-medium">
              {t.auth.login.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
