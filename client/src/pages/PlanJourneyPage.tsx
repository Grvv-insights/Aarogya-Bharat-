import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchTreatments } from '../services/treatmentService';
import { fetchHospitals } from '../services/hospitalService';
import { Treatment, Hospital } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardBody } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import {
  FileText,
  Plane,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Calendar,
  User,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const PlanJourneyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  // Multi-step state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Form Fields
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>(searchParams.get('treatment') || '');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(searchParams.get('hospital') || '');
  const [medicalNotes, setMedicalNotes] = useState<string>('Diagnosed with joint degeneration, looking for robotic surgery quote and timeline.');
  const [destinationCity, setDestinationCity] = useState<string>('Delhi NCR');
  const [preferredDate, setPreferredDate] = useState<string>('2026-10-15');
  const [companionCount, setCompanionCount] = useState<number>(1);
  const [accommodationType, setAccommodationType] = useState<string>('hotel_4star');
  const [visaAssistance, setVisaAssistance] = useState<boolean>(true);
  const [airportPickup, setAirportPickup] = useState<boolean>(true);

  // Patient Contact
  const [patientName, setPatientName] = useState<string>(user?.name || 'Sarah Jenkins');
  const [patientEmail, setPatientEmail] = useState<string>(user?.email || 'patient@example.com');
  const [patientPhone, setPatientPhone] = useState<string>(user?.phone || '+1 (555) 234-5678');
  const [patientCountry, setPatientCountry] = useState<string>(user?.country || 'United States');

  useEffect(() => {
    const load = async () => {
      try {
        const [tList, hList] = await Promise.all([fetchTreatments(), fetchHospitals()]);
        setTreatments(tList);
        setHospitals(hList);
        if (!selectedTreatmentId && tList.length > 0) setSelectedTreatmentId(tList[0]._id);
        if (!selectedHospitalId && hList.length > 0) setSelectedHospitalId(hList[0]._id);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      // Simulate inquiry creation & auto-linking
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 1000);
    } catch (err) {
      setSubmitting(false);
      setErrorMsg((err as Error).message);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-navy-950 mb-2">
          Medical Travel Request Received!
        </h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Thank you, <strong>{patientName}</strong>. Your medical records and travel itinerary request have been forwarded to the International Patient Desk. A dedicated case manager will contact you on <strong>{patientEmail}</strong> within 4 hours with surgeon opinions and formal cost estimates.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left text-xs text-slate-600 mb-6 space-y-2">
          <p><strong>Next Steps:</strong></p>
          <p>1. Our clinical coordinator verifies report compatibility.</p>
          <p>2. We arrange your video teleconsultation with the chief surgeon.</p>
          <p>3. Official Medical Visa (MED-1) invitation letter is issued.</p>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Go to Patient Journey Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
          Personalized Healthcare Concierge
        </span>
        <h1 className="text-3xl font-extrabold text-navy-950 mt-1">
          Plan Your Medical Journey to India
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Fill out this free 3-step inquiry. We will organize doctor evaluations, transparent pricing, hospital admission, and travel assistance.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-semibold">
        {[
          { num: 1, label: 'Treatment Details' },
          { num: 2, label: 'Travel & Lodging' },
          { num: 3, label: 'Patient Information' }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === s.num
                  ? 'bg-primary-600 text-white'
                  : currentStep > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStep > s.num ? '✓' : s.num}
            </span>
            <span className={currentStep === s.num ? 'text-navy-950 font-bold' : 'text-slate-400'}>
              {s.label}
            </span>
            {s.num < 3 && <div className="w-8 h-0.5 bg-slate-200 hidden sm:block"></div>}
          </div>
        ))}
      </div>

      {errorMsg && <Alert type="error">{errorMsg}</Alert>}

      {/* Main Multi-Step Form */}
      <Card className="border-slate-200/90 shadow-md">
        <CardBody className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: Medical Details */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-navy-950 border-b border-slate-100 pb-2">
                  Step 1: Clinical Details & Treatment Selection
                </h3>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Medical Procedure / Condition Needed
                  </label>
                  <select
                    value={selectedTreatmentId}
                    onChange={(e) => setSelectedTreatmentId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {treatments.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} (Estimated {t.savingsPercentage}% savings)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Preferred Hospital Network (Optional)
                  </label>
                  <select
                    value={selectedHospitalId}
                    onChange={(e) => setSelectedHospitalId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any Accredited Hospital (Best matched by specialty)</option>
                    {hospitals.map((h) => (
                      <option key={h._id} value={h._id}>
                        {h.name} — {h.city} ({(h.accreditation || h.accreditations || ['NABH']).join(', ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Current Diagnosis & Symptoms
                  </label>
                  <textarea
                    rows={3}
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Briefly describe your symptoms, existing doctor recommendations, or questions..."
                  />
                </div>

                {/* File Upload Mockup */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Upload Scans or Medical Reports (PDF / DICOM / JPG)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-primary-500 rounded-2xl p-6 text-center bg-slate-50 cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-navy-950">Drag & drop files or click to upload</p>
                    <p className="text-[11px] text-slate-500 mt-1">X-rays, MRI scans, lab reports, doctor prescriptions (Max 25MB)</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    variant="primary"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => setCurrentStep(2)}
                  >
                    Continue to Travel & Lodging
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Travel & Lodging */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-navy-950 border-b border-slate-100 pb-2">
                  Step 2: Travel Preferences & Medical Visa
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Destination City in India
                    </label>
                    <select
                      value={destinationCity}
                      onChange={(e) => setDestinationCity(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Delhi NCR">Delhi NCR (New Delhi & Gurugram)</option>
                      <option value="Chennai">Chennai (Tamil Nadu)</option>
                      <option value="Bengaluru">Bengaluru (Karnataka)</option>
                      <option value="Mumbai">Mumbai (Maharashtra)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Estimated Travel / Arrival Date
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Traveling Companions (Caregiver / Spouse)
                    </label>
                    <select
                      value={companionCount}
                      onChange={(e) => setCompanionCount(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={0}>0 (Solo Patient)</option>
                      <option value={1}>1 Companion</option>
                      <option value={2}>2 Companions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Accommodation Type
                    </label>
                    <select
                      value={accommodationType}
                      onChange={(e) => setAccommodationType(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="hotel_4star">4-Star Executive Hotel (Recommended)</option>
                      <option value="hotel_5star">5-Star Luxury Resort</option>
                      <option value="serviced_apartment">Serviced Apartment with Kitchen</option>
                      <option value="hotel_3star">3-Star / Hospital Guest House</option>
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visaAssistance}
                      onChange={(e) => setVisaAssistance(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-xs font-medium text-navy-950">
                      I require official Indian Medical Visa (MED-1) invitation letter assistance
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={airportPickup}
                      onChange={(e) => setAirportPickup(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-xs font-medium text-navy-950">
                      I request complimentary airport pickup and private transfer upon arrival
                    </span>
                  </label>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => setCurrentStep(3)}
                  >
                    Continue to Patient Contact
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Patient Information */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-navy-950 border-b border-slate-100 pb-2">
                  Step 3: Patient Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Patient Full Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                  <Input
                    label="Home Country / Nationality"
                    value={patientCountry}
                    onChange={(e) => setPatientCountry(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    required
                    helperText="We will send your hospital quote and doctor options here"
                  />
                  <Input
                    label="Phone or WhatsApp Number"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    required
                    helperText="For instant medical coordinator WhatsApp support"
                  />
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Zero Obligation, 100% Confidential
                  </p>
                  <p>
                    Your health information is protected under international healthcare privacy standards. No medical fees are collected until you arrive and confirm admission.
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="saffron"
                    size="lg"
                    isLoading={submitting}
                    className="font-bold shadow-md"
                  >
                    Submit Medical Inquiry
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
