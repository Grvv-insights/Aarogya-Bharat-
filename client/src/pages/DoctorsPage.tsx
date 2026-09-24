import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { fetchDoctors } from '../services/doctorService';
import { fetchHospitals } from '../services/hospitalService';
import { Doctor, Hospital } from '../types';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import {
  UserCheck,
  Building2,
  MapPin,
  Star,
  Video,
  Languages,
  Award,
  Search,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

const SPECIALTIES = [
  'All Specialties',
  'Cardiology',
  'Orthopedics',
  'Oncology',
  'Neurology',
  'Organ Transplants',
  'Minimal Access & Bariatric Surgery',
  'Fertility & Reproductive Medicine',
  'Dental & Maxillofacial Rehabilitation',
  'Ophthalmology & Laser Eye Surgery'
];

const CITIES = [
  'All Cities',
  'Delhi NCR',
  'Mumbai',
  'Chennai',
  'Bengaluru',
  'Hyderabad',
  'Kolkata'
];

const EXPERIENCES = [
  { label: 'All Experience', value: 'All' },
  { label: '10+ Years', value: '10' },
  { label: '20+ Years', value: '20' },
  { label: '30+ Years', value: '30' }
];

export const DoctorsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialSpecialty = searchParams.get('specialty') || 'All Specialties';
  const initialCity = searchParams.get('city') || 'All Cities';
  const initialHospital = searchParams.get('hospitalId') || searchParams.get('hospital') || 'All Hospitals';
  const initialExperience = searchParams.get('experience') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialty);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [selectedHospital, setSelectedHospital] = useState<string>(initialHospital);
  const [selectedExperience, setSelectedExperience] = useState<string>(initialExperience);
  const [teleconsultOnly, setTeleconsultOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchHospitals().then(setHospitals).catch(console.error);
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await fetchDoctors({
        specialty: selectedSpecialty === 'All Specialties' ? undefined : selectedSpecialty,
        city: selectedCity === 'All Cities' ? undefined : selectedCity,
        hospital: selectedHospital === 'All Hospitals' ? undefined : selectedHospital,
        experience: selectedExperience === 'All' ? undefined : selectedExperience,
        teleconsult: teleconsultOnly ? true : undefined,
        search: searchQuery || undefined
      });
      setDoctors(data);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [selectedSpecialty, selectedCity, selectedHospital, selectedExperience, teleconsultOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDoctors();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">
          <UserCheck className="w-4 h-4" /> Verified Medical Specialists in India
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Find Specialist Doctors & Surgeons
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
          Connect directly with accredited department heads, transplant surgeons, and interventionalists. Request diagnostic evaluations or schedule video second opinions.
        </p>
      </div>

      {/* Comprehensive Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/90 space-y-4">
        {/* Row 1: Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctor by name, qualifications, or clinical focus..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100">
              <input
                type="checkbox"
                checked={teleconsultOnly}
                onChange={(e) => setTeleconsultOnly(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <Video className="w-3.5 h-3.5 text-primary-600" />
              <span>Teleconsultation Available</span>
            </label>

            <Button type="submit" variant="primary" size="md">
              Search Doctors
            </Button>
          </div>
        </form>

        {/* Row 2: Four Mandatory Filters: Specialization, City, Hospital, Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* 1. Specialization */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Specialization
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-navy-900 focus:outline-none focus:border-primary-500"
            >
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* 2. City */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-navy-900 focus:outline-none focus:border-primary-500"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Hospital */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Hospital
            </label>
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-navy-900 focus:outline-none focus:border-primary-500"
            >
              <option value="All Hospitals">All Hospitals</option>
              {hospitals.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
          </div>

          {/* 4. Experience */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Experience Level
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-navy-900 focus:outline-none focus:border-primary-500"
            >
              {EXPERIENCES.map((exp) => (
                <option key={exp.value} value={exp.value}>
                  {exp.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" label="Loading verified specialists..." />
        </div>
      )}

      {/* Empty State */}
      {!loading && doctors.length === 0 && (
        <EmptyState
          title="No doctors match your filter criteria"
          description="Try broadening your specialization, city, or hospital selection."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedSpecialty('All Specialties');
                setSelectedCity('All Cities');
                setSelectedHospital('All Hospitals');
                setSelectedExperience('All');
                setTeleconsultOnly(false);
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      )}

      {/* Doctors Grid */}
      {!loading && doctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => {
            const hospitalObj = typeof doctor.hospital === 'object' && doctor.hospital ? (doctor.hospital as Hospital) : null;
            const hospitalName = hospitalObj?.name || 'Accredited Partner Hospital';
            const hospitalCity = hospitalObj?.city || 'India';
            const photo = doctor.profileImage || doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80';

            return (
              <Card key={doctor._id} hover className="flex flex-col justify-between border-slate-200 shadow-xs">
                <CardBody className="p-6 space-y-4 flex flex-col justify-between h-full">
                  <div>
                    {/* Top Row: Avatar & Specialization */}
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={photo}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white" title="Verified Specialist">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-100 uppercase">
                            {doctor.specialization || doctor.specialty || 'Super-Specialist'}
                          </span>
                          {doctor.isAvailableForTeleconsult && (
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 flex items-center gap-1">
                              <Video className="w-3 h-3" /> Teleconsult
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-navy-950 mt-1 truncate">
                          {doctor.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {doctor.qualification}
                        </p>
                      </div>
                    </div>

                    {/* Hospital & Location */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                        <span className="font-medium text-navy-900 truncate">{hospitalName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{hospitalCity}</span>
                      </div>
                    </div>

                    {/* Experience & Languages */}
                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Experience</span>
                        <span className="font-bold text-navy-950 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-saffron-500" />
                          {doctor.experience || doctor.experienceYears || 15}+ Years
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Languages</span>
                        <span className="font-semibold text-slate-700 truncate block">
                          {(doctor.languages || ['English', 'Hindi']).slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Bio snippet */}
                    <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {doctor.bio}
                    </p>
                  </div>

                  {/* Consultation Fee & Actions */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Consultation Fee:</span>
                      <span className="font-bold text-navy-950">
                        ${doctor.consultationFee?.minUSD || 50} – ${doctor.consultationFee?.maxUSD || 80} USD
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link to={`/doctors/${doctor._id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full font-semibold">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/plan-journey?doctorId=${doctor._id}&doctorName=${encodeURIComponent(doctor.name)}&hospital=${hospitalObj?._id || ''}`)}
                        leftIcon={<Video className="w-3.5 h-3.5" />}
                        className="font-semibold"
                      >
                        Consult
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
