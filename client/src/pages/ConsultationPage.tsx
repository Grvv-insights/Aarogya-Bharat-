import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchTreatments } from '../services/treatmentService';
import { fetchHospitals } from '../services/hospitalService';
import { fetchDoctors } from '../services/doctorService';
import { submitConsultation } from '../services/consultationService';
import { Treatment, Hospital, Doctor, Consultation } from '../types';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Stethoscope,
  Building2,
  UserCheck,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
  Compass,
  Lock,
  LogIn
} from 'lucide-react';

export const ConsultationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // URL Query Parameters from prior discovery steps
  const paramTreatment = searchParams.get('treatment') || searchParams.get('treatmentId') || '';
  const paramHospital = searchParams.get('hospital') || searchParams.get('hospitalId') || '';
  const paramDoctor = searchParams.get('doctor') || searchParams.get('doctorId') || '';

  // Data Collections
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Form Fields
  const [selectedTreatment, setSelectedTreatment] = useState<string>(paramTreatment);
  const [selectedHospital, setSelectedHospital] = useState<string>(paramHospital);
  const [selectedDoctor, setSelectedDoctor] = useState<string>(paramDoctor);
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [documentReference, setDocumentReference] = useState<string>('');

  // Patient Info Fields
  const [patientName, setPatientName] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientCountry, setPatientCountry] = useState<string>('');

  // Status & Validation
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedConsultation, setSubmittedConsultation] = useState<Consultation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Pre-fill user data if logged in or restore from pending form
  useEffect(() => {
    if (user) {
      setPatientName(user.name || '');
      setPatientEmail(user.email || '');
      setPatientPhone(user.phone || '');
      setPatientCountry(user.country || 'United States');
    }

    // Check if there was pending consultation data stored prior to login redirect
    const savedForm = localStorage.getItem('pending_consultation_form');
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        if (parsed.selectedTreatment) setSelectedTreatment(parsed.selectedTreatment);
        if (parsed.selectedHospital) setSelectedHospital(parsed.selectedHospital);
        if (parsed.selectedDoctor) setSelectedDoctor(parsed.selectedDoctor);
        if (parsed.preferredDate) setPreferredDate(parsed.preferredDate);
        if (parsed.message) setMessage(parsed.message);
        if (parsed.documentReference) setDocumentReference(parsed.documentReference);
        if (parsed.patientPhone) setPatientPhone(parsed.patientPhone);
        if (parsed.patientCountry) setPatientCountry(parsed.patientCountry);
        localStorage.removeItem('pending_consultation_form');
      } catch (e) {
        console.error('Error restoring pending consultation form', e);
      }
    }
  }, [user]);

  // Load database entities
  useEffect(() => {
    const loadResources = async () => {
      try {
        const [tList, hList, dList] = await Promise.all([
          fetchTreatments(),
          fetchHospitals(),
          fetchDoctors()
        ]);
        setTreatments(tList);
        setHospitals(hList);
        setDoctors(dList);

        // If no treatment was pre-selected, default to first
        if (!paramTreatment && tList.length > 0) {
          setSelectedTreatment(tList[0]._id);
        }
        // If no hospital was pre-selected, default to first
        if (!paramHospital && hList.length > 0) {
          setSelectedHospital(hList[0]._id);
        }
      } catch (err) {
        console.error('Failed to load consultation resources:', err);
      } finally {
        setLoadingData(false);
      }
    };
    loadResources();
  }, [paramTreatment, paramHospital, paramDoctor]);

  // Auto-synchronize hospital when a doctor is selected
  useEffect(() => {
    if (selectedDoctor && doctors.length > 0) {
      const doc = doctors.find((d) => d._id === selectedDoctor);
      if (doc && doc.hospital) {
        const hospId = typeof doc.hospital === 'object' ? (doc.hospital as any)._id : doc.hospital;
        if (hospId) setSelectedHospital(hospId);
      }
    }
  }, [selectedDoctor, doctors]);

  // Filtered doctors based on selected hospital
  const availableDoctors = doctors.filter((doc) => {
    if (!selectedHospital) return true;
    const hospId = typeof doc.hospital === 'object' ? (doc.hospital as any)._id : doc.hospital;
    return hospId === selectedHospital;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!message.trim()) {
      setErrorMessage('Please describe your medical symptoms, condition, or question.');
      return;
    }

    if (!selectedHospital && !selectedDoctor) {
      setErrorMessage('Please choose a preferred hospital or doctor.');
      return;
    }

    // Authentication Guard: Redirect to login if user is not authenticated
    if (!user) {
      const pendingData = {
        selectedTreatment,
        selectedHospital,
        selectedDoctor,
        preferredDate,
        message,
        documentReference,
        patientPhone,
        patientCountry
      };
      localStorage.setItem('pending_consultation_form', JSON.stringify(pendingData));
      navigate('/login?redirect=/consultation');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitConsultation({
        treatment: selectedTreatment || undefined,
        hospital: selectedHospital || undefined,
        doctor: selectedDoctor || undefined,
        preferredDate: preferredDate ? preferredDate : undefined,
        message: message.trim(),
        documentReference: documentReference.trim() || undefined
      });

      setSubmittedConsultation(res);
    } catch (err: any) {
      console.error('Failed to submit consultation:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit consultation request. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return <LoadingSpinner fullPage label="Loading consultation coordinator and doctor schedules..." />;
  }

  // Selected entities for visual journey summary
  const currentTreatmentObj = treatments.find((t) => t._id === selectedTreatment);
  const currentHospitalObj = hospitals.find((h) => h._id === selectedHospital);
  const currentDoctorObj = doctors.find((d) => d._id === selectedDoctor);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Patient Discovery Flow Banner */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2 text-primary-700">
            <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">1</span>
            <span>Treatment Discovery</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block" />

          <div className="flex items-center gap-2 text-primary-700">
            <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">2</span>
            <span>Hospital & Doctor Selection</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block" />

          <div className="flex items-center gap-2 text-navy-950 font-bold">
            <span className="w-6 h-6 rounded-full bg-saffron-500 text-white flex items-center justify-center font-bold">3</span>
            <span>Consultation Request</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" /> Comprehensive Patient Inquiry
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Request Specialist Consultation
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
          Submit your clinical inquiry to top accredited hospital departments in India. Our medical liaison team will coordinate with your chosen doctors to provide treatment options and realistic cost estimates within 24 hours.
        </p>
      </div>

      {/* Success State */}
      {submittedConsultation ? (
        <Card className="p-8 sm:p-12 border-emerald-200 bg-emerald-50/50 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            {/* Required exact prompt phrase */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Your consultation request has been submitted.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We have securely saved your request in our clinical coordination system. A senior medical officer is reviewing your medical notes and will contact you via email or phone within 24 hours.
            </p>
          </div>

          {/* Consultation Summary Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-left max-w-lg mx-auto space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Inquiry Reference ID:</span>
              <span className="font-mono font-bold text-navy-950">#{submittedConsultation._id.slice(-8).toUpperCase()}</span>
            </div>
            {currentHospitalObj && (
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Selected Hospital:</span>
                <span className="font-semibold text-navy-950">{currentHospitalObj.name} ({currentHospitalObj.city})</span>
              </div>
            )}
            {currentDoctorObj && (
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Preferred Specialist:</span>
                <span className="font-semibold text-primary-700">{currentDoctorObj.name}</span>
              </div>
            )}
            {currentTreatmentObj && (
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Treatment / Category:</span>
                <span className="font-semibold text-navy-950">{currentTreatmentObj.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Pending Review</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/dashboard">
              <Button variant="primary" size="lg" className="font-semibold shadow-xs">
                View in Patient Dashboard
              </Button>
            </Link>
            <Link to="/hospitals">
              <Button variant="outline" size="lg">
                Explore More Hospitals
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        /* The Consultation Request Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Authentication Notice if not logged in */}
            {!user && (
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <LogIn className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="font-bold block text-blue-950">Patient Account Notice:</strong>
                    <span>You can fill out the form now. You will be prompted to quickly sign in or register before final submission to attach this request to your secure dashboard.</span>
                  </div>
                </div>
                <Link to="/login?redirect=/consultation" className="whitespace-nowrap">
                  <Button variant="outline" size="sm" className="text-xs bg-white">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            {/* Step 1: Patient Information */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary-600" />
                1. Patient Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. John Miller"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Country of Residence
                  </label>
                  <input
                    type="text"
                    value={patientCountry}
                    onChange={(e) => setPatientCountry(e.target.value)}
                    placeholder="e.g. United Kingdom"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Clinical Selection (Treatment, Hospital, Doctor, Date) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary-600" />
                2. Medical Destination & Specialist
              </h3>

              <div className="space-y-4 text-xs">
                {/* Treatment Selection */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Treatment / Procedure
                  </label>
                  <select
                    value={selectedTreatment}
                    onChange={(e) => setSelectedTreatment(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-navy-950 focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select Treatment (Optional)</option>
                    {treatments.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hospital Selection */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Preferred Hospital *
                  </label>
                  <select
                    required
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-navy-950 focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select Hospital</option>
                    {hospitals.map((h) => (
                      <option key={h._id} value={h._id}>
                        {h.name} ({h.city})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor Selection */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Preferred Doctor / Surgeon (Optional)
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-navy-950 focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Any Available Chief Surgeon / Specialist</option>
                    {availableDoctors.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} — {d.specialization} ({d.experience || 15}+ Yrs)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimated Preferred Date for Travel / Consultation
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-navy-950 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Medical Notes & Optional Document Reference */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                3. Clinical Message & Scans
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Medical Message / Current Symptoms *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your current diagnosis, symptoms, duration, previous treatments tried, and any specific questions for the doctor..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-navy-950 focus:outline-none focus:border-primary-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Optional Document Reference / Lab Scan Link
                  </label>
                  <input
                    type="text"
                    value={documentReference}
                    onChange={(e) => setDocumentReference(e.target.value)}
                    placeholder="e.g. MRI-Knee-Scan-2026.pdf or Google Drive / Dropbox link..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-navy-950 focus:outline-none focus:border-primary-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    You can also securely upload raw PDF or DICOM scan files in your patient dashboard after submitting.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="saffron"
                size="lg"
                disabled={submitting}
                className="w-full font-bold shadow-lg py-3 text-base"
              >
                {submitting ? 'Submitting Consultation Request...' : 'Submit Consultation Request'}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Confidential & Secure. Saved directly to your medical journey records.</span>
              </div>
            </div>
          </form>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-slate-200 space-y-4 sticky top-24">
              <h3 className="text-base font-bold text-navy-950">
                Selected Medical Journey
              </h3>

              <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-3">
                {currentTreatmentObj && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold text-primary-700 uppercase">Selected Procedure:</span>
                    <p className="font-bold text-navy-950">{currentTreatmentObj.name}</p>
                    <p className="text-slate-500">Est. Duration: {currentTreatmentObj.estimatedDuration || '2 - 4 hours'}</p>
                  </div>
                )}

                {currentHospitalObj && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Hospital:</span>
                    <p className="font-bold text-navy-950">{currentHospitalObj.name}</p>
                    <p className="text-slate-500">{currentHospitalObj.city}, {currentHospitalObj.state}</p>
                  </div>
                )}

                {currentDoctorObj && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Specialist:</span>
                    <p className="font-bold text-navy-950">{currentDoctorObj.name}</p>
                    <p className="text-slate-500">{currentDoctorObj.specialization}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>Doctor response turnaround: <strong>24 – 48 Hours</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>NABH / JCI Accredited Hospital Review</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
