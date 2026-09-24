import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  ShieldCheck,
  FileText,
  AlertCircle,
  Building2,
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const InfoPages: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.replace('/', '') || 'about';

  const [activeTab, setActiveTab] = useState<string>(currentPath);

  useEffect(() => {
    const path = location.pathname.replace('/', '');
    if (['about', 'contact', 'privacy', 'terms', 'medical-disclaimer', 'for-hospitals', 'for-patients'].includes(path)) {
      setActiveTab(path);
    }
  }, [location.pathname]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        {[
          { id: 'about', label: 'About Us' },
          { id: 'for-patients', label: 'For Patients' },
          { id: 'for-hospitals', label: 'For Hospitals' },
          { id: 'medical-disclaimer', label: 'Medical Disclaimer' },
          { id: 'privacy', label: 'Privacy Policy' },
          { id: 'terms', label: 'Terms of Service' },
          { id: 'contact', label: 'Contact Us' }
        ].map((tab) => (
          <Link
            key={tab.id}
            to={`/${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="max-w-4xl mx-auto">
        {/* ABOUT US */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-navy-950">About MedJourney India</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              MedJourney India is a dedicated medical value travel facilitation platform established to make premier Indian healthcare accessible to international patients worldwide. We bridge the distance between prospective patients and India's finest accredited healthcare institutions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <ShieldCheck className="w-6 h-6 text-primary-600" />
                <h3 className="font-bold text-navy-950 text-base">Accreditation Focus</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We feature healthcare facilities with proven quality standards, primarily those holding JCI (Joint Commission International) and NABH (National Accreditation Board for Hospitals) accreditations.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <Users className="w-6 h-6 text-teal-600" />
                <h3 className="font-bold text-navy-950 text-base">Patient-First Coordination</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every step of our process—from preliminary doctor evaluations to medical visa invitation letters and post-operative follow-ups—is crafted to reduce anxiety and uncertainty for international families.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FOR PATIENTS */}
        {activeTab === 'for-patients' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-navy-950">Patient Guide & Services</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Traveling to a foreign country for medical surgery requires careful planning. Here is what you can expect as an international patient planning your journey with MedJourney India:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                <h4 className="font-bold text-navy-950 text-sm">1. Free Medical Evaluation</h4>
                <p className="text-xs text-slate-600">
                  Upload your existing diagnostic tests and medical summaries. Senior consultants review your file and advise on suitability for travel and surgery in India.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                <h4 className="font-bold text-navy-950 text-sm">2. Transparent Cost Estimates</h4>
                <p className="text-xs text-slate-600">
                  You receive estimated package prices encompassing surgery, expected hospital days, and surgeon fees before you book any travel.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                <h4 className="font-bold text-navy-950 text-sm">3. End-to-End Travel Concierge</h4>
                <p className="text-xs text-slate-600">
                  We assist with official hospital visa invitation letters, arrange sanitized airport chauffeur transfers, and coordinate hotel or serviced apartment reservations.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                <h4 className="font-bold text-navy-950 text-sm">4. Dedicated Bedside Interpreter</h4>
                <p className="text-xs text-slate-600">
                  Language should never be a barrier to healing. We coordinate interpreters fluent in Arabic, Russian, French, and other regional languages.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FOR HOSPITALS */}
        {activeTab === 'for-hospitals' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-navy-950">For Hospitals & Healthcare Providers</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              MedJourney India connects NABH and JCI accredited healthcare centers with global patients seeking specialized surgical and tertiary care in India.
            </p>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-navy-950 text-base">Listing Standards & Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To maintain patient safety and transparent expectations, our platform verifies provider accreditation credentials, super-specialty surgical clinical outcomes, international patient wing capabilities, and multi-language support before publishing hospital profiles.
              </p>
              <div className="pt-2">
                <Link to="/contact">
                  <Button variant="primary" size="sm">
                    Inquire About Hospital Listing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* MEDICAL DISCLAIMER */}
        {activeTab === 'medical-disclaimer' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-saffron-500 flex-shrink-0" />
              <h1 className="text-3xl font-extrabold text-navy-950">Medical Disclaimer</h1>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 text-xs text-amber-950 space-y-3 leading-relaxed">
              <p className="font-bold text-sm text-amber-900">
                Important Notice Regarding Medical Information & Cost Estimates
              </p>
              <p>
                MedJourney India is a technology and facilitation platform designed to help patients discover healthcare providers, compare facilities, and coordinate travel logistics. MedJourney India is not a hospital, medical clinic, or healthcare provider and does not practice medicine.
              </p>
              <p>
                None of the information, content, or materials available through this website should be construed as medical diagnosis, prescription, or clinical advice. All medical evaluations, decisions, and treatment regimens must be made in consultation with licensed medical doctors and accredited healthcare institutions.
              </p>
              <p>
                <strong>Estimated Costs:</strong> All cost figures, savings comparisons, and recovery timelines presented across MedJourney India are realistic demo estimates intended strictly for journey planning. Actual hospital fees and overall expenses depend on the treating physician’s in-person clinical assessment, patient comorbidities, implant choices, and hospital stay duration.
              </p>
            </div>
          </div>
        )}

        {/* PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Lock className="w-8 h-8 text-primary-600 flex-shrink-0" />
              <h1 className="text-3xl font-extrabold text-navy-950">Privacy Policy</h1>
            </div>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                MedJourney India is committed to safeguarding the privacy and confidentiality of our users and patients. We recognize that medical information is deeply sensitive.
              </p>
              <h3 className="font-bold text-navy-950 text-sm pt-2">Data We Collect</h3>
              <p>
                We collect personal identifiers (name, email, phone number, country of residence) and user-uploaded medical documentation solely for the purpose of matching your case with qualified doctors and coordinating requested hospital consultations.
              </p>
              <h3 className="font-bold text-navy-950 text-sm pt-2">Document Security</h3>
              <p>
                All medical reports, lab records, and imaging scans are transmitted via encrypted connections and stored securely with strict access control limited only to authorized clinical coordinators and participating hospitals.
              </p>
              <h3 className="font-bold text-navy-950 text-sm pt-2">Third-Party Sharing</h3>
              <p>
                We do not sell, rent, or trade your personal or health data to third-party advertisers or unverified entities. Data is only shared with accredited medical institutions you explicitly select for consultation.
              </p>
            </div>
          </div>
        )}

        {/* TERMS OF SERVICE */}
        {activeTab === 'terms' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-navy-950">Terms of Service</h1>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                By using MedJourney India, you agree to these Terms of Service. Please read them thoroughly prior to submitting consultation requests or planning medical travel.
              </p>
              <h3 className="font-bold text-navy-950 text-sm pt-2">Platform Scope</h3>
              <p>
                MedJourney India acts as an independent intermediary facilitating information discovery, preliminary hospital consultations, and travel coordination. We do not provide clinical healthcare services.
              </p>
              <h3 className="font-bold text-navy-950 text-sm pt-2">User Responsibilities</h3>
              <p>
                Users agree to provide truthful and complete information regarding their medical history, diagnostic reports, and identity. Users are responsible for evaluating the qualifications of treating physicians and consulting independent doctors before making clinical decisions.
              </p>
            </div>
          </div>
        )}

        {/* CONTACT US */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-navy-950">Contact Support Desk</h1>
            <p className="text-sm text-slate-600">
              Have questions regarding treatment options, hospital accreditations, or travel arrangements? Our team is available to assist you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <Card className="p-6 text-center space-y-2 border-slate-200">
                <Phone className="w-6 h-6 text-primary-600 mx-auto" />
                <h4 className="font-bold text-navy-950 text-sm">International Helpline</h4>
                <p className="text-xs text-slate-600">+91 44 2829 0200</p>
                <p className="text-[11px] text-slate-400">Available Mon-Sat 24/7</p>
              </Card>

              <Card className="p-6 text-center space-y-2 border-slate-200">
                <Mail className="w-6 h-6 text-teal-600 mx-auto" />
                <h4 className="font-bold text-navy-950 text-sm">Email Inquiries</h4>
                <p className="text-xs text-slate-600">support@medjourney.in</p>
                <p className="text-[11px] text-slate-400">Response within 4-12 hours</p>
              </Card>

              <Card className="p-6 text-center space-y-2 border-slate-200">
                <MapPin className="w-6 h-6 text-indigo-600 mx-auto" />
                <h4 className="font-bold text-navy-950 text-sm">Headquarters</h4>
                <p className="text-xs text-slate-600">New Delhi, India</p>
                <p className="text-[11px] text-slate-400">Desks in DEL, BOM, MAA, BLR</p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
