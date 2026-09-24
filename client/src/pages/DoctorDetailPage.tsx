import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchDoctorById } from '../services/doctorService';
import { Doctor, Hospital } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  UserCheck,
  Building2,
  MapPin,
  Star,
  Video,
  Languages,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Info
} from 'lucide-react';

export const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctor = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchDoctorById(id);
        setDoctor(data);
      } catch (err) {
        console.error('Failed to load doctor details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDoctor();
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullPage label="Loading doctor credentials, experience, and schedule..." />;
  }

  if (!doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-navy-950 mb-3">Doctor Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The requested doctor profile could not be loaded.</p>
        <Link to="/doctors">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Doctors Directory
          </Button>
        </Link>
      </div>
    );
  }

  const hospitalObj = typeof doctor.hospital === 'object' && doctor.hospital ? (doctor.hospital as Hospital) : null;
  const hospitalName = hospitalObj?.name || 'Accredited Partner Hospital';
  const hospitalCity = hospitalObj?.city || 'India';
  const hospitalSlugOrId = hospitalObj?.slug || hospitalObj?._id || '';

  const photo = doctor.profileImage || doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80';

  const feeUSD = doctor.consultationFee
    ? `$${doctor.consultationFee.minUSD} – $${doctor.consultationFee.maxUSD} USD`
    : `$${doctor.consultationFeeUSD || 60} USD`;

  const feeINR = doctor.consultationFee
    ? `₹${doctor.consultationFee.minINR.toLocaleString()} – ₹${doctor.consultationFee.maxINR.toLocaleString()} INR`
    : `₹${doctor.consultationFeeINR || 5000} INR`;

  return (
    <div className="pb-24 space-y-12">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Doctors Directory
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Doctor Avatar and Core Credentials */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative flex-shrink-0">
                <img
                  src={photo}
                  alt={doctor.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white/20 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full ring-4 ring-navy-950" title="Verified Specialist">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-primary-500/20 text-primary-300 border border-primary-400/30 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                    {doctor.specialization || doctor.specialty}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Specialist
                  </span>
                  {doctor.isAvailableForTeleconsult && (
                    <span className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" /> Teleconsult Available
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {doctor.name}
                </h1>

                <p className="text-xs text-slate-300 font-medium">
                  {doctor.qualification}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-saffron-400" />
                    <strong>{doctor.experience || doctor.experienceYears || 15}+ Years</strong> Clinical Experience
                  </span>
                  {hospitalName && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-primary-400" />
                      {hospitalName} ({hospitalCity})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Consultation Action Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl p-6 text-navy-950 shadow-2xl border border-slate-200 space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Consultation Fee
                  </span>
                  <div className="text-2xl font-extrabold text-navy-950 mt-1">
                    {feeUSD}
                  </div>
                  <p className="text-xs text-slate-500">
                    Local pricing: {feeINR}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Button
                    variant="saffron"
                    size="lg"
                    className="w-full font-bold shadow-md"
                    onClick={() => navigate(`/plan-journey?doctorId=${doctor._id}&doctorName=${encodeURIComponent(doctor.name)}&hospital=${hospitalObj?._id || ''}`)}
                  >
                    Request Consultation
                  </Button>
                </div>

                <p className="text-[11px] text-slate-400 text-center italic">
                  *Official consultation slot confirmed upon medical review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Profile Info */}
          <div className="lg:col-span-8 space-y-10">
            {/* Bio & Background */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary-600" />
                Doctor Profile & Clinical Biography
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {doctor.bio}
              </p>
            </div>

            {/* Qualifications & Credentials */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-600" />
                Medical Qualifications & Training
              </h2>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-navy-950 font-medium">
                {doctor.qualification}
              </div>
            </div>

            {/* Hospital Affiliation Card */}
            {hospitalObj && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary-600" />
                  Primary Hospital Affiliation
                </h2>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-navy-950">{hospitalObj.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary-600" />
                      {hospitalObj.address || `${hospitalObj.city}, ${hospitalObj.state}`}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(hospitalObj.accreditation || ['NABH']).map((acc) => (
                        <span key={acc} className="text-[10px] font-bold bg-navy-900 text-white px-2 py-0.5 rounded">
                          {acc} Certified
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link to={`/hospitals/${hospitalSlugOrId}`}>
                    <Button variant="outline" size="sm" className="whitespace-nowrap font-semibold">
                      View Hospital Profile
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-slate-200 space-y-5 sticky top-24">
              <h3 className="text-base font-bold text-navy-950">
                Consultation Information
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <Languages className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-navy-900 block font-semibold">Languages:</strong>
                    <span>{(doctor.languages || ['English', 'Hindi']).join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Video className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-navy-900 block font-semibold">Consultation Mode:</strong>
                    <span>{doctor.isAvailableForTeleconsult ? 'Video Teleconsultation & In-Person Hospital Assessment' : 'In-Person Hospital Assessment'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-navy-900 block font-semibold">Turnaround Time:</strong>
                    <span>Review of medical reports within 24 to 48 hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-navy-900 block font-semibold">Verified License:</strong>
                    <span>National Medical Commission / State Medical Council Registered</span>
                  </div>
                </div>
              </div>

              {/* Consultation Button */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Button
                  variant="saffron"
                  className="w-full font-bold shadow-md"
                  onClick={() => navigate(`/plan-journey?doctorId=${doctor._id}&doctorName=${encodeURIComponent(doctor.name)}&hospital=${hospitalObj?._id || ''}`)}
                >
                  Request Consultation
                </Button>
                <p className="text-[11px] text-slate-400 text-center">
                  Attach your scans or medical questions during request.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
