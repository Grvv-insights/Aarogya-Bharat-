import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardBody } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { HeartHandshake, ShieldCheck, Sparkles, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const { login, quickDemoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getDestinationForRole = (userRole?: string) => {
    const rawRedirect = searchParams.get('redirect');
    if (rawRedirect) {
      return decodeURIComponent(rawRedirect);
    }
    if (userRole === 'provider') return '/provider/dashboard';
    if (userRole === 'admin') return '/admin/dashboard';
    return '/dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loggedUser = await login(email, password);
      navigate(getDestinationForRole(loggedUser.role));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'patient' | 'provider' | 'admin') => {
    setLoading(true);
    setError('');
    try {
      const loggedUser = await quickDemoLogin(role);
      navigate(getDestinationForRole(loggedUser.role));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-700 to-primary-500 flex items-center justify-center text-white mx-auto shadow-md">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-950">
            Sign in to MedJourney India
          </h2>
          <p className="text-xs text-slate-500">
            Access your medical journey, doctor consultations, and visa records.
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="bg-primary-50/70 p-4 rounded-2xl border border-primary-200/80 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary-900">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>Instant Demo Accounts (One-Click)</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Click any button below to instantly populate credentials and log in:
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('patient')}
              className="py-1.5 px-2 bg-white hover:bg-slate-50 text-navy-950 font-semibold rounded-lg border border-slate-200 shadow-xs transition-colors"
            >
              👤 Patient
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('provider')}
              className="py-1.5 px-2 bg-white hover:bg-slate-50 text-navy-950 font-semibold rounded-lg border border-slate-200 shadow-xs transition-colors"
            >
              🏥 Provider
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-1.5 px-2 bg-white hover:bg-slate-50 text-navy-950 font-semibold rounded-lg border border-slate-200 shadow-xs transition-colors"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {/* Form */}
        <Card className="border-slate-200/90 shadow-md">
          <CardBody className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                className="w-full font-semibold mt-2"
              >
                Sign In to Portal
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:underline">
                Create free patient account
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
