import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchHospitalById } from '../services/hospitalService';
import { Hospital, Review, Treatment, Doctor } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Building2,
  MapPin,
  Star,
  Bed,
  Calendar,
  Languages,
  Car,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Video,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight,
  Globe,
  MessageSquare,
  Award,
  ChevronRight
} from 'lucide-react';

export const HospitalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHospital = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchHospitalById(id);
        setHospital(data);
      } catch (err) {
        console.error('Failed to load hospital details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHospital();
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullPage label="Loading hospital profile, treatments, and specialists..." />;
  }

  if (!hospital) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-navy-950 mb-4">Hospital Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The requested hospital could not be loaded from our database.</p>
        <Link to="/hospitals">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Hospitals Directory
          </Button>
        </Link>
      </div>
    );
  }

  const isVerified = hospital.verificationStatus !== 'unverified';
  const doctorsList = (hospital.doctors || []) as Doctor[];
  const reviewsList = (hospital.reviews || []) as Review[];
  const treatmentsList = (hospital.treatments || []) as Treatment[];

  const defaultInternationalServices = [
    'Expedited Medical Visa (MED-1) Invitation Letters',
    'Complimentary Airport Meet-and-Greet & Chauffeur Transfer',
    'Dedicated Bedside Language Interpreters (Arabic, Russian, French)',
    'Pre-Activated Local SIM Card & Currency Exchange Assistance',
    'Preferential Rates at Partner 4/5 Star Hotels & Serviced Apartments',
    'Post-Discharge Follow-up Teleconsultation Coordination'
  ];

  const intlServices = hospital.internationalPatientServices && hospital.internationalPatientServices.length > 0
    ? hospital.internationalPatientServices
    : defaultInternationalServices;

  return (
    <div className="pb-24 space-y-10">
      {/* Hospital Banner & Header */}
      <div className="relative bg-navy-950 text-white pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/hospitals"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Hospital Network
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {(hospital.accreditation || hospital.accreditations || ['NABH']).map((acc) => (
                  <span
                    key={acc}
                    className="bg-primary-500/20 text-primary-300 border border-primary-400/30 text-xs font-bold px-2.5 py-0.5 rounded"
                  >
                    {acc} Certified
                  </span>
                ))}
                {isVerified && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Healthcare Provider
                  </span>
                )}
                <span className="bg-saffron-500/20 text-saffron-300 border border-saffron-400/30 text-xs font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-saffron-400 text-saffron-400" />
                  {hospital.rating} Rating ({hospital.reviewCount} Reviews)
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {hospital.name}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary-400" />
                  {hospital.address}, {hospital.city}, {hospital.state}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary-400" />
                  Est. {hospital.establishedYear}
                </span>
                <span className="flex items-center gap-1">
                  <Bed className="w-4 h-4 text-primary-400" />
                  {hospital.bedCount} Inpatient Beds
                </span>
              </div>
            </div>

            {/* Quick Consultation CTA */}
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Button
                variant="saffron"
                size="lg"
                className="font-bold shadow-xl px-8"
                onClick={() => navigate(`/plan-journey?hospital=${hospital._id}&hospitalName=${encodeURIComponent(hospital.name)}`)}
              >
                Request Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Info Columns */}
          <div className="lg:col-span-8 space-y-10">
            {/* Hospital Profile Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-600" />
                Hospital Profile & Overview
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {hospital.description}
              </p>

              {/* Specialties / Centers of Excellence */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Centers of Clinical Excellence
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg border border-primary-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Clinical & Campus Facilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                  {(hospital.facilities || [
                    'Modular Robotic Surgical Theaters',
                    'Bi-Plane Digital Cath Labs',
                    'Dedicated Bone Marrow & Organ Transplant ICUs',
                    '24/7 International Patient Concierge Wing'
                  ]).map((fac, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Treatments Offered */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-navy-950">
                    Key Procedures & Treatments
                  </h2>
                  <p className="text-xs text-slate-500">
                    Procedures performed with advanced clinical technology at this center.
                  </p>
                </div>
                <Link to="/treatments">
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Explore All
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {treatmentsList.length > 0 ? (
                  treatmentsList.map((t) => (
                    <Card key={t._id} className="p-4 border-slate-200 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                          {t.category}
                        </span>
                        <h4 className="text-base font-bold text-navy-950 mt-1.5 mb-1">{t.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{t.overview || t.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-primary-700">
                          {t.estimatedCostRange
                            ? `$${t.estimatedCostRange.minUSD.toLocaleString()} – $${t.estimatedCostRange.maxUSD.toLocaleString()}`
                            : 'Quote on Request'}
                        </span>
                        <Link to={`/treatments/${t.slug || t._id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="sm:col-span-2 p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    Comprehensive multi-specialty surgical services available across all departments.
                  </div>
                )}
              </div>
            </div>

            {/* Doctors at this Hospital */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-navy-950">
                    Department Faculty & Doctors
                  </h2>
                  <p className="text-xs text-slate-500">
                    Consult with senior department directors and chief surgeons.
                  </p>
                </div>
                <Link to={`/doctors?hospitalId=${hospital._id}`}>
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Hospital Doctors
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {doctorsList.length > 0 ? (
                  doctorsList.map((doc) => (
                    <Card key={doc._id} className="p-5 flex flex-col justify-between border-slate-200">
                      <div>
                        <div className="flex items-start gap-4 mb-3">
                          <img
                            src={doc.profileImage || doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80'}
                            alt={doc.name}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <h4 className="text-base font-bold text-navy-950">{doc.name}</h4>
                            <p className="text-xs font-semibold text-primary-700">{doc.specialization || doc.specialty}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{doc.qualification}</p>
                            <span className="inline-block mt-1 text-xs text-slate-600 font-medium">
                              {doc.experience || doc.experienceYears || 15}+ Years Experience
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <Link to={`/doctors/${doc._id}`}>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </Link>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/plan-journey?hospital=${hospital._id}&doctorId=${doc._id}&doctorName=${encodeURIComponent(doc.name)}`)}
                        >
                          Request Consult
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">Department faculty directory available upon request.</p>
                )}
              </div>
            </div>

            {/* International Patient Services */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary-600" />
                International Patient Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                {intlServices.map((service, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Reviews Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-navy-950 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                    Patient Reviews & Experiences
                  </h2>
                  <p className="text-xs text-slate-500">
                    Verified feedback from international patients treated at this center.
                  </p>
                </div>
              </div>

              {reviewsList.length > 0 ? (
                <div className="space-y-4">
                  {reviewsList.map((rev) => (
                    <Card key={rev._id} className="p-5 border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-navy-950">{rev.patientName}</h4>
                          <span className="text-xs text-slate-500">{rev.patientCountry}</span>
                        </div>
                        <div className="flex items-center text-saffron-400">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                      {rev.treatmentName && (
                        <div className="mt-2 text-[11px] text-primary-700 font-semibold">
                          Procedure: {rev.treatmentName}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center border-slate-200 text-xs text-slate-500">
                  <p>Over 500+ successful international cases coordinated with {hospital.name}.</p>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-slate-200 space-y-5 sticky top-24">
              <h3 className="text-base font-bold text-navy-950">
                Hospital Information & Desk
              </h3>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <Languages className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-navy-900 block font-semibold">Languages Supported:</strong>
                    <span>{(hospital.languagesSupported || hospital.languageSupport || ['English', 'Hindi', 'Arabic']).join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-navy-900 block font-semibold">Airport Logistics:</strong>
                    <span>VIP arrival pickup coordinated at international terminal</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-navy-900 block font-semibold">Helpline Desk:</strong>
                    <span>{hospital.contact?.phone || hospital.contactPhone || '+91 44 2829 0200'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-navy-900 block font-semibold">Patient Liaison Email:</strong>
                    <span>{hospital.contact?.email || hospital.contactEmail || 'care@hospital.com'}</span>
                  </div>
                </div>
              </div>

              {/* Consultation CTA */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Button
                  variant="saffron"
                  className="w-full font-bold shadow-md"
                  onClick={() => navigate(`/plan-journey?hospital=${hospital._id}&hospitalName=${encodeURIComponent(hospital.name)}`)}
                >
                  Request Consultation
                </Button>
                <p className="text-[11px] text-slate-400 text-center">
                  Free assessment & doctor opinion in 24 hours.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
