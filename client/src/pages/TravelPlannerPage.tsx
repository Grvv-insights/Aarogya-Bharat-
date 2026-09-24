import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchMyTravelPlan,
  saveTravelPlan
} from '../services/travelPlanService';
import { fetchHospitals } from '../services/hospitalService';
import { TravelPlan, Hospital } from '../types';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Plane,
  Building2,
  Calendar,
  Hotel,
  Car,
  FileText,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  ArrowDown,
  Save,
  HelpCircle,
  PhoneCall,
  Luggage,
  HeartPulse,
  Home
} from 'lucide-react';

const MEDICAL_CITIES = [
  'Delhi NCR',
  'Chennai',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Kolkata'
];

export const TravelPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Fields
  const [destinationCity, setDestinationCity] = useState('Delhi NCR');
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [arrivalDate, setArrivalDate] = useState('2026-10-08');
  const [departureDate, setDepartureDate] = useState('2026-10-22');
  const [accommodationType, setAccommodationType] = useState('hotel_4star');
  const [accommodationDetails, setAccommodationDetails] = useState(
    'Crowne Plaza Today Gurugram - Executive Suite with medical recliner and wheelchair support.'
  );
  const [airportPickup, setAirportPickup] = useState(true);
  const [transportDetails, setTransportDetails] = useState(
    'Private chauffeur pickup at DEL Terminal 3 Gate 5 directly to hospital suites.'
  );
  const [travelNotes, setTravelNotes] = useState(
    'Flight AI 102 (JFK to DEL). Companion: James Jenkins (husband). Requires wheelchair upon gate arrival.'
  );
  const [planStatus, setPlanStatus] = useState<'planning' | 'confirmed' | 'in_progress' | 'completed'>('confirmed');

  useEffect(() => {
    const initData = async () => {
      try {
        const [plan, allHospitals] = await Promise.all([
          fetchMyTravelPlan(),
          fetchHospitals()
        ]);

        setHospitals(allHospitals);

        if (plan) {
          if (plan.destinationCity) setDestinationCity(plan.destinationCity);
          if (plan.hospital) {
            const hId = typeof plan.hospital === 'object' ? plan.hospital._id : plan.hospital;
            setSelectedHospitalId(hId);
          } else if (allHospitals.length > 0) {
            setSelectedHospitalId(allHospitals[0]._id);
          }

          if (plan.arrivalDate) {
            setArrivalDate(new Date(plan.arrivalDate).toISOString().split('T')[0]);
          }
          if (plan.departureDate) {
            setDepartureDate(new Date(plan.departureDate).toISOString().split('T')[0]);
          }

          if (plan.accommodation) {
            if (plan.accommodation.type) setAccommodationType(plan.accommodation.type);
            if (plan.accommodation.details) setAccommodationDetails(plan.accommodation.details);
          }

          if (plan.transport) {
            setAirportPickup(!!plan.transport.airportPickup);
            if (plan.transport.details) setTransportDetails(plan.transport.details);
          }

          if (plan.notes) setTravelNotes(plan.notes);
          if (plan.status) setPlanStatus(plan.status);
        } else if (allHospitals.length > 0) {
          setSelectedHospitalId(allHospitals[0]._id);
        }
      } catch (err) {
        console.error('Failed to load travel planner data:', err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setAlertMsg(null);

    try {
      await saveTravelPlan({
        destinationCity,
        hospital: selectedHospitalId as any,
        arrivalDate: new Date(arrivalDate).toISOString(),
        departureDate: new Date(departureDate).toISOString(),
        accommodation: {
          type: accommodationType,
          details: accommodationDetails
        },
        transport: {
          airportPickup,
          details: transportDetails
        },
        notes: travelNotes,
        status: planStatus
      });

      setAlertMsg({
        type: 'success',
        text: 'Medical travel plan successfully saved and synced with your patient dashboard!'
      });
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: (err as Error).message || 'Failed to update travel plan'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage label="Loading your personalized medical travel planner..." />;
  }

  // 7 STAGE JOURNEY TIMELINE
  const journeyStages = [
    {
      id: 1,
      title: 'Travel Preparation',
      icon: <Luggage className="w-5 h-5 text-primary-600" />,
      status: 'completed',
      tag: 'Completed',
      desc: 'Indian Medical Visa (MED-1) invitation issued by hospital and approved by MEA. Flights booked on Air India AI 102.'
    },
    {
      id: 2,
      title: 'Arrival in India',
      icon: <Plane className="w-5 h-5 text-primary-600" />,
      status: 'active',
      tag: arrivalDate || 'Oct 08, 2026',
      desc: `Scheduled arrival at ${destinationCity} International Airport. Priority fast-track medical immigration processing.`
    },
    {
      id: 3,
      title: 'Transfer to accommodation',
      icon: <Car className="w-5 h-5 text-primary-600" />,
      status: 'pending',
      tag: 'Airport Chauffeur',
      desc: transportDetails || 'Private chauffeur pickup with luggage assistance directly to recovery lodging.'
    },
    {
      id: 4,
      title: 'Hospital visit',
      icon: <Building2 className="w-5 h-5 text-primary-600" />,
      status: 'pending',
      tag: 'Admission Day',
      desc: 'Arrival at hospital international lounge, senior surgeon pre-operative physical examination and imaging workup.'
    },
    {
      id: 5,
      title: 'Treatment',
      icon: <HeartPulse className="w-5 h-5 text-primary-600" />,
      status: 'pending',
      tag: 'Clinical Procedure',
      desc: 'Surgical procedure performed in JCI-accredited robotic operating theater under specialized surgical team.'
    },
    {
      id: 6,
      title: 'Recovery',
      icon: <Hotel className="w-5 h-5 text-primary-600" />,
      status: 'pending',
      tag: 'Inpatient & Hotel',
      desc: 'Post-operative recovery in wheelchair-accessible hotel/suite with daily nurse visits and rehabilitation.'
    },
    {
      id: 7,
      title: 'Return / Follow-up',
      icon: <Home className="w-5 h-5 text-primary-600" />,
      status: 'pending',
      tag: departureDate || 'Oct 22, 2026',
      desc: 'Surgeon Fit-to-Fly medical certificate, airport departure transfer, and scheduled remote telemedicine checkups.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. BREADCRUMB & HEADER */}
      <div className="space-y-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Patient Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-navy-950 via-primary-950 to-navy-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-5 h-5 text-saffron-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-300">
                Medical Value Travel Concierge
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Medical Travel Planner
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Organize your clinical journey to India. Manage flights, arrival escorts, hotel lodging, and surgical schedules in one synchronized itinerary.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="saffron" size="md">
              {planStatus.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {alertMsg && (
        <Alert
          type={alertMsg.type}
          onClose={() => setAlertMsg(null)}
        >
          {alertMsg.text}
        </Alert>
      )}

      {/* 2. OFFICIAL TRAVEL & VISA DISCLAIMER */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4.5 text-xs text-slate-700 flex items-start gap-3 shadow-xs">
        <HelpCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-navy-950">
            Important Travel & Medical Visa Advisory:
          </p>
          <p className="text-[11px] leading-relaxed text-slate-600">
            All visa durations, transit rules, and entry guidelines provided on this platform are for general informational orientation only. Government of India policies are subject to change. International travelers must verify the latest formal e-Medical Visa (MED & MED-X) requirements via the official Indian Visa Portal (<strong>indianvisaonline.gov.in</strong>) and the Ministry of External Affairs prior to ticket booking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): 7-Stage Journey Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200/90 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-primary-600" />
                  Your 7-Stage Medical Journey Roadmap
                </h3>
                <p className="text-xs text-slate-500">
                  Sequential stages from departure preparation to clinical procedure and safe return.
                </p>
              </div>
              <Badge variant="primary">7 Stages</Badge>
            </CardHeader>

            <CardBody className="p-6">
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {journeyStages.map((stage, idx) => {
                  const isCompleted = stage.status === 'completed';
                  const isActive = stage.status === 'active';

                  return (
                    <div key={stage.id} className="relative group">
                      {/* Timeline Node Icon */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-1 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : isActive
                            ? 'bg-primary-600 text-white ring-4 ring-primary-100 animate-pulse'
                            : 'bg-slate-100 text-slate-500 border border-slate-300'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stage.id}
                      </div>

                      {/* Content Box */}
                      <div
                        className={`p-4 rounded-2xl border transition-all ${
                          isCompleted
                            ? 'bg-emerald-50/50 border-emerald-200/80'
                            : isActive
                            ? 'bg-primary-50/70 border-primary-300 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                          <h4 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                            {stage.icon}
                            {stage.title}
                          </h4>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : isActive
                                ? 'bg-primary-100 text-primary-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {stage.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {stage.desc}
                        </p>
                      </div>

                      {idx < journeyStages.length - 1 && (
                        <div className="flex justify-center -mb-2 mt-1">
                          <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column (5 cols): Travel Plan Configuration Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200/90 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-primary-600" />
                  Trip Itinerary Settings
                </h3>
                <p className="text-xs text-slate-500">
                  Update dates, lodging, and transport preferences.
                </p>
              </div>
            </CardHeader>

            <CardBody className="p-6">
              <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
                {/* Destination City */}
                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1.5">
                    Destination City
                  </label>
                  <select
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                  >
                    {MEDICAL_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hospital Selection */}
                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1.5">
                    Treating Hospital Partner
                  </label>
                  <select
                    value={selectedHospitalId}
                    onChange={(e) => setSelectedHospitalId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                  >
                    {hospitals.map((hosp) => (
                      <option key={hosp._id} value={hosp._id}>
                        {hosp.name} ({hosp.city})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Arrival in India"
                    type="date"
                    required
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                  />
                  <Input
                    label="Departure / Return"
                    type="date"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                  />
                </div>

                {/* Accommodation */}
                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1.5">
                    Accommodation Type
                  </label>
                  <select
                    value={accommodationType}
                    onChange={(e) => setAccommodationType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                  >
                    <option value="hotel_4star">4-Star Partner Hotel (Wheelchair Accessible)</option>
                    <option value="hotel_5star">5-Star Luxury Resort / Business Suite</option>
                    <option value="hotel_3star">3-Star Standard Hotel (Budget Friendly)</option>
                    <option value="serviced_apartment">Serviced Apartment (Kitchenette Included)</option>
                    <option value="hospital_guest_house">Hospital In-House International Guest House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1.5">
                    Accommodation Booking Details
                  </label>
                  <textarea
                    rows={2}
                    value={accommodationDetails}
                    onChange={(e) => setAccommodationDetails(e.target.value)}
                    placeholder="Hotel name, room type, or patient accessibility requests..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Transport */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-navy-950">
                      Airport Chauffeur & VIP Transfer
                    </label>
                    <input
                      type="checkbox"
                      checked={airportPickup}
                      onChange={(e) => setAirportPickup(e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                    />
                  </div>
                  <Input
                    label="Pickup Location & Escort Instructions"
                    type="text"
                    value={transportDetails}
                    onChange={(e) => setTransportDetails(e.target.value)}
                    placeholder="Terminal number, gate, or flight number..."
                  />
                </div>

                {/* Travel Notes */}
                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1.5">
                    Flight, Visa & Companion Notes
                  </label>
                  <textarea
                    rows={2}
                    value={travelNotes}
                    onChange={(e) => setTravelNotes(e.target.value)}
                    placeholder="Airline flight details, accompanying family members, dietary requests..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1.5">
                    Plan Status
                  </label>
                  <select
                    value={planStatus}
                    onChange={(e) => setPlanStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                  >
                    <option value="planning">Planning (Draft Itinerary)</option>
                    <option value="confirmed">Confirmed (Visa & Flight Verified)</option>
                    <option value="in_progress">In Progress (Patient in India)</option>
                    <option value="completed">Completed (Post-op Return)</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={saving}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="w-full font-semibold justify-center shadow-xs"
                >
                  Save & Update Medical Travel Plan
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TravelPlannerPage;
