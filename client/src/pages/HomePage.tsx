import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchTreatments } from '../services/treatmentService';
import { fetchHospitals } from '../services/hospitalService';
import { fetchCities } from '../services/cityService';
import { Treatment, Hospital, CitySummary } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Search,
  Building2,
  Stethoscope,
  HeartPulse,
  Activity,
  ShieldCheck,
  Star,
  MapPin,
  ArrowRight,
  FileText,
  CalendarCheck,
  Plane,
  Calculator,
  Compass,
  CheckCircle2,
  Lock,
  HeartHandshake,
  Sparkles,
  Bed,
  Languages,
  Check,
  ChevronRight,
  FolderLock
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Data states
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [cities, setCities] = useState<CitySummary[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [loadingTreatments, setLoadingTreatments] = useState(true);

  // Search/Discovery component states
  const [searchTab, setSearchTab] = useState<'treatment' | 'city' | 'hospital' | 'specialty'>('treatment');
  const [treatmentQuery, setTreatmentQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Fallback / Preset destinations with objective, factual information
  const defaultCities: CitySummary[] = [
    {
      name: 'Delhi NCR',
      state: 'Delhi / Haryana',
      tagline: 'Quaternary Healthcare & Advanced Robotics Hub',
      description: 'Major healthcare center with multispecialty quaternary hospitals, Da Vinci robotic surgery systems, and direct connectivity via Indira Gandhi International Airport.',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      hospitalsCount: 4,
      topSpecialties: ['Cardiology', 'Oncology', 'Organ Transplants', 'Robotic Surgery', 'Neurosciences']
    },
    {
      name: 'Mumbai',
      state: 'Maharashtra',
      tagline: 'Tertiary Multispeciality & Specialized Surgery',
      description: 'Established healthcare hub with accredited private tertiary institutions, high-volume cardiac surgery programs, and comprehensive international patient services.',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      hospitalsCount: 2,
      topSpecialties: ['Cardiology', 'Robotic Surgery', 'Cosmetic Reconstruction', 'Oncology']
    },
    {
      name: 'Chennai',
      state: 'Tamil Nadu',
      tagline: 'Cardiac Care & Organ Transplantation Network',
      description: 'Longstanding medical destination recognized for high surgical volumes in adult and pediatric cardiac surgery, joint replacements, and living-donor organ transplants.',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      hospitalsCount: 3,
      topSpecialties: ['Cardiology', 'Organ Transplants', 'Orthopedics', 'Ophthalmology', 'Bone Marrow']
    },
    {
      name: 'Bengaluru',
      state: 'Karnataka',
      tagline: 'Medical Innovation, IVF & Spine Surgery',
      description: 'High-tech healthcare destination housing modern multispecialty hospitals, advanced embryology cleanrooms, and robotic spinal decompression suites.',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      hospitalsCount: 2,
      topSpecialties: ['Fertility & IVF', 'Pediatric Cardiology', 'Orthopedics & Spine', 'Neurology']
    },
    {
      name: 'Hyderabad',
      state: 'Telangana',
      tagline: 'Transplantation & Minimally Invasive Centers',
      description: 'Large medical centers featuring integrated oncology towers, living-donor liver and kidney transplant facilities, and dedicated international guest accommodations.',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80',
      hospitalsCount: 2,
      topSpecialties: ['Liver Transplants', 'Orthopedics', 'Gastroenterology', 'Urology']
    },
    {
      name: 'Kolkata',
      state: 'West Bengal',
      tagline: 'Eastern Healthcare Referral Hub & Oncology Care',
      description: 'Primary referral center for Eastern India and neighboring South Asian international travelers, with established tertiary oncology, cardiac, and gastroenterology networks.',
      image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
      hospitalsCount: 1,
      topSpecialties: ['Cardiology', 'Surgical Oncology', 'Gastroenterology', 'General Surgery']
    }
  ];

  // Specific 6 core treatments required by the user prompt
  const popularTreatmentCards = [
    {
      key: 'Cardiology',
      category: 'Cardiology',
      title: 'Cardiac Sciences & Bypass Surgery (CABG)',
      description: 'Minimally invasive and beating-heart coronary artery bypass, heart valve replacement, and complex pediatric cardiology.',
      minUSD: 5500,
      maxUSD: 7500,
      usaComparison: 125000,
      savingsPct: 94,
      hospitalStay: '5 - 7 Days',
      icon: HeartPulse,
      slug: 'coronary-artery-bypass-graft',
      badgeColor: 'text-red-700 bg-red-50 border-red-200'
    },
    {
      key: 'Orthopedics',
      category: 'Orthopedics',
      title: 'Robotic Joint Replacement & Spine',
      description: 'Sub-millimeter robotic-assisted total knee and hip replacement, minimally invasive spine decompression, and sports arthroscopy.',
      minUSD: 4800,
      maxUSD: 6500,
      usaComparison: 48000,
      savingsPct: 89,
      hospitalStay: '4 - 5 Days',
      icon: Activity,
      slug: 'total-knee-replacement-bilateral',
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      key: 'Oncology',
      category: 'Oncology',
      title: 'Robotic Radiosurgery & Surgical Oncology',
      description: 'CyberKnife robotic stereotactic radiation, organ-preserving tumor resections, and specialized medical cancer care.',
      minUSD: 6500,
      maxUSD: 8500,
      usaComparison: 65000,
      savingsPct: 88,
      hospitalStay: '1 - 4 Days',
      icon: Stethoscope,
      slug: 'cyberknife-radiosurgery',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200'
    },
    {
      key: 'Neurology',
      category: 'Neurology',
      title: 'Neurosciences & Minimally Invasive Spine',
      description: 'Advanced artificial disc replacement, dynamic spinal stabilization, and complex neurological microsurgery with neuro-monitoring.',
      minUSD: 6000,
      maxUSD: 8200,
      usaComparison: 75000,
      savingsPct: 90,
      hospitalStay: '3 - 5 Days',
      icon: Compass,
      slug: 'spinal-fusion-disc-replacement',
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    },
    {
      key: 'Organ Transplant',
      category: 'Organ Transplant',
      title: 'Living Donor Liver & Kidney Transplants',
      description: 'Comprehensive living-donor liver and renal transplantation conducted by multidisciplinary surgical and intensive care teams.',
      minUSD: 28000,
      maxUSD: 36000,
      usaComparison: 340000,
      savingsPct: 90,
      hospitalStay: '14 - 20 Days',
      icon: Building2,
      slug: 'living-donor-liver-transplant',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      key: 'Cosmetic Surgery',
      category: 'Cosmetic Surgery',
      title: 'Aesthetic Plastic & Reconstructive Surgery',
      description: 'Precision rhinoplasty, facial rejuvenation, body contouring, and reconstructive plastic surgery by certified aesthetic surgeons.',
      minUSD: 2200,
      maxUSD: 3500,
      usaComparison: 14000,
      savingsPct: 82,
      hospitalStay: '1 - 2 Days',
      icon: Sparkles,
      slug: 'rhinoplasty-facial-reconstruction',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hospitalsData, treatmentsData, citiesData] = await Promise.all([
          fetchHospitals(),
          fetchTreatments(),
          fetchCities()
        ]);
        setHospitals(hospitalsData.slice(0, 4));
        setTreatments(treatmentsData);
        if (citiesData && citiesData.length > 0) {
          setCities(citiesData);
        } else {
          setCities(defaultCities);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setCities(defaultCities);
      } finally {
        setLoadingHospitals(false);
        setLoadingTreatments(false);
      }
    };
    loadData();
  }, []);

  // Search Dispatcher
  const handleSearchExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (searchTab === 'treatment') {
      const params = new URLSearchParams();
      if (treatmentQuery) params.append('search', treatmentQuery);
      navigate(`/treatments?${params.toString()}`);
    } else if (searchTab === 'city') {
      const params = new URLSearchParams();
      if (selectedCity) params.append('city', selectedCity);
      navigate(`/hospitals?${params.toString()}`);
    } else if (searchTab === 'hospital') {
      const params = new URLSearchParams();
      if (selectedHospital) params.append('search', selectedHospital);
      navigate(`/hospitals?${params.toString()}`);
    } else if (searchTab === 'specialty') {
      const params = new URLSearchParams();
      if (selectedSpecialty) params.append('category', selectedSpecialty);
      navigate(`/treatments?${params.toString()}`);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* ========================================================
          1. HERO SECTION WITH PROMINENT DISCOVERY SEARCH
         ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/80 via-white to-slate-50 pt-12 pb-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Main Message & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100/90 text-primary-800 text-xs font-semibold border border-primary-200">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                <span>Verified Hospitals & Specialists in India</span>
              </div>

              {/* Exact Main Message */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.12]">
                Your Medical Journey to India,{' '}
                <span className="text-primary-700 bg-clip-text">
                  Simplified.
                </span>
              </h1>

              {/* Exact Supporting Text */}
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Discover accredited treatments, world-renowned hospitals, and experienced doctors across India. Request expert medical consultations, estimate procedure costs transparently, and organize your medical travel with dedicated assistance.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link to="/treatments">
                  <Button variant="primary" size="lg" className="px-6 shadow-md shadow-primary-600/20 font-semibold">
                    Find Treatment
                  </Button>
                </Link>
                <Link to="/hospitals">
                  <Button variant="outline" size="lg" className="px-6 font-semibold">
                    Find Hospital
                  </Button>
                </Link>
              </div>

              {/* PROMINENT SEARCH / DISCOVERY COMPONENT */}
              <div className="pt-4">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-5 max-w-2xl">
                  {/* Search Options Tabs: Treatment | City | Hospital | Specialty */}
                  <div className="flex flex-wrap border-b border-slate-200 pb-3 gap-1 sm:gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setSearchTab('treatment')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        searchTab === 'treatment'
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Treatment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSearchTab('city')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        searchTab === 'city'
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>City</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSearchTab('hospital')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        searchTab === 'hospital'
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Hospital</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSearchTab('specialty')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        searchTab === 'specialty'
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span>Specialty</span>
                    </button>
                  </div>

                  {/* Active Tab Search Fields */}
                  <form onSubmit={handleSearchExecute} className="flex flex-col sm:flex-row items-center gap-3">
                    {searchTab === 'treatment' && (
                      <div className="relative w-full flex-1">
                        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={treatmentQuery}
                          onChange={(e) => setTreatmentQuery(e.target.value)}
                          placeholder="e.g. Heart Bypass, Knee Replacement, CyberKnife..."
                          className="w-full pl-10 pr-3 py-2.5 text-sm text-navy-950 rounded-xl border border-slate-200 focus:border-primary-500 focus:outline-none"
                        />
                      </div>
                    )}

                    {searchTab === 'city' && (
                      <div className="relative w-full flex-1">
                        <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-sm text-navy-950 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary-500 focus:outline-none"
                        >
                          <option value="">Select an Indian Healthcare Hub...</option>
                          <option value="Delhi NCR">Delhi NCR (New Delhi & Gurugram)</option>
                          <option value="Mumbai">Mumbai (Maharashtra)</option>
                          <option value="Chennai">Chennai (Tamil Nadu)</option>
                          <option value="Bengaluru">Bengaluru (Karnataka)</option>
                          <option value="Hyderabad">Hyderabad (Telangana)</option>
                          <option value="Kolkata">Kolkata (West Bengal)</option>
                        </select>
                      </div>
                    )}

                    {searchTab === 'hospital' && (
                      <div className="relative w-full flex-1">
                        <Building2 className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={selectedHospital}
                          onChange={(e) => setSelectedHospital(e.target.value)}
                          placeholder="e.g. Apollo, Fortis, Medanta, Max Healthcare..."
                          className="w-full pl-10 pr-3 py-2.5 text-sm text-navy-950 rounded-xl border border-slate-200 focus:border-primary-500 focus:outline-none"
                        />
                      </div>
                    )}

                    {searchTab === 'specialty' && (
                      <div className="relative w-full flex-1">
                        <HeartPulse className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          value={selectedSpecialty}
                          onChange={(e) => setSelectedSpecialty(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-sm text-navy-950 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary-500 focus:outline-none"
                        >
                          <option value="">Select Medical Specialty...</option>
                          <option value="Cardiology">Cardiology & Cardiac Surgery</option>
                          <option value="Orthopedics">Orthopedics & Joint Replacement</option>
                          <option value="Oncology">Oncology & Cancer Care</option>
                          <option value="Neurology">Neurology & Spine Surgery</option>
                          <option value="Organ Transplants">Organ Transplants (Liver / Kidney)</option>
                          <option value="Cosmetic & Plastic Surgery">Cosmetic & Plastic Surgery</option>
                          <option value="Fertility & IVF">Fertility & Reproductive Medicine</option>
                          <option value="Dental Tourism">Dental Implantology & Maxillofacial</option>
                        </select>
                      </div>
                    )}

                    <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto px-6 whitespace-nowrap">
                      Search Now
                    </Button>
                  </form>

                  {/* Fast Exploration Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Quick Searches:</span>
                    {['Cardiology', 'Knee Replacement', 'CyberKnife', 'Chennai', 'Medanta'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (['Cardiology', 'Knee Replacement', 'CyberKnife'].includes(item)) {
                            navigate(`/treatments?search=${encodeURIComponent(item)}`);
                          } else {
                            navigate(`/hospitals?search=${encodeURIComponent(item)}`);
                          }
                        }}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual / Highlight Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80"
                  alt="Modern operating theater in India"
                  className="w-full h-72 sm:h-80 object-cover"
                />

                {/* Floating Highlights Box */}
                <div className="p-6 bg-white space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
                        Patient Case Profile
                      </span>
                      <h4 className="text-base font-bold text-navy-950">
                        Coronary Artery Bypass (CABG)
                      </h4>
                    </div>
                    <Badge variant="success">94% Savings</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-500 block">USA Average Cost</span>
                      <span className="text-sm font-bold text-slate-400 line-through">$125,000</span>
                    </div>
                    <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                      <span className="text-emerald-700 block font-semibold">India Estimated Cost</span>
                      <span className="text-base font-extrabold text-emerald-800">$6,500</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-primary-600" />
                      JCI / NABH Facility
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      *Demo planning estimate
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Trust Badge */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 max-w-xs hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-navy-950">End-to-End Coordination</p>
                  <p className="text-slate-500">From second opinion to airport reception</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. SECTION: POPULAR TREATMENTS
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">
              <Stethoscope className="w-4 h-4" />
              Clinical Specialties & Cost Clarity
            </div>
            <h2 className="text-3xl font-extrabold text-navy-950">
              Popular Treatments in India
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Compare transparent estimated procedure costs in India with international benchmarks. Costs presented are realistic demo planning ranges.
            </p>
          </div>
          <Link to="/treatments" className="mt-4 md:mt-0">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore All Treatments
            </Button>
          </Link>
        </div>

        {/* 6 Core Treatment Cards: Cardiology, Orthopedics, Oncology, Neurology, Organ Transplant, Cosmetic Surgery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTreatmentCards.map((treatment) => {
            const Icon = treatment.icon;
            return (
              <Card key={treatment.key} hover className="flex flex-col justify-between border-slate-200/90 shadow-xs">
                <CardBody className="p-6 flex flex-col justify-between h-full space-y-5">
                  <div>
                    {/* Header badge & icon */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${treatment.badgeColor}`}>
                        {treatment.category}
                      </span>
                      <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-700">
                        <Icon className="w-4 h-4 text-primary-600" />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-navy-950 mb-2 leading-snug">
                      {treatment.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {treatment.description}
                    </p>
                  </div>

                  {/* Pricing Comparison Grid */}
                  <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Estimated Range in India:</span>
                      <span className="font-extrabold text-navy-950 text-sm">
                        ${treatment.minUSD.toLocaleString()} – ${treatment.maxUSD.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60">
                      <span className="text-slate-400">USA Average Benchmark:</span>
                      <span className="text-slate-400 line-through font-semibold">
                        ${treatment.usaComparison.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <span className="text-emerald-700 font-semibold">Average Potential Savings:</span>
                      <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded">
                        Up to {treatment.savingsPct}%
                      </span>
                    </div>
                  </div>

                  {/* Actions & Disclaimer */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Hospital Stay: <strong>{treatment.hospitalStay}</strong></span>
                      <span className="italic">*Demo estimate</span>
                    </div>

                    <Link to={`/treatments?search=${encodeURIComponent(treatment.category)}`} className="block">
                      <Button variant="outline" size="sm" className="w-full group">
                        <span>View Procedures & Providers</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          3. SECTION: FEATURED HOSPITALS
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              Verified Healthcare Facilities
            </div>
            <h2 className="text-3xl font-extrabold text-navy-950">
              Featured Hospitals in India
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Partnering with JCI and NABH accredited medical facilities equipped with robotic surgery, specialized ICUs, and dedicated international patient lounges.
            </p>
          </div>
          <Link to="/hospitals" className="mt-4 md:mt-0">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Hospitals
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loadingHospitals && (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="lg" label="Loading accredited hospitals..." />
          </div>
        )}

        {/* Hospitals Grid */}
        {!loadingHospitals && hospitals.length === 0 && (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No hospitals loaded at the moment.</p>
          </div>
        )}

        {!loadingHospitals && hospitals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hospitals.map((hospital) => {
              const accreditations = hospital.accreditation || hospital.accreditations || ['NABH'];
              const displayImage = hospital.image || hospital.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80';

              return (
                <Card key={hospital._id} hover className="flex flex-col justify-between border-slate-200/90 shadow-xs">
                  {/* Hospital Image & Badges */}
                  <div className="relative">
                    <img
                      src={displayImage}
                      alt={hospital.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />

                    {/* Verification Badge */}
                    <div className="absolute top-3 left-3 bg-navy-950/85 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Provider</span>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1 text-xs font-bold text-navy-950 shadow">
                      <Star className="w-3.5 h-3.5 text-saffron-500 fill-saffron-500" />
                      <span>{hospital.rating}</span>
                      <span className="text-slate-400 font-normal">({hospital.reviewCount})</span>
                    </div>
                  </div>

                  {/* Hospital Details */}
                  <CardBody className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* City */}
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-primary-600" />
                        <span>{hospital.city}, {hospital.state}</span>
                      </div>

                      {/* Hospital Name */}
                      <h3 className="text-base font-bold text-navy-950 mb-2 line-clamp-1">
                        {hospital.name}
                      </h3>

                      {/* Specialties Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(hospital.specialties || []).slice(0, 3).map((spec) => (
                          <span
                            key={spec}
                            className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded"
                          >
                            {spec}
                          </span>
                        ))}
                        {(hospital.specialties || []).length > 3 && (
                          <span className="text-[10px] text-slate-400 py-0.5">
                            +{(hospital.specialties || []).length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Facilities / Bed count */}
                      <div className="space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                        <div className="flex items-center gap-2">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span>{hospital.bedCount} Inpatient Beds</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Languages className="w-3.5 h-3.5 text-slate-400" />
                          <span>{(hospital.languagesSupported || hospital.languageSupport || ['English', 'Hindi']).slice(0, 3).join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Hospital Button */}
                    <Link to={`/hospitals/${hospital.slug}`} className="w-full block">
                      <Button variant="outline" size="sm" className="w-full font-semibold">
                        View Hospital
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================
          4. SECTION: MEDICAL DESTINATIONS
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="primary" className="mb-2">
            Indian Healthcare Destinations
          </Badge>
          <h2 className="text-3xl font-extrabold text-navy-950">
            Medical Destinations in India
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Explore major Indian healthcare cities equipped with accredited quaternary hospitals, direct international flight connections, and comprehensive patient amenities.
          </p>
        </div>

        {/* City Cards: Delhi, Mumbai, Chennai, Bengaluru, Hyderabad, Kolkata */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(cities.length > 0 ? cities : defaultCities).map((dest) => {
            const cityName = dest.name;
            const countLabel = `${dest.hospitalsCount} Verified Center${dest.hospitalsCount > 1 ? 's' : ''}`;

            return (
              <div
                key={cityName}
                onClick={() => navigate(`/hospitals?city=${encodeURIComponent(cityName)}`)}
                className="group relative rounded-2xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-navy-950"
              >
                <img
                  src={dest.image}
                  alt={cityName}
                  className="w-full h-80 object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/45 to-transparent"></div>

                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <span className="text-xs font-bold text-saffron-400 uppercase tracking-wider block mb-1">
                    {dest.tagline}
                  </span>
                  <h3 className="text-2xl font-extrabold mb-1">{cityName}</h3>
                  <p className="text-xs text-slate-300 line-clamp-3 mb-3 leading-relaxed">
                    {dest.description}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-2.5 border-t border-white/20">
                    <span className="font-semibold text-primary-300">{countLabel}</span>
                    <span className="inline-flex items-center gap-1 text-white font-medium group-hover:text-primary-300 transition-colors">
                      Explore Hospitals in {cityName} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          5. SECTION: HOW IT WORKS (EXACT 6 STEPS)
         ======================================================== */}
      <section id="how-it-works" className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="saffron" className="mb-3">
              Step-by-Step Patient Guide
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              How It Works
            </h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              We guide you through a structured, transparent process from your first medical inquiry to safe return home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700/80 relative flex flex-col justify-between">
              <span className="text-4xl font-extrabold text-slate-700 absolute top-4 right-4">01</span>
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">1. Tell us what you need</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Share your medical condition, current symptoms, or existing diagnostic reports securely through our platform.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700/80 relative flex flex-col justify-between">
              <span className="text-4xl font-extrabold text-slate-700 absolute top-4 right-4">02</span>
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">2. Explore hospitals and doctors</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Search across verified healthcare institutions, compare specialized departments, surgical track records, and doctor credentials.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700/80 relative flex flex-col justify-between">
              <span className="text-4xl font-extrabold text-slate-700 absolute top-4 right-4">03</span>
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center mb-4">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">3. Request consultation</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Request specialist second opinions or schedule remote teleconsultations with top surgeons prior to making travel decisions.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700/80 relative flex flex-col justify-between">
              <span className="text-4xl font-extrabold text-slate-700 absolute top-4 right-4">04</span>
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">4. Receive treatment estimate</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Get realistic procedure cost ranges, estimated hospital stay durations, and expected recuperation timelines.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700/80 relative flex flex-col justify-between">
              <span className="text-4xl font-extrabold text-slate-700 absolute top-4 right-4">05</span>
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center mb-4">
                  <Plane className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">5. Plan your trip</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Coordinate medical visa invitation paperwork, airport pickup, family lodging, and dedicated language interpreter assistance.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700/80 relative flex flex-col justify-between">
              <span className="text-4xl font-extrabold text-slate-700 absolute top-4 right-4">06</span>
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center mb-4">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">6. Begin your medical journey</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Arrive at your hospital destination with personalized bedside coordination, dedicated care, and follow-up support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. SECTION: WHY USE THE PLATFORM
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="primary" className="mb-2">
            Platform Capabilities
          </Badge>
          <h2 className="text-3xl font-extrabold text-navy-950">
            Why Use The Platform
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            MedJourney India combines medical discovery, cost transparency, and travel logistics in one unified system.
          </p>
        </div>

        {/* 7 Core Platform Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Healthcare discovery */}
          <Card className="p-6 border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 mb-1.5">Healthcare discovery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Easily discover accredited hospitals, top surgical departments, and credentialed doctors across India based on your medical condition.
              </p>
            </div>
          </Card>

          {/* 2. Hospital comparison */}
          <Card className="p-6 border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 mb-1.5">Hospital comparison</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare multiple healthcare providers side-by-side by clinical accreditations, technologies, bed capacity, and patient ratings.
              </p>
            </div>
          </Card>

          {/* 3. Doctor consultation requests */}
          <Card className="p-6 border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 mb-1.5">Doctor consultation requests</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with experienced specialists to discuss diagnostic scans, evaluate surgical options, and receive clinical opinions.
              </p>
            </div>
          </Card>

          {/* 4. Medical document organization */}
          <Card className="p-6 border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <FolderLock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 mb-1.5">Medical document organization</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Securely store blood work, MRI scans, and clinical summaries in one central dashboard accessible to you and your treating doctors.
              </p>
            </div>
          </Card>

          {/* 5. Cost planning */}
          <Card className="p-6 border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 mb-1.5">Cost planning</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore realistic cost ranges for procedures and understand international savings with clear, transparent cost estimates.
              </p>
            </div>
          </Card>

          {/* 6. Travel assistance */}
          <Card className="p-6 border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 mb-1.5">Travel assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guidance on Medical Visas (MED-1), airport chauffeur transfers, local guest accommodations, and multilingual interpreter support.
              </p>
            </div>
          </Card>

          {/* 7. Journey tracking */}
          <Card className="p-6 border-slate-200 flex flex-col justify-between md:col-span-2 lg:col-span-2 bg-gradient-to-br from-slate-50 to-primary-50/40">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 mb-1.5">Journey tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monitor your end-to-end medical trip progress—from initial hospital assessment and visa clearance to hospital admission and discharge follow-up—in your personalized patient portal.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* ========================================================
          7. TRUST SECTION (FACTUAL & COMPLIANT)
         ======================================================== */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider block mb-1">
              Safety, Privacy & Integrity
            </span>
            <h2 className="text-3xl font-extrabold text-navy-950">
              Our Commitment to Trust
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Building international patient confidence through transparency and data protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Provider verification */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950">Provider verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every hospital and medical specialist listed on our platform is reviewed for clinical licensing, facility accreditations (NABH / JCI), and active medical standing.
              </p>
            </div>

            {/* 2. Secure document handling */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950">Secure document handling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your medical records, diagnostic scans, and personal identifiers are safeguarded with strict access controls and encrypted transmission protocols.
              </p>
            </div>

            {/* 3. Transparent estimated costs */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950">Transparent estimated costs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear estimated cost ranges for procedure planning. We clearly communicate that final hospital billing depends on in-person clinical diagnosis without hidden markups.
              </p>
            </div>

            {/* 4. Patient-centered journey */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950">Patient-centered journey</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our platform prioritizes patient well-being and autonomy. You retain total control over choosing your preferred hospital, doctor, and treatment schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. CALL TO ACTION: GET MEDICAL ASSISTANCE
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-primary-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-primary-500/20 text-primary-300 text-xs font-bold px-3 py-1 rounded-full border border-primary-500/30 inline-block">
              Free Guidance & Consultation Support
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Plan Your Medical Journey?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Connect with our international patient coordination team. Tell us your medical requirements and receive a comprehensive assessment with treatment options and realistic cost estimates within 24 hours.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/plan-journey">
                <Button variant="saffron" size="lg" className="font-bold">
                  Get Medical Assistance
                </Button>
              </Link>
              <Link to="/hospitals">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Explore Healthcare Network
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
