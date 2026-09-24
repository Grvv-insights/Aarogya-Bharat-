import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import {
  HeartHandshake,
  Compass,
  Building2,
  Stethoscope,
  MapPin,
  HelpCircle,
  Plane,
  LogOut,
  Menu,
  X,
  UserCheck,
  ShieldCheck,
  Calculator
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Treatments', path: '/treatments', icon: Stethoscope },
    { name: 'Hospitals', path: '/hospitals', icon: Building2 },
    { name: 'Doctors', path: '/doctors', icon: UserCheck },
    { name: 'Cost Estimator', path: '/cost-estimator', icon: Calculator },
    { name: 'Medical Cities', path: '/cities', icon: MapPin },
    { name: 'Travel Assistance', path: '/travel-assistance', icon: Plane }
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      const elementId = path.replace('/#', '');
      if (location.pathname === '/') {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(elementId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner - International Patient Assistance Bar */}
      <div className="bg-navy-900 text-slate-200 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-primary-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> India Medical Value Travel Platform
            </span>
            <span className="text-slate-500">|</span>
            <span>JCI & NABH Accredited Healthcare Network</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <span>Helpline: <strong className="text-white">+91 44 2829 0200</strong></span>
            <span className="text-slate-500">|</span>
            <span>Languages: EN / AR / RU / FR</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand: MedJourney India */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary-700 via-primary-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-navy-950 font-sans">
                  MedJourney <span className="text-primary-600">India</span>
                </span>
                <span className="bg-saffron-100 text-saffron-800 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-saffron-200">
                  Global
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 font-medium tracking-tight">
                Medical Value Travel & Healthcare Discovery
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 font-medium text-sm text-slate-700">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 text-sm ${
                    active && !link.path.startsWith('/#')
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'hover:text-primary-600 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 text-primary-600" />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Quick Demo Access for evaluation */}
            {!user && (
              <button
                onClick={() => quickDemoLogin('patient').then(() => navigate('/dashboard'))}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors"
                title="Instant Demo Login as Sarah Jenkins"
              >
                ⚡ Demo Patient
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Compass className="w-4 h-4 text-primary-600" />}
                  onClick={() => {
                    if (user.role === 'admin') navigate('/admin/dashboard');
                    else if (user.role === 'provider') navigate('/provider/dashboard');
                    else navigate('/dashboard');
                  }}
                >
                  {user.role === 'admin'
                    ? 'Admin Console'
                    : user.role === 'provider'
                    ? 'Provider Desk'
                    : `My Journey (${user.name.split(' ')[0]})`}
                </Button>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}

            <Link to="/plan-journey">
              <Button variant="saffron" size="sm" className="font-semibold shadow-xs">
                Get Medical Assistance
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className="w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-3"
              >
                <Icon className="w-5 h-5 text-primary-600" />
                <span>{link.name}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (user.role === 'admin') navigate('/admin/dashboard');
                    else if (user.role === 'provider') navigate('/provider/dashboard');
                    else navigate('/dashboard');
                  }}
                >
                  {user.role === 'admin'
                    ? 'Admin Dashboard'
                    : user.role === 'provider'
                    ? 'Provider Dashboard'
                    : `My Journey (${user.name})`}
                </Button>
                <Button variant="outline" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    quickDemoLogin('patient').then(() => {
                      setMobileMenuOpen(false);
                      navigate('/dashboard');
                    });
                  }}
                >
                  ⚡ Instant Demo Patient Login
                </Button>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
              </>
            )}
            <Link to="/plan-journey" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="saffron" className="w-full">
                Get Medical Assistance
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
