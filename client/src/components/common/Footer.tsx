import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-teal-400 flex items-center justify-center text-white shadow-md">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                MedJourney <span className="text-primary-400">India</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your comprehensive platform for medical travel discovery in India. We help international patients find verified hospitals, compare specialties, request specialist consultations, and plan end-to-end medical journeys with complete clarity.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-900 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Providers
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-900 text-xs font-medium text-saffron-300 border border-saffron-400/20">
                <CheckCircle className="w-3.5 h-3.5" /> Transparent Estimates
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-900 text-xs font-medium text-blue-400 border border-blue-400/20">
                <FileText className="w-3.5 h-3.5" /> Secure Records
              </span>
            </div>
          </div>

          {/* Quick Navigation - Discover */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Healthcare
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/treatments" className="hover:text-primary-400 transition-colors">
                  Treatments & Procedures
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="hover:text-primary-400 transition-colors">
                  Accredited Hospitals
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-primary-400 transition-colors">
                  Find Specialists & Doctors
                </Link>
              </li>
              <li>
                <Link to="/cities" className="hover:text-primary-400 transition-colors">
                  Medical Destinations
                </Link>
              </li>
              <li>
                <Link to="/travel-assistance" className="hover:text-primary-400 transition-colors">
                  Travel & Visa Assistance
                </Link>
              </li>
              <li>
                <Link to="/cost-estimator" className="hover:text-primary-400 transition-colors">
                  Treatment Cost Estimator
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Stakeholders & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform & Info
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/for-patients" className="hover:text-primary-400 transition-colors">
                  For Patients
                </Link>
              </li>
              <li>
                <Link to="/for-hospitals" className="hover:text-primary-400 transition-colors">
                  For Hospitals & Providers
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/medical-disclaimer" className="hover:text-primary-400 transition-colors text-saffron-400">
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Assistance Desk */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Patient Assistance Desk
            </h4>
            <div className="space-y-3.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">+91 44 2829 0200</p>
                  <p className="text-xs text-slate-500">International Patient Support</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">support@medjourney.in</p>
                  <p className="text-xs text-slate-500">Clinical inquiries & quotes</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">New Delhi, India</p>
                  <p className="text-xs text-slate-500">Coordination desks in Delhi, Mumbai, Chennai, Bengaluru</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="my-6 p-4 rounded-xl bg-navy-900/70 border border-navy-800 text-xs text-slate-400 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-saffron-400 mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-slate-200">Medical Disclaimer:</strong> MedJourney India is a technology and medical value travel facilitation platform that assists patients with healthcare discovery, hospital comparison, consultation requests, and logistics planning. MedJourney India does not provide medical diagnoses, clinical treatment, or medical advice. All medical procedures and treatment plans are determined solely by licensed healthcare professionals and accredited hospitals. Cost figures presented on the platform are estimated demo ranges for planning purposes and vary based on individual medical evaluation.
          </p>
        </div>

        {/* Copyright & Bottom Links */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} MedJourney India. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/about" className="hover:text-slate-300">About</Link>
            <Link to="/contact" className="hover:text-slate-300">Contact</Link>
            <Link to="/privacy" className="hover:text-slate-300">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300">Terms</Link>
            <Link to="/medical-disclaimer" className="hover:text-slate-300">Medical Disclaimer</Link>
            <Link to="/for-hospitals" className="hover:text-slate-300">For Hospitals</Link>
            <Link to="/for-patients" className="hover:text-slate-300">For Patients</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
