import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Plane,
  FileText,
  Building,
  Languages,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Clock,
  Compass,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const TravelAssistancePage: React.FC = () => {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    country: '',
    city: 'Delhi NCR',
    servicesNeeded: [] as string[],
    contactEmail: '',
    notes: ''
  });

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => {
      const exists = prev.servicesNeeded.includes(service);
      return {
        ...prev,
        servicesNeeded: exists
          ? prev.servicesNeeded.filter((s) => s !== service)
          : [...prev.servicesNeeded, service]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const travelServices = [
    {
      title: 'Medical Visa (MED-1) Assistance',
      icon: FileText,
      description: 'We assist with obtaining official hospital invitation letters required for Indian Medical Visas (MED-1 for patients, MED-2 for companions).',
      points: [
        'Hospital letter issued within 24-48 business hours',
        'Guidance on embassy/e-Medical Visa portal filing',
        'Valid for up to 3 medical companions'
      ]
    },
    {
      title: 'Airport Concierge & Transfers',
      icon: Plane,
      description: 'Seamless arrival at international airports in Delhi, Mumbai, Chennai, Bengaluru, Hyderabad, and Kolkata.',
      points: [
        'Meet-and-greet at the arrival terminal',
        'Private sanitized sedan or medical ambulance transfer',
        'Luggage assistance directly to hospital or hotel'
      ]
    },
    {
      title: 'Companion Lodging & Accommodations',
      icon: Building,
      description: 'Verified accommodation partnerships located within 1-5 kilometers of your hospital center.',
      points: [
        'Furnished serviced apartments with kitchenettes',
        '3-star, 4-star, and 5-star hotel options at negotiated patient rates',
        'Flexible checkout depending on clinical recovery duration'
      ]
    },
    {
      title: 'Dedicated Language Interpreters',
      icon: Languages,
      description: 'Professional interpreters to bridge communication between patients, families, and attending doctors.',
      points: [
        'Arabic, Russian, French, and African language specialists',
        'Bedside translation during doctor rounds and procedures',
        'Medical report and discharge summary translation'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">
          <Plane className="w-4 h-4" /> Travel & Logistics Coordination
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Medical Travel Assistance
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
          We coordinate all non-clinical aspects of your medical trip to India. From visa invitation paperwork and airport reception to accommodations and bedside interpretation, your trip is organized with care.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {travelServices.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.title} className="p-6 border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-950 mb-2">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {service.description}
                </p>

                <ul className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
                  {service.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Interactive Travel Assistance Request Form */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-8 sm:p-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
              Travel Coordination Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Request Travel Assistance
            </h2>
            <p className="text-xs text-slate-500">
              Tell our logistics team what assistance you need for your upcoming medical journey to India.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">
                Assistance Request Received!
              </h4>
              <p className="text-xs text-emerald-800">
                Our international patient concierge desk will review your requirements and reach out to <strong>{formData.contactEmail}</strong> within 12 hours with travel details.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormSubmitted(false);
                  navigate('/plan-journey');
                }}
              >
                Go to Full Journey Planner
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient / Companion Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="e.g. John Miller"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country of Residence *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. United Kingdom"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination City in India
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 bg-white"
                  >
                    <option value="Delhi NCR">Delhi NCR (New Delhi & Gurugram)</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Email or WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="john@example.com or +1 555-0123"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Assistance Needed:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Medical Visa Invitation Letter',
                    'Airport Chauffeur Transfer',
                    'Hotel / Serviced Apartment Booking',
                    'Language Interpreter (Bedside)',
                    'Local SIM Card & Currency Exchange Guidance',
                    'Wheelchair & Ambulatory Transfer'
                  ].map((service) => (
                    <label
                      key={service}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.servicesNeeded.includes(service)}
                        onChange={() => handleCheckboxChange(service)}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      <span className="text-slate-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Notes or Questions
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Tell us about your estimated travel dates, number of companions, or special medical needs..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 bg-white"
                />
              </div>

              <Button type="submit" variant="saffron" size="lg" className="w-full font-bold">
                Submit Travel Assistance Request
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
