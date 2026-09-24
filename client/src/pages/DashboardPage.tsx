import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyAppointments } from '../services/appointmentService';
import { fetchMyTravelPlan } from '../services/travelPlanService';
import { fetchMyConsultations } from '../services/consultationService';
import { fetchHospitals } from '../services/hospitalService';
import { fetchMyCostEstimates, deleteCostEstimate } from '../services/costEstimatorService';
import { Appointment, TravelPlan, Consultation, Hospital, CostEstimate } from '../types';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Calendar,
  Video,
  Plane,
  Building2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  MapPin,
  Sparkles,
  PhoneCall,
  MessageSquare,
  BookmarkCheck,
  Star,
  ChevronRight,
  ArrowRight,
  Calculator,
  Trash2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [savedHospitals, setSavedHospitals] = useState<Hospital[]>([]);
  const [costEstimates, setCostEstimates] = useState<CostEstimate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [appts, travel, consults, hospitals, estimates] = await Promise.all([
          fetchMyAppointments(),
          fetchMyTravelPlan(),
          fetchMyConsultations(),
          fetchHospitals({ sortBy: 'rating', sortOrder: 'desc' }),
          fetchMyCostEstimates().catch(() => [])
        ]);
        setAppointments(appts);
        setTravelPlan(travel);
        setConsultations(consults);
        // Show top saved/preferred hospitals for the patient
        setSavedHospitals(hospitals.slice(0, 3));
        setCostEstimates(estimates);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleDeleteEstimate = async (id: string) => {
    if (!window.confirm('Remove this saved cost estimate from your dashboard?')) return;
    try {
      await deleteCostEstimate(id);
      setCostEstimates((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Failed to delete estimate:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage label="Loading your personalized medical journey dashboard..." />;
  }

  // Determine dynamic status for the 7-step Patient Journey
  const hasConsultations = consultations.length > 0;
  const hasRespondedConsult = consultations.some((c) => c.status === 'responded' || c.status === 'reviewed');
  const hasAppointments = appointments.length > 0;
  const hasTravelPlan = !!travelPlan;

  const patientJourneySteps = [
    {
      step: 1,
      title: 'Medical Need',
      status: 'completed' as const,
      date: 'Sep 12, 2026',
      description: 'Orthopedic joint pain evaluation & robotic surgical request initiated.'
    },
    {
      step: 2,
      title: 'Hospital Discovery',
      status: 'completed' as const,
      date: 'Sep 15, 2026',
      description: 'Explored and shortlisted top JCI & NABH accredited orthopedic centers in Delhi NCR & Chennai.'
    },
    {
      step: 3,
      title: 'Consultation',
      status: (hasRespondedConsult ? 'completed' : hasConsultations ? 'active' : 'pending') as 'completed' | 'active' | 'pending',
      date: hasRespondedConsult ? 'Sep 20, 2026' : 'In Progress',
      description: hasRespondedConsult
        ? 'Specialist teleconsultation & pre-op clinical review completed with hospital faculty.'
        : 'Specialist case review in progress with international patient desk.'
    },
    {
      step: 4,
      title: 'Treatment Planning',
      status: (hasAppointments ? 'completed' : hasRespondedConsult ? 'active' : 'pending') as 'completed' | 'active' | 'pending',
      date: hasAppointments ? 'Sep 24, 2026' : 'Upcoming',
      description: 'Robotic Bilateral Knee Replacement protocol & clinical cost estimate confirmed.'
    },
    {
      step: 5,
      title: 'Travel Planning',
      status: (hasTravelPlan ? 'completed' : 'active') as 'completed' | 'active' | 'pending',
      date: hasTravelPlan ? 'Oct 02, 2026' : 'In Progress',
      description: hasTravelPlan
        ? `Medical Visa (MED-1) approved. Flight AI 102 to ${travelPlan?.destinationCity || 'Delhi NCR'}.`
        : 'Medical Visa invitation letter issued and flight arrangements underway.'
    },
    {
      step: 6,
      title: 'Hospital Visit',
      status: (hasTravelPlan && travelPlan.status === 'confirmed' ? 'active' : 'pending') as 'completed' | 'active' | 'pending',
      date: 'Oct 08, 2026',
      description: 'Chauffeur airport escort from DEL Terminal 3 to hospital guest suites and admission.'
    },
    {
      step: 7,
      title: 'Follow-up',
      status: 'pending' as const,
      date: 'Oct 25, 2026',
      description: 'Post-op clinical recovery monitoring and scheduled virtual follow-up checkups.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. WELCOME MESSAGE BANNER */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-primary-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-primary-400 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-navy-950 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-white">
                Welcome back, {user?.name || 'Sarah Jenkins'}!
              </h1>
              <Badge variant="saffron" size="sm">
                International Patient
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Patient File: <span className="font-mono text-primary-300 font-semibold">IND-MED-2026-8842</span> • Residence: {user?.country || 'United States'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 block font-medium">Assigned Case Liaison:</span>
            <span className="text-xs font-bold text-white">Dr. Ananya Sharma (International Desk)</span>
          </div>
          <a
            href="tel:+914428290200"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <PhoneCall className="w-4 h-4" /> 24/7 Helpline
          </a>
        </div>
      </div>

      {/* 2. OVERVIEW METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Consultation Requests */}
        <Card className="border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Consultation Requests
              </span>
              <div className="text-2xl font-extrabold text-navy-950 mt-1">
                {consultations.length} Active
              </div>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Specialist Review Complete
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        {/* Card 2: Upcoming Appointments */}
        <Card className="border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Upcoming Appointment
              </span>
              <div className="text-2xl font-extrabold text-navy-950 mt-1">
                {appointments.length > 0 ? '1 Scheduled' : 'None'}
              </div>
              <span className="text-[11px] text-primary-700 font-medium flex items-center gap-1 mt-0.5">
                <Video className="w-3.5 h-3.5" /> Teleconsult Confirmed
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        {/* Card 3: Medical Documents */}
        <Link to="/dashboard/documents" className="block group">
          <Card className="border-slate-200/90 shadow-xs hover:shadow-md hover:border-primary-300 transition-all h-full">
            <CardBody className="p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Medical Documents
                </span>
                <div className="text-2xl font-extrabold text-navy-950 mt-1 group-hover:text-primary-600 transition-colors">
                  3 Verified
                </div>
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> MED-1 & Scans Ready
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
            </CardBody>
          </Card>
        </Link>

        {/* Card 4: Travel Plan */}
        <Link to="/dashboard/travel" className="block group">
          <Card className="border-slate-200/90 shadow-xs hover:shadow-md hover:border-primary-300 transition-all h-full">
            <CardBody className="p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Travel Planning
                </span>
                <div className="text-2xl font-extrabold text-navy-950 mt-1 group-hover:text-primary-600 transition-colors">
                  {travelPlan?.destinationCity || 'Delhi NCR'}
                </div>
                <span className="text-[11px] text-primary-700 font-medium flex items-center gap-1 mt-0.5">
                  <Plane className="w-3.5 h-3.5" /> Airport Pickup Confirmed
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plane className="w-6 h-6" />
              </div>
            </CardBody>
          </Card>
        </Link>
      </div>

      {/* 3. PATIENT JOURNEY - 7-STEP VISUAL TIMELINE */}
      <Card className="border-slate-200/90 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-navy-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              Patient Medical Journey Timeline
            </h2>
            <p className="text-xs text-slate-500">
              Visual roadmap tracking your progression from initial clinical inquiry to hospital visit and post-op care.
            </p>
          </div>
          <Badge variant="primary" size="md">
            Step 6 of 7: Hospital Visit Approaching
          </Badge>
        </CardHeader>

        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 relative">
            {patientJourneySteps.map((step) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';

              return (
                <div
                  key={step.step}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCompleted
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : isActive
                      ? 'bg-primary-50/90 border-primary-300 ring-2 ring-primary-500/20 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200/80 opacity-65'
                  }`}
                >
                  <div>
                    {/* Header: step indicator */}
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isActive
                            ? 'bg-primary-600 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.step}
                      </div>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isActive
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-navy-950 mb-1 leading-tight">
                      {step.step}. {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-3 mb-2">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-primary-800">{step.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* 4. MAIN DETAILS: CONSULTATIONS & UPCOMING APPOINTMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Consultation Requests & Upcoming Appointment */}
        <div className="lg:col-span-7 space-y-6">
          {/* UPCOMING APPOINTMENT */}
          <Card className="border-slate-200/90 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/60 border-b border-slate-200/80 flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Video className="w-4 h-4 text-primary-600" />
                Upcoming Specialist Appointment
              </h3>
              <Badge variant="success">Confirmed Teleconsult</Badge>
            </CardHeader>

            <CardBody className="p-6">
              {appointments.length > 0 ? (
                appointments.map((appt) => {
                  const doc = (appt.doctor as any) || {};
                  const hosp = (appt.hospital as any) || {};
                  const apptDate = appt.appointmentDate;

                  return (
                    <div key={appt._id} className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-primary-50/50 border border-primary-200/70">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={
                              doc.profileImage ||
                              'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=160&q=80'
                            }
                            alt={doc.name || 'Doctor'}
                            className="w-14 h-14 rounded-2xl object-cover border border-primary-200 shadow-xs"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-navy-950">
                              {doc.name || 'Dr. Ashok Rajgopal'}
                            </h4>
                            <p className="text-xs text-primary-700 font-medium">
                              {doc.specialization || 'Chairman, Orthopedic & Joint Reconstruction'}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {hosp.name || 'Medanta - The Medicity, Delhi NCR'}
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[11px] text-slate-500 block">Date & Time</span>
                          <span className="text-xs font-bold text-navy-950 block">
                            {apptDate
                              ? new Date(apptDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : 'Oct 04, 2026'}
                          </span>
                          <span className="text-[11px] text-primary-700 font-semibold">
                            04:30 PM IST (30 mins)
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <a
                          href={appt.meetingLink || 'https://telehealth.medvoyage.in/room/sarah-dr-rajgopal'}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full sm:w-auto flex-1"
                        >
                          <Button
                            variant="primary"
                            size="md"
                            className="w-full justify-center shadow-xs"
                            leftIcon={<Video className="w-4 h-4" />}
                          >
                            Join Doctor Video Room
                          </Button>
                        </a>
                        <Link to="/consultation" className="w-full sm:w-auto">
                          <Button variant="outline" size="md" className="w-full justify-center">
                            Request Additional Consult
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-500 space-y-2">
                  <p className="text-xs">No pending appointments right now.</p>
                  <Link to="/consultation">
                    <Button variant="primary" size="sm">
                      Book a Specialist Teleconsult
                    </Button>
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>

          {/* CONSULTATION REQUESTS LIST */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-600" />
                Consultation Requests & Hospital Inquiries
              </h3>
              <Badge variant="primary">{consultations.length} Inquiries</Badge>
            </CardHeader>

            <CardBody className="p-6 space-y-4">
              {consultations.length > 0 ? (
                consultations.map((c) => {
                  const hosp = (c.hospital as any) || {};
                  const doc = (c.doctor as any) || {};
                  const trt = (c.treatment as any) || {};

                  return (
                    <div
                      key={c._id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-navy-950">
                            {hosp.name || 'Accredited Indian Hospital'}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            {doc.name && <span>Doctor: <strong className="text-primary-700">{doc.name}</strong></span>}
                            {trt.name && <span>• Procedure: {trt.name}</span>}
                          </div>
                        </div>
                        <Badge
                          variant={
                            c.status === 'responded'
                              ? 'success'
                              : c.status === 'reviewed'
                              ? 'saffron'
                              : 'primary'
                          }
                        >
                          {c.status.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Patient Inquiry Text */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                        <span className="font-semibold text-slate-500 block text-[10px] uppercase mb-1">
                          Your Inquiry:
                        </span>
                        "{c.message}"
                      </div>

                      {/* Provider Clinical Response */}
                      {c.response ? (
                        <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200/70 text-xs text-emerald-950 space-y-1">
                          <span className="font-bold text-emerald-800 text-[10px] uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Hospital Desk / Doctor Response:
                          </span>
                          <p>{c.response}</p>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic">
                          Awaiting official review from the hospital international patient coordinator.
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>Submitted on {new Date(c.createdAt).toLocaleDateString()}</span>
                        {c.documentReference && <span>Ref: {c.documentReference}</span>}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 italic">No consultation requests submitted yet.</p>
              )}
            </CardBody>
          </Card>

          {/* SAVED HOSPITALS SECTION */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-primary-600" />
                Saved & Recommended Hospitals
              </h3>
              <Link to="/hospitals" className="text-xs font-semibold text-primary-700 hover:underline flex items-center gap-1">
                Explore All Hospitals <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardBody className="p-6 space-y-3">
              {savedHospitals.map((hosp) => (
                <div
                  key={hosp._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={hosp.image}
                      alt={hosp.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-navy-950">{hosp.name}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary-600" />
                        {hosp.city}, {hosp.state}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center text-[11px] font-bold text-amber-700">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-0.5" />
                          {hosp.rating}
                        </span>
                        <div className="flex items-center gap-1">
                          {(hosp.accreditation || []).slice(0, 2).map((acc) => (
                            <Badge key={acc} variant="primary" size="sm">
                              {acc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link to={`/hospitals/${hosp._id}`} className="w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        View Center
                      </Button>
                    </Link>
                    <Link to="/consultation" className="w-full sm:w-auto">
                      <Button variant="primary" size="sm" className="w-full text-xs">
                        Inquire
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* SAVED TREATMENT COST ESTIMATES */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-primary-600" />
                  Saved Treatment Cost Estimates
                </h3>
                <p className="text-xs text-slate-500">
                  Illustrative journey cost scenarios saved for your medical and travel planning.
                </p>
              </div>
              <Link to="/cost-estimator">
                <Button variant="outline" size="sm" className="text-xs" leftIcon={<Calculator className="w-3.5 h-3.5" />}>
                  New Estimate
                </Button>
              </Link>
            </CardHeader>

            <CardBody className="p-6 space-y-4">
              {costEstimates.length > 0 ? (
                costEstimates.map((est) => (
                  <div
                    key={est._id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <h4 className="text-sm font-bold text-navy-950">{est.treatmentName}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-primary-600" />
                          <span>
                            {est.hospitalName} ({est.city})
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" size="sm">
                          {est.complexity?.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => handleDeleteEstimate(est._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Delete Estimate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Medical</span>
                        <span className="font-extrabold text-navy-950 font-mono mt-0.5 block">
                          ₹{est.totals?.estimatedMedicalCost?.minINR?.toLocaleString('en-IN')} – ₹{est.totals?.estimatedMedicalCost?.maxINR?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Travel</span>
                        <span className="font-extrabold text-navy-950 font-mono mt-0.5 block">
                          ₹{est.totals?.estimatedTravelCost?.minINR?.toLocaleString('en-IN')} – ₹{est.totals?.estimatedTravelCost?.maxINR?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Lodging</span>
                        <span className="font-extrabold text-navy-950 font-mono mt-0.5 block">
                          ₹{est.totals?.estimatedAccommodationCost?.minINR?.toLocaleString('en-IN')} – ₹{est.totals?.estimatedAccommodationCost?.maxINR?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-primary-50/80 border border-primary-200">
                        <span className="text-[10px] uppercase font-bold text-primary-700 block">Total Range</span>
                        <span className="font-extrabold text-primary-900 font-mono mt-0.5 block">
                          ₹{est.totals?.estimatedTotalRange?.minINR?.toLocaleString('en-IN')} – ₹{est.totals?.estimatedTotalRange?.maxINR?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                      <span>
                        Saved on {new Date(est.createdAt).toLocaleDateString()} • {est.accommodationDuration}d lodging • {est.travelDuration}d travel
                      </span>
                      <Link
                        to="/cost-estimator"
                        className="font-bold text-primary-700 hover:underline flex items-center gap-1"
                      >
                        Recalculate or Compare &rarr;
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 space-y-3">
                  <p className="text-xs">No saved cost estimates yet.</p>
                  <Link to="/cost-estimator">
                    <Button variant="primary" size="sm" leftIcon={<Calculator className="w-3.5 h-3.5" />}>
                      Calculate Journey Cost
                    </Button>
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column (5 cols): Travel Plan & Medical Documents */}
        <div className="lg:col-span-5 space-y-6">
          {/* TRAVEL PLAN & LOGISTICS ITINERARY */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Plane className="w-4 h-4 text-primary-600" />
                Travel & Logistics Plan
              </h3>
              <Badge variant="saffron">Visa Stamped</Badge>
            </CardHeader>

            <CardBody className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Destination City</span>
                  <span className="font-bold text-navy-950 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-primary-600" />
                    {travelPlan?.destinationCity || 'Delhi NCR'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Flight Details</span>
                  <span className="font-bold text-navy-950 block mt-0.5">
                    Air India AI 102 (JFK to DEL)
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Medical Visa (MED-1):</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved by MEA
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Airport Pickup Escort:</span>
                  <span className="font-bold text-navy-950">Chauffeur Transfer at DEL Terminal 3</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Recovery Hotel:</span>
                  <span className="font-bold text-navy-950">Crowne Plaza Today Gurugram (4-Star)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Patient Coordinator:</span>
                  <span className="font-bold text-navy-950">Dedicated English Liaison</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary-50/80 border border-primary-200 text-xs text-primary-950 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-primary-900">
                  <ShieldCheck className="w-4 h-4 text-primary-700" />
                  VIP Arrival Protocol:
                </p>
                <p className="text-[11px] leading-relaxed">
                  Upon landing at New Delhi Indira Gandhi International (DEL), our airport representative will greet you at Terminal 3 Gate 5 with a name plaque, assist with customs and baggage, provide a local high-speed SIM card, and escort you to Medanta Guest Suites.
                </p>
              </div>

              <Link to="/dashboard/travel" className="block pt-2">
                <Button variant="primary" size="sm" className="w-full justify-center text-xs" leftIcon={<Plane className="w-3.5 h-3.5" />}>
                  Open Full Travel Planner & Roadmap
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* MEDICAL RECORDS & DOCUMENTS */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-600" />
                Medical Records & Documents
              </h3>
              <Link to="/dashboard/documents" className="text-xs font-semibold text-primary-700 hover:underline">
                View All Records
              </Link>
            </CardHeader>

            <CardBody className="p-6 space-y-3">
              {[
                {
                  title: 'Indian Medical Visa (MED-1) Invitation Letter.pdf',
                  type: 'Official MEA Visa Clearance Letter',
                  size: '1.1 MB'
                },
                {
                  title: 'Bilateral Knee X-Ray & MRI Scans.pdf',
                  type: 'High-Res Radiology Scans',
                  size: '4.8 MB'
                },
                {
                  title: 'Surgical Treatment Estimate & Clinical Protocol.pdf',
                  type: 'Hospital Financial Estimate',
                  size: '720 KB'
                }
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-950 line-clamp-1">{doc.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading secure document: ${doc.title}`)}
                    className="p-2 text-slate-500 hover:text-primary-700 rounded-lg hover:bg-white transition-colors"
                    title="Download Document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <Link to="/dashboard/documents" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full justify-center text-xs" leftIcon={<FileText className="w-3.5 h-3.5" />}>
                  Open Medical Document Center
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
