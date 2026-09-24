import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchHospitals } from '../services/hospitalService';
import { Hospital } from '../types';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  MapPin,
  Building2,
  Plane,
  Hotel,
  Stethoscope,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Star,
  Car,
  Compass,
  HelpCircle,
  FileCheck,
  Calendar,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface CityContent {
  name: string;
  state: string;
  tagline: string;
  heroImage: string;
  healthcareOverview: string;
  clinicalStrengths: string[];
  airportInfo: {
    name: string;
    code: string;
    terminals: string;
    assistance: string;
    transferOptions: string[];
  };
  travelInfo: {
    bestTimeToTravel: string;
    climate: string;
    languages: string[];
    localTips: string;
  };
  accommodationInfo: {
    types: string[];
    description: string;
    areas: string[];
  };
}

const CITY_DATABASE: Record<string, CityContent> = {
  'delhi-ncr': {
    name: 'Delhi NCR',
    state: 'National Capital Region & Haryana',
    tagline: 'Quaternary Healthcare & Advanced Robotics Hub',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    healthcareOverview:
      'Delhi National Capital Region (including Gurugram and New Delhi) represents the largest concentration of accredited quaternary healthcare campuses in Northern India. The region features internationally renowned hospital networks equipped with CyberKnife robotic radiosurgery, Da Vinci Xi robotic surgery platforms, and high-volume living-donor organ transplant centers.',
    clinicalStrengths: [
      'Cardiology & Robotic Cardiac Bypass',
      'Orthopedics & Computer-Navigated Arthroplasty',
      'Bone Marrow & Stem Cell Transplantation',
      'Complex Neurosciences & Spine Surgery',
      'Medical & Surgical Oncology'
    ],
    airportInfo: {
      name: 'Indira Gandhi International Airport',
      code: 'DEL',
      terminals: 'Terminal 3 (Dedicated International Arrival Wing)',
      assistance: 'Dedicated International Patient Lounge & E-Medical Visa assistance desk at Terminal 3 Gate 5.',
      transferOptions: [
        'Pre-arranged Hospital Chauffeur VIP Escorts',
        'Delhi Traffic Police Pre-Paid Taxi Kiosks inside Arrivals',
        'Airport Express High-Speed Metro direct to New Delhi Station'
      ]
    },
    travelInfo: {
      bestTimeToTravel: 'October to March (Pleasant, mild temperatures ideal for post-operative recovery)',
      climate: 'Continental climate with warm summers and mild, cool winters.',
      languages: ['English', 'Hindi', 'Arabic (translators available at all hospitals)', 'Russian'],
      localTips: 'Hospital concierge desks provide local 4G/5G SIM card registration and currency exchange counters inside the patient lounge.'
    },
    accommodationInfo: {
      types: [
        'Hospital In-House International Guest Suites',
        '4-Star & 5-Star Recovery Hotels with Wheelchair Access',
        'Serviced Long-Stay Apartments with Private Kitchenettes'
      ],
      description:
        'A comprehensive lodging ecosystem operates around hospital hubs like Gurugram Sector 38/44 and Saket. Accommodations cater specifically to international medical travelers with private chef dietary options, step-free wheelchair access, and medical recliner beds.',
      areas: ['Gurugram Sector 38 (Near Medanta)', 'Gurugram Sector 44 (Near FMRI)', 'South Delhi Saket (Near Max Super Speciality)']
    }
  },
  'chennai': {
    name: 'Chennai',
    state: 'Tamil Nadu',
    tagline: 'Cardiovascular Excellence & Organ Transplantation Capital',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    healthcareOverview:
      'Chennai is widely celebrated as the healthcare capital of South India, having pioneered modern private healthcare infrastructure in the 1980s. The city maintains the highest surgical success rates for pediatric cardiac surgery, adult heart transplantation, living-donor liver transplantation, and corneal grafting.',
    clinicalStrengths: [
      'Adult & Pediatric Cardiac Surgery',
      'Living-Donor Liver & Kidney Transplantation',
      'Orthopedic Joint Replacement',
      'Advanced Ophthalmology & Retinal Care',
      'Radiation Oncology & Proton Therapy'
    ],
    airportInfo: {
      name: 'Chennai International Airport',
      code: 'MAA',
      terminals: 'Terminal 2 (Integrated International Terminal)',
      assistance: 'Dedicated hospital representative counters located in the main arrival foyer.',
      transferOptions: [
        'Hospital Chauffeur Air-Conditioned Transfers',
        'Chennai Airport Metro Rail connecting directly to Central Chennai',
        'Aviation Pre-Paid Taxi Booths'
      ]
    },
    travelInfo: {
      bestTimeToTravel: 'November to February (Cooler coastal weather, moderate humidity)',
      climate: 'Tropical coastal climate; pleasant sea breezes throughout the winter months.',
      languages: ['English (fluent and standard in clinical settings)', 'Tamil', 'Arabic', 'French'],
      localTips: 'International patients benefit from Apollo Greams Road and nearby medical facilities with integrated halal dietary choices and multilingual Arabic coordinators.'
    },
    accommodationInfo: {
      types: [
        'Accredited Medical Guest Houses on Greams Road',
        'Serviced Coastal Apartments in Nungambakkam',
        'Star-Rated Business & Leisure Recovery Hotels'
      ],
      description:
        'High-density specialized recovery apartments cluster around Greams Road, Thousand Lights, and Egmore. These units include daily housekeeping, companion bedrooms, and induction cooktops for customized diets.',
      areas: ['Greams Road, Thousand Lights', 'Nungambakkam', 'Alwarpet']
    }
  },
  'mumbai': {
    name: 'Mumbai',
    state: 'Maharashtra',
    tagline: 'Tertiary Quaternary Healthcare & Aesthetic Reconstruction Hub',
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    healthcareOverview:
      'Mumbai is Western India’s premier financial and quaternary medical capital. Renowned for comprehensive tertiary cancer care, precision robotic spine reconstruction, aesthetic surgeries, and minimally invasive cardiac catheterization.',
    clinicalStrengths: [
      'Comprehensive Surgical & Medical Oncology',
      'Robotic Neurosurgery & Deep Brain Stimulation',
      'Cosmetic & Reconstructive Plastic Surgery',
      'Interventional Cardiology & TAVR',
      'Bariatric & Metabolic Surgeries'
    ],
    airportInfo: {
      name: 'Chhatrapati Shivaji Maharaj International Airport',
      code: 'BOM',
      terminals: 'Terminal 2 (World-Class Architectural International Hub)',
      assistance: 'Hospital guest reception services coordinated via Terminal 2 Arrival Hall VIP lounge.',
      transferOptions: [
        'Private Chauffeur Airport Pickup',
        'Prepaid AC Taxis (Meru / Cool Cabs)',
        'Western Express Highway connection direct to Western Suburbs hospitals'
      ]
    },
    travelInfo: {
      bestTimeToTravel: 'November to February (Mild, dry, and comfortable)',
      climate: 'Tropical coastal climate with monsoon season from June to September.',
      languages: ['English', 'Hindi', 'Marathi', 'Arabic', 'Gujarati'],
      localTips: 'Major private hospitals like Kokilaben and PD Hinduja feature full foreign currency exchange kiosks and embassy coordination desks.'
    },
    accommodationInfo: {
      types: [
        'Luxury Hotel Suites in Andheri & Bandra',
        'Hospital Assisted Living Guest Suites',
        'Extended-Stay Serviced Studio Apartments'
      ],
      description:
        'Accommodations range from upscale business hotels along the Western Express corridor to serene recovery apartments in Bandra West and Andheri West.',
      areas: ['Andheri West (Near Kokilaben)', 'Bandra West (Near Lilavati)', 'Mahim & South Mumbai']
    }
  },
  'bengaluru': {
    name: 'Bengaluru',
    state: 'Karnataka',
    tagline: 'Healthcare Innovation, IVF & Spine Robotics Center',
    heroImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    healthcareOverview:
      'Bengaluru pairs India’s premier bio-technology and tech ecosystem with cutting-edge medical care. The city is a top global destination for high-success in vitro fertilization (IVF), pediatric congenital heart surgery, and spinal disc replacement.',
    clinicalStrengths: [
      'Reproductive Medicine & Advanced IVF Cleanrooms',
      'Pediatric & Congenital Cardiac Surgery',
      'Complex Spine & Joint Reconstruction',
      'Neurology & Epilepsy Surgery',
      'Organ Transplantation'
    ],
    airportInfo: {
      name: 'Kempegowda International Airport',
      code: 'BLR',
      terminals: 'Terminal 2 (Award-Winning Garden Terminal)',
      assistance: 'International traveler assistance counters located at Terminal 2 exit.',
      transferOptions: [
        'Pre-arranged Hospital Transfers',
        'Vayu Vajra Air-Conditioned Airport Shuttle Bus to all hospital zones',
        'Prepaid Airport Taxis'
      ]
    },
    travelInfo: {
      bestTimeToTravel: 'Year-round (Moderate, pleasant plateau climate)',
      climate: 'Subtropical highland climate with moderate temperatures throughout the year.',
      languages: ['English', 'Kannada', 'Hindi', 'Tamil', 'Telugu'],
      localTips: 'Known for its lush gardens and tree-lined avenues, providing a calm atmosphere for patient convalescence.'
    },
    accommodationInfo: {
      types: [
        'Serviced Boutique Apartments in Whitefield & Indiranagar',
        'Hospital Convalescence Centers in Bannerghatta',
        'International Chain Recovery Suites'
      ],
      description:
        'Long-term serviced suites with kitchens and laundry are widely available near major medical campuses like Manipal, Narayana Health City, and Fortis Bannerghatta.',
      areas: ['Bannerghatta Road', 'Old Airport Road', 'Whitefield']
    }
  },
  'hyderabad': {
    name: 'Hyderabad',
    state: 'Telangana',
    tagline: 'Transplantation Hub & Minimally Invasive Excellence',
    heroImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80',
    healthcareOverview:
      'Hyderabad is a prominent hub for living-donor organ transplants, robotic knee replacements, gastroenterology, and oncology. Medical facilities in HITEC City and Banjara Hills are built to international campus standards with expansive recovery wings.',
    clinicalStrengths: [
      'Liver & Multi-Organ Transplants',
      'Robotic Orthopedic Arthroplasty',
      'Medical & Surgical Gastroenterology',
      'Radiation Oncology (TrueBeam & Novalis Tx)',
      'Interventional Cardiology'
    ],
    airportInfo: {
      name: 'Rajiv Gandhi International Airport',
      code: 'HYD',
      terminals: 'Main Integrated International Terminal',
      assistance: 'Dedicated Medical Tourism Reception desk located in the arrival concourse.',
      transferOptions: [
        'Hospital Chauffeur VIP Transfers',
        'PVNR Elevated Expressway direct to Banjara Hills (30-40 min)',
        'Prepaid Radio Cabs'
      ]
    },
    travelInfo: {
      bestTimeToTravel: 'October to March (Mild, pleasant, low humidity)',
      climate: 'Semi-arid climate with warm dry winters and comfortable evenings.',
      languages: ['English', 'Telugu', 'Urdu', 'Hindi', 'Arabic'],
      localTips: 'Very high availability of Arabic-speaking patient coordinators and certified halal patient dining.'
    },
    accommodationInfo: {
      types: [
        'Serviced Patient Guest Apartments in Banjara Hills',
        'HITEC City Luxury Medical Recovery Suites',
        'Hospital-Affiliated Convalescent Rooms'
      ],
      description:
        'Peaceful residential neighborhoods in Banjara Hills and Jubilee Hills offer spacious multi-bedroom apartments for international families during extended transplant recovery.',
      areas: ['Banjara Hills', 'Jubilee Hills', 'HITEC City / Gachibowli']
    }
  },
  'kolkata': {
    name: 'Kolkata',
    state: 'West Bengal',
    tagline: 'Eastern India Referral Capital & Tertiary Oncology Hub',
    heroImage: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',
    healthcareOverview:
      'Kolkata serves as the primary medical value travel hub for Eastern India and neighboring international regions like Bangladesh, Nepal, Bhutan, and Southeast Asia. The city offers quaternary cardiac care, comprehensive oncology, and gastrointestinal surgery at affordable costs.',
    clinicalStrengths: [
      'Tertiary Cardiac Surgery & Angioplasty',
      'Comprehensive Cancer Treatment & Bone Marrow Transplants',
      'Minimally Invasive Gastroenterology',
      'Advanced Nephrology & Dialysis',
      'General & Laparoscopic Surgery'
    ],
    airportInfo: {
      name: 'Netaji Subhash Chandra Bose International Airport',
      code: 'CCU',
      terminals: 'Integrated Domestic & International Terminal',
      assistance: 'Medical assistance counter available at Gate 4 Arrival Area.',
      transferOptions: [
        'Hospital Chauffeur Transfers',
        'Pre-Paid Yellow / Radio Cabs',
        'EM Bypass Highway connecting to Salt Lake and Mukundapur medical hubs'
      ]
    },
    travelInfo: {
      bestTimeToTravel: 'November to February (Cool, pleasant, dry winter season)',
      climate: 'Tropical wet-and-dry climate with pleasant winters.',
      languages: ['English', 'Bengali', 'Hindi'],
      localTips: 'The Mukundapur and EM Bypass healthcare corridors feature high concentrations of accredited private hospital networks within 20 minutes of one another.'
    },
    accommodationInfo: {
      types: [
        'Medical Guest Houses along EM Bypass',
        'Serviced Apartments in Salt Lake Sector V',
        'Budget-Friendly Recovery Lodging'
      ],
      description:
        'Cost-effective guesthouses and apartments line the Eastern Metropolitan Bypass, offering quiet rooms and self-catering kitchenettes for long-term patient stays.',
      areas: ['Mukundapur (Healthcare Hub)', 'Salt Lake City', 'Alipore']
    }
  }
};

export const CityDetailPage: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  // Normalize slug/name
  const normalizedKey = (cityName || 'delhi-ncr')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

  const cityData = CITY_DATABASE[normalizedKey] || CITY_DATABASE['delhi-ncr'];

  useEffect(() => {
    const loadCityHospitals = async () => {
      setLoading(true);
      try {
        const cityHospitals = await fetchHospitals({
          city: cityData.name,
          verificationStatus: 'verified'
        });
        setHospitals(cityHospitals);
      } catch (err) {
        console.error('Failed to load city hospitals:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCityHospitals();
  }, [cityData.name]);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO BANNER */}
      <div className="relative min-h-[420px] flex items-center justify-center overflow-hidden">
        <img
          src={cityData.heroImage}
          alt={cityData.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-white space-y-4">
          <Link
            to="/cities"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> All Medical Destinations
          </Link>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="saffron" size="md">
                {cityData.tagline}
              </Badge>
              <span className="text-xs text-slate-300 font-medium">
                {cityData.state}, India
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Healthcare & Travel Guide: {cityData.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">
              {cityData.healthcareOverview}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 2. OFFICIAL TRAVEL & VISA DISCLAIMER (PROMINENT ADVISORY) */}
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-3xl p-6 text-xs text-amber-950 flex flex-col sm:flex-row items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-amber-900">
              Government Regulatory & Medical Visa Advisory Notice
            </h3>
            <p className="text-[11px] text-amber-900/90 leading-relaxed">
              All travel guidelines, local transit timings, and international visa protocols described on this portal are compiled for general educational orientation and patient travel coordination. <strong>They do not constitute legal or immigration advice.</strong> International patients must verify their official Indian e-Medical Visa eligibility, invitation letter criteria, and latest health declarations directly through the authorized Government of India portal at <strong>indianvisaonline.gov.in</strong> and their regional Indian Embassy or High Commission prior to airfare booking.
            </p>
          </div>
        </div>

        {/* 3. FOUR CORE CITY GUIDES: HEALTHCARE, AIRPORT, TRAVEL, ACCOMMODATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Healthcare Overview Card */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="bg-slate-50/70 border-b border-slate-200/80">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary-600" />
                Key Clinical Specialties & Surgery Strengths
              </h3>
            </CardHeader>
            <CardBody className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Hospitals in {cityData.name} maintain internationally benchmarked surgical suites with JCI and NABH quality accreditations:
              </p>
              <ul className="space-y-2">
                {cityData.clinicalStrengths.map((strength, i) => (
                  <li key={i} className="flex items-center gap-2 font-medium text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-slate-500 text-[11px]">
                Language support available: {cityData.travelInfo.languages.join(' • ')}
              </div>
            </CardBody>
          </Card>

          {/* Airport & Local Transit Card */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="bg-slate-50/70 border-b border-slate-200/80">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Plane className="w-5 h-5 text-primary-600" />
                Airport & Patient Transit Information
              </h3>
            </CardHeader>
            <CardBody className="p-6 space-y-3.5 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  International Airport
                </span>
                <span className="text-sm font-bold text-navy-950 block mt-0.5">
                  {cityData.airportInfo.name} ({cityData.airportInfo.code})
                </span>
                <span className="text-slate-500">{cityData.airportInfo.terminals}</span>
              </div>

              <div className="p-3 rounded-xl bg-primary-50/60 border border-primary-100 text-primary-950">
                <strong className="block mb-0.5">Arrival Assistance:</strong>
                {cityData.airportInfo.assistance}
              </div>

              <div className="space-y-1.5">
                <strong className="text-slate-700 block text-[11px] uppercase">
                  Available Airport Transfers:
                </strong>
                <ul className="space-y-1 text-slate-600">
                  {cityData.airportInfo.transferOptions.map((opt, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>
          </Card>

          {/* Travel & Climate Information Card */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="bg-slate-50/70 border-b border-slate-200/80">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary-600" />
                Travel & Climate Advisory
              </h3>
            </CardHeader>
            <CardBody className="p-6 space-y-3 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Optimal Months for Medical Travel
                </span>
                <span className="text-xs font-semibold text-navy-950 block mt-0.5">
                  {cityData.travelInfo.bestTimeToTravel}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Climate Profile
                </span>
                <span className="text-slate-600 block mt-0.5">
                  {cityData.travelInfo.climate}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                <strong className="block text-navy-950 mb-0.5">Patient Liaison Tip:</strong>
                {cityData.travelInfo.localTips}
              </div>
            </CardBody>
          </Card>

          {/* Patient Accommodation Card */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="bg-slate-50/70 border-b border-slate-200/80">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Hotel className="w-5 h-5 text-primary-600" />
                Accommodation & Recovery Lodging
              </h3>
            </CardHeader>
            <CardBody className="p-6 space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                {cityData.accommodationInfo.description}
              </p>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Lodging Options:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cityData.accommodationInfo.types.map((type, i) => (
                    <Badge key={i} variant="primary" size="sm">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Primary Medical Hotel Clusters:
                </span>
                <p className="text-slate-600 font-medium">
                  {cityData.accommodationInfo.areas.join(' • ')}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 4. ACCREDITED HOSPITALS IN THIS CITY */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-2xl font-bold text-navy-950">
                Accredited Hospitals in {cityData.name}
              </h2>
              <p className="text-xs text-slate-500">
                JCI & NABH accredited partner centers providing direct international patient services.
              </p>
            </div>
            <Link to={`/hospitals?city=${encodeURIComponent(cityData.name)}`}>
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Filter All in {cityData.name}
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner label={`Loading hospitals in ${cityData.name}...`} />
            </div>
          ) : hospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hosp) => (
                <Card key={hosp._id} hover className="border-slate-200 overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={hosp.image}
                        alt={hosp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-1">
                        {(hosp.accreditation || []).map((acc) => (
                          <Badge key={acc} variant="primary" size="sm">
                            {acc}
                          </Badge>
                        ))}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/95 text-navy-950 px-2 py-0.5 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {hosp.rating}
                      </div>
                    </div>

                    <CardBody className="p-5 space-y-3">
                      <div>
                        <h4 className="text-base font-bold text-navy-950 line-clamp-1">
                          {hosp.name}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-primary-600" />
                          {hosp.city}, {hosp.state}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {hosp.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {(hosp.specialties || []).slice(0, 3).map((spec) => (
                          <span
                            key={spec}
                            className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </CardBody>
                  </div>

                  <div className="p-5 pt-0 flex items-center gap-2">
                    <Link to={`/hospitals/${hosp._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        View Center
                      </Button>
                    </Link>
                    <Link to="/consultation" className="flex-1">
                      <Button variant="primary" size="sm" className="w-full text-xs">
                        Inquire
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No hospitals loaded for this destination.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityDetailPage;
