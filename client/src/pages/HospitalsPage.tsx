import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchHospitals } from '../services/hospitalService';
import { Hospital } from '../types';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Building2,
  MapPin,
  Star,
  Bed,
  ShieldCheck,
  Languages,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const CITIES = [
  'All Cities',
  'Delhi NCR',
  'Mumbai',
  'Chennai',
  'Bengaluru',
  'Hyderabad',
  'Kolkata'
];

const SPECIALTIES = [
  'All Specialties',
  'Cardiology',
  'Orthopedics',
  'Oncology',
  'Neurosciences',
  'Organ Transplants',
  'Robotic Surgery',
  'Fertility & IVF',
  'Dental Tourism'
];

const TREATMENTS = [
  'All Treatments',
  'Coronary Artery Bypass Graft',
  'Knee Replacement',
  'Liver Transplant',
  'CyberKnife',
  'Spinal Fusion',
  'Dental Implants',
  'IVF'
];

export const HospitalsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || 'All Cities';
  const initialSpecialty = searchParams.get('specialty') || 'All Specialties';
  const initialTreatment = searchParams.get('treatment') || 'All Treatments';
  const initialSearch = searchParams.get('search') || '';

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialty);
  const [selectedTreatment, setSelectedTreatment] = useState<string>(initialTreatment);
  const [verificationFilter, setVerificationFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [loading, setLoading] = useState<boolean>(true);

  const loadHospitals = async () => {
    setLoading(true);
    try {
      const data = await fetchHospitals({
        city: selectedCity === 'All Cities' ? undefined : selectedCity,
        specialty: selectedSpecialty === 'All Specialties' ? undefined : selectedSpecialty,
        treatment: selectedTreatment === 'All Treatments' ? undefined : selectedTreatment,
        verificationStatus: verificationFilter === 'All' ? undefined : verificationFilter,
        sortBy: sortBy,
        sortOrder: sortOrder,
        search: searchQuery || undefined
      });
      setHospitals(data);
    } catch (err) {
      console.error('Failed to load hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, [selectedCity, selectedSpecialty, selectedTreatment, verificationFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadHospitals();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">
          <Building2 className="w-4 h-4" /> Accredited Medical Centers
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Hospitals & Medical Institutes in India
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Discover verified multi-speciality tertiary and quaternary care hospitals accredited by JCI and NABH, featuring dedicated international patient lounges and experienced surgical faculties.
        </p>
      </div>

      {/* Comprehensive Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Row 1: Search by Hospital Name */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hospital name (e.g. Apollo, Fortis, Medanta, Max)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm text-navy-900 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500"
            />
          </div>

          <Button type="submit" variant="primary" size="md">
            Search Hospitals
          </Button>
        </form>

        {/* Row 2: City, Specialty, Treatment, Verification, Sorting Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* City Filter */}
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

          {/* Specialty Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Specialty
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

          {/* Treatment Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Treatment
            </label>
            <select
              value={selectedTreatment}
              onChange={(e) => setSelectedTreatment(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-navy-900 focus:outline-none focus:border-primary-500"
            >
              {TREATMENTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Verification Status
            </label>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-navy-900 focus:outline-none focus:border-primary-500"
            >
              <option value="All">All Providers</option>
              <option value="verified">Verified Providers Only</option>
            </select>
          </div>

          {/* Sorting Options */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <div className="flex gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-navy-900 focus:outline-none focus:border-primary-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="beds">Bed Capacity</option>
                <option value="establishedYear">Established Year</option>
              </select>
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="p-2 border border-slate-200 bg-slate-50 rounded-lg hover:bg-slate-100 text-slate-600"
                title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" label="Loading accredited healthcare facilities..." />
        </div>
      )}

      {/* Empty State */}
      {!loading && hospitals.length === 0 && (
        <EmptyState
          title="No hospitals match your filter criteria"
          description="Try broadening your city selection, specialty filter, or search keywords."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCity('All Cities');
                setSelectedSpecialty('All Specialties');
                setSelectedTreatment('All Treatments');
                setVerificationFilter('All');
                setSearchQuery('');
              }}
            >
              Reset All Filters
            </Button>
          }
        />
      )}

      {/* Hospitals Grid */}
      {!loading && hospitals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => {
            const isVerified = hospital.verificationStatus !== 'unverified';
            const displayImage = hospital.image || hospital.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80';
            const targetId = hospital.slug || hospital._id;

            return (
              <Card key={hospital._id} hover className="flex flex-col justify-between border-slate-200 shadow-xs">
                {/* Hospital Image & Status Badges */}
                <div className="relative">
                  <img
                    src={displayImage}
                    alt={hospital.name}
                    className="w-full h-52 object-cover rounded-t-xl"
                  />

                  {/* Verification Status Badge */}
                  <div className="absolute top-3 left-3 bg-navy-950/85 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow">
                    <ShieldCheck className={`w-3.5 h-3.5 ${isVerified ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{isVerified ? 'Verified Provider' : 'Unverified'}</span>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1 text-xs font-bold text-navy-950 shadow">
                    <Star className="w-3.5 h-3.5 text-saffron-500 fill-saffron-500" />
                    <span>{hospital.rating}</span>
                    <span className="text-slate-400 font-normal">({hospital.reviewCount})</span>
                  </div>
                </div>

                {/* Card Body Details */}
                <CardBody className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* City */}
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-primary-600" />
                      <span>{hospital.city}, {hospital.state}</span>
                    </div>

                    {/* Hospital Name */}
                    <h3 className="text-lg font-bold text-navy-950 mb-2 line-clamp-1">
                      {hospital.name}
                    </h3>

                    {/* Specialties List */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(hospital.specialties || []).slice(0, 3).map((spec) => (
                        <span
                          key={spec}
                          className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-md font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                      {(hospital.specialties || []).length > 3 && (
                        <span className="text-xs text-slate-400 py-0.5">
                          +{(hospital.specialties || []).length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Bed Capacity and Languages */}
                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Bed Capacity:</span>
                        <span className="font-semibold text-navy-900">{hospital.bedCount} Inpatient Beds</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Accreditations:</span>
                        <span className="font-semibold text-primary-700">
                          {(hospital.accreditation || hospital.accreditations || ['NABH']).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="pt-2 border-t border-slate-100">
                    <Link to={`/hospitals/${targetId}`} className="w-full block">
                      <Button variant="outline" size="sm" className="w-full font-semibold justify-between group">
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
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
