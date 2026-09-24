import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchTreatmentBySlug } from '../services/treatmentService';
import { Treatment, Hospital, Doctor } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Stethoscope,
  Clock,
  Calendar,
  Building2,
  UserCheck,
  ShieldCheck,
  TrendingDown,
  Info,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Star,
  MapPin,
  HeartPulse,
  Activity,
  AlertTriangle
} from 'lucide-react';

export const TreatmentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTreatment = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await fetchTreatmentBySlug(slug);
        setTreatment(data);
      } catch (err) {
        console.error('Failed to load treatment details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTreatment();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner fullPage label="Loading procedure information and accredited centers..." />;
  }

  if (!treatment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-navy-950 mb-3">Treatment Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The requested treatment could not be located in our directory.</p>
        <Link to="/treatments">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Treatments Directory
          </Button>
        </Link>
      </div>
    );
  }

  const formatUSD = (val: number) => `$${val.toLocaleString()}`;

  const usaCost = treatment.estimatedCostRange?.usaComparisonUSD || treatment.usaComparisonCostUSD || 100000;
  const ukCost = treatment.estimatedCostRange?.ukComparisonUSD || treatment.ukComparisonCostUSD || 35000;
  const minCost = treatment.estimatedCostRange?.minUSD || treatment.avgCostUSD || 6000;
  const maxCost = treatment.estimatedCostRange?.maxUSD || Math.round(minCost * 1.35);

  const relatedHospitals = (treatment.relatedHospitals || []) as Hospital[];
  const relatedDoctors = (treatment.relatedDoctors || []) as Doctor[];

  return (
    <div className="pb-24 space-y-12">
      {/* Hero Header */}
      <div className="bg-navy-950 text-white pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/treatments"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Treatments Directory
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-primary-500/20 text-primary-300 border border-primary-400/30 text-xs font-bold px-2.5 py-1 rounded">
                  {treatment.category}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Save {treatment.savingsPercentage}% vs USA
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                {treatment.name}
              </h1>

              <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
                {treatment.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary-400" />
                  <span>Duration: <strong>{treatment.estimatedDuration || '2 - 4 hours'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary-400" />
                  <span>Clinical Success Rate: <strong>{treatment.successRate || 98}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-primary-400" />
                  <span>JCI / NABH Accredited Centers</span>
                </div>
              </div>
            </div>

            {/* Sticky Action Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl p-6 text-navy-950 shadow-2xl space-y-4 border border-slate-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-700">
                    Estimated Cost Range in India
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
                    {formatUSD(minCost)} – {formatUSD(maxCost)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Compare with {formatUSD(usaCost)} in the US (saves up to {treatment.savingsPercentage}%)
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Button
                    variant="saffron"
                    size="lg"
                    className="w-full font-bold shadow-md"
                    onClick={() => navigate(`/plan-journey?treatment=${treatment._id}&treatmentName=${encodeURIComponent(treatment.name)}`)}
                  >
                    Request Consultation
                  </Button>
                </div>

                <p className="text-[11px] text-slate-400 text-center italic">
                  *Demo estimate for planning. Final quotes depend on medical evaluation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* General / Demo Information Notice */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <strong className="font-bold text-amber-900 block">General Information & Demo Estimates Notice:</strong>
            <p>
              The clinical overview, procedure descriptions, surgical duration, and cost ranges provided on this page are general educational and planning benchmarks. They do not constitute personalized medical advice or guaranteed pricing. Actual medical plans and hospital costs depend on in-person diagnostic review by treating surgeons.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* What the Treatment Is & Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary-600" />
                What is {treatment.name}?
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {treatment.overview || treatment.description}
              </p>
              {treatment.procedureInformation && (
                <div className="pt-3 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Procedure Summary
                  </h3>
                  <p>{treatment.procedureInformation}</p>
                </div>
              )}
            </div>

            {/* Typical Procedure Stages */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-600" />
                Typical Procedure Stages
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                    01
                  </span>
                  <h4 className="font-bold text-navy-950 text-sm">Pre-Op Evaluation</h4>
                  <p className="text-xs text-slate-600">
                    Comprehensive blood tests, imaging (MRI/CT), anesthesia clearance, and clinical team consultation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                    02
                  </span>
                  <h4 className="font-bold text-navy-950 text-sm">Procedure Execution</h4>
                  <p className="text-xs text-slate-600">
                    Conducted in sterile modular operating suites using robotic navigation or minimally invasive surgical techniques.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                    03
                  </span>
                  <h4 className="font-bold text-navy-950 text-sm">Inpatient Monitoring</h4>
                  <p className="text-xs text-slate-600">
                    Dedicated post-op recovery in specialized ICUs or private inpatient suites with 24/7 nursing and physical therapy.
                  </p>
                </div>
              </div>
            </div>

            {/* Recovery Information & Timelines */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-primary-600" />
                Recovery Information & Travel Guidelines
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {treatment.recoveryInformation || 'Patients typically undergo inpatient observation followed by physical therapy or outpatient follow-up. Fit-to-fly certification is granted once vital parameters and mobility are confirmed.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <strong className="text-navy-950 block text-sm">Recommended Stay in India:</strong>
                    <span className="text-slate-600">10 – 14 days total trip (including pre-op tests & recovery)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <strong className="text-navy-950 block text-sm">Fit-to-Fly Certification:</strong>
                    <span className="text-slate-600">Issued by the chief attending surgeon prior to departure flight</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Hospitals Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-navy-950">Accredited Hospitals for {treatment.name}</h2>
                  <p className="text-xs text-slate-500">Verified centers equipped with specialized surgical departments.</p>
                </div>
                <Link to={`/hospitals?treatment=${encodeURIComponent(treatment.name)}`}>
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View All
                  </Button>
                </Link>
              </div>

              {relatedHospitals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedHospitals.map((hosp) => (
                    <Card key={hosp._id} className="p-5 flex flex-col justify-between border-slate-200">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-primary-700 font-semibold flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {hosp.city}
                          </span>
                          <span className="flex items-center gap-1 text-saffron-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-saffron-500" />
                            {hosp.rating || 4.8}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-navy-950 mb-1">{hosp.name}</h4>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {(hosp.accreditation || ['NABH']).map((acc) => (
                            <span key={acc} className="text-[10px] font-bold bg-navy-900 text-white px-2 py-0.5 rounded">
                              {acc}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                        <Link to={`/hospitals/${hosp.slug || hosp._id}`} className="w-full">
                          <Button variant="outline" size="sm" className="w-full font-semibold">
                            View Hospital Details
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-xl text-center border border-slate-200 text-xs text-slate-500">
                  Multiple accredited hospitals in Delhi, Mumbai, Chennai, and Bengaluru perform this procedure.
                  <div className="mt-3">
                    <Link to="/hospitals">
                      <Button variant="outline" size="sm">Explore Hospital Network</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Related Doctors Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-navy-950">Leading Specialists</h2>
                  <p className="text-xs text-slate-500">Consult with surgeons specializing in this clinical discipline.</p>
                </div>
                <Link to={`/doctors?specialty=${encodeURIComponent(treatment.category)}`}>
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View All Doctors
                  </Button>
                </Link>
              </div>

              {relatedDoctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedDoctors.map((doc) => (
                    <Card key={doc._id} className="p-5 flex flex-col justify-between border-slate-200">
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={doc.profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80'}
                          alt={doc.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-navy-950">{doc.name}</h4>
                          <p className="text-xs text-primary-700 font-semibold">{doc.specialization}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{doc.experience || 15}+ Years Experience</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                        <Link to={`/doctors/${doc._id}`} className="w-full">
                          <Button variant="outline" size="sm" className="w-full">
                            View Doctor Profile
                          </Button>
                        </Link>
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full whitespace-nowrap"
                          onClick={() => navigate(`/plan-journey?treatment=${treatment._id}&doctorId=${doc._id}`)}
                        >
                          Consult
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Specialist consultation available upon inquiry.</p>
              )}
            </div>
          </div>

          {/* Right Column / Cost Comparison Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-slate-200 space-y-5">
              <h3 className="text-base font-bold text-navy-950">
                International Cost Comparison
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="font-semibold text-emerald-900">India Estimate</span>
                  <span className="font-extrabold text-emerald-800 text-sm">
                    {formatUSD(minCost)} – {formatUSD(maxCost)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">United States</span>
                  <span className="font-bold text-slate-500 line-through">
                    {formatUSD(usaCost)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">United Kingdom</span>
                  <span className="font-bold text-slate-500 line-through">
                    {formatUSD(ukCost)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-navy-950 block">Package Usually Includes:</span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-600" />
                    <span>Surgeon & Anesthetist Fees</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-600" />
                    <span>Operating Suite & Equipment</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-600" />
                    <span>Standard Inpatient Room Days</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-600" />
                    <span>Routine Post-Op Medications</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="saffron"
                className="w-full font-bold shadow-xs"
                onClick={() => navigate(`/plan-journey?treatment=${treatment._id}&treatmentName=${encodeURIComponent(treatment.name)}`)}
              >
                Request Free Custom Quote
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
