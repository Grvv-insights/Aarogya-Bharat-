import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCities } from '../services/cityService';
import { CitySummary } from '../types';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  MapPin,
  Building2,
  Stethoscope,
  Plane,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const FALLBACK_CITIES: CitySummary[] = [
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

export const MedicalCitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState<CitySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await fetchCities();
        if (data && data.length > 0) {
          setCities(data);
        } else {
          setCities(FALLBACK_CITIES);
        }
      } catch (err) {
        console.error('Failed to load cities:', err);
        setCities(FALLBACK_CITIES);
      } finally {
        setLoading(false);
      }
    };
    loadCities();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">
          <MapPin className="w-4 h-4" /> Healthcare Destinations Across India
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Medical Cities in India
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
          India offers multiple specialized medical destinations, each with its own clinical concentrations, accredited quaternary healthcare networks, international airport connections, and patient accommodation options.
        </p>
      </div>

      {/* Info Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3">
          <Plane className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
          <div className="text-xs text-slate-600">
            <h4 className="font-bold text-navy-950 text-sm">International Connectivity</h4>
            <p className="mt-0.5">Direct international flights operate to New Delhi (DEL), Mumbai (BOM), Chennai (MAA), and Bengaluru (BLR).</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
          <div className="text-xs text-slate-600">
            <h4 className="font-bold text-navy-950 text-sm">Accredited Standards</h4>
            <p className="mt-0.5">Hospitals in these cities hold JCI and NABH accreditations, ensuring patient safety and rigorous quality controls.</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3">
          <Building2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div className="text-xs text-slate-600">
            <h4 className="font-bold text-navy-950 text-sm">Dedicated International Lounges</h4>
            <p className="mt-0.5">Major healthcare centers feature dedicated desks assisting with visas, currency exchange, and language translation.</p>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" label="Loading healthcare destinations..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((city) => (
            <Card key={city.name} hover className="flex flex-col justify-between border-slate-200 overflow-hidden shadow-xs">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent"></div>
                <div className="absolute top-3 left-3 bg-navy-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                  {city.state}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-bold text-saffron-300 uppercase tracking-wider block">
                    {city.tagline}
                  </span>
                  <h3 className="text-2xl font-bold">{city.name}</h3>
                </div>
              </div>

              <CardBody className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {city.description}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Key Clinical Focus:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {city.topSpecialties.map((spec) => (
                        <span
                          key={spec}
                          className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/cities/${encodeURIComponent(city.name)}`)}
                    className="text-xs"
                  >
                    City Guide
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/hospitals?city=${encodeURIComponent(city.name)}`)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Hospitals
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
