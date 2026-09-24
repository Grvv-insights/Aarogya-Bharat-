import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchTreatments } from '../services/treatmentService';
import { fetchHospitals } from '../services/hospitalService';
import {
  calculateCostEstimate,
  saveCostEstimate,
  CostCalculationParams
} from '../services/costEstimatorService';
import { Treatment, Hospital, CalculatedCostEstimate } from '../types';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Calculator,
  ShieldAlert,
  Save,
  CheckCircle2,
  Plane,
  Building2,
  Stethoscope,
  Car,
  Briefcase,
  HelpCircle,
  ArrowRight,
  Info,
  Calendar,
  Sparkles,
  MapPin,
  RefreshCw,
  Clock
} from 'lucide-react';

const CITIES = ['Delhi NCR', 'Chennai', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Kolkata'];

const COMPLEXITY_OPTIONS: {
  value: 'standard' | 'moderate' | 'high_revision';
  label: string;
  tagline: string;
  multiplierText: string;
}[] = [
  {
    value: 'standard',
    label: 'Standard / Primary',
    tagline: 'Routine procedure, first-time intervention, minimal pre-existing risk',
    multiplierText: 'Baseline (~0.9x)'
  },
  {
    value: 'moderate',
    label: 'Moderate / Typical',
    tagline: 'Standard clinical case with full post-op clinical pathway',
    multiplierText: 'Standard (~1.0x)'
  },
  {
    value: 'high_revision',
    label: 'High / Revision Surgery',
    tagline: 'Prior surgical revisions, bilateral, or complex medical history',
    multiplierText: 'Specialized (~1.35x)'
  }
];

export const CostEstimatorPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Selection states
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Delhi NCR');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [complexity, setComplexity] = useState<'standard' | 'moderate' | 'high_revision'>('moderate');
  const [accommodationDuration, setAccommodationDuration] = useState<number>(10);
  const [travelDuration, setTravelDuration] = useState<number>(14);

  // Currency & calculation state
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [estimate, setEstimate] = useState<CalculatedCostEstimate | null>(null);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Load initial treatments and hospitals
  useEffect(() => {
    const init = async () => {
      try {
        const [trts, hosps] = await Promise.all([
          fetchTreatments(),
          fetchHospitals({ city: 'Delhi NCR' })
        ]);
        setTreatments(trts);
        setHospitals(hosps);
        if (trts.length > 0) {
          setSelectedTreatmentId(trts[0]._id);
        }
        if (hosps.length > 0) {
          setSelectedHospitalId(hosps[0]._id);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, []);

  // Update hospital list when city changes
  useEffect(() => {
    const updateHospitals = async () => {
      try {
        const hosps = await fetchHospitals({ city: selectedCity });
        setHospitals(hosps);
        if (hosps.length > 0) {
          setSelectedHospitalId(hosps[0]._id);
        } else {
          setSelectedHospitalId('');
        }
      } catch (err) {
        console.error('Failed to fetch hospitals for city:', err);
      }
    };
    updateHospitals();
  }, [selectedCity]);

  // Execute backend calculation whenever inputs change
  const triggerCalculation = useCallback(async () => {
    if (!selectedTreatmentId) return;

    setCalculating(true);
    try {
      const selectedTrt = treatments.find((t) => t._id === selectedTreatmentId);
      const selectedHosp = hospitals.find((h) => h._id === selectedHospitalId);

      const params: CostCalculationParams = {
        treatmentId: selectedTreatmentId,
        treatmentName: selectedTrt ? selectedTrt.name : undefined,
        city: selectedCity,
        hospitalId: selectedHospitalId || undefined,
        hospitalName: selectedHosp ? selectedHosp.name : 'Accredited Partner Hospital',
        complexity,
        accommodationDuration: Number(accommodationDuration),
        travelDuration: Number(travelDuration)
      };

      const result = await calculateCostEstimate(params);
      setEstimate(result);
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setCalculating(false);
    }
  }, [
    selectedTreatmentId,
    selectedCity,
    selectedHospitalId,
    complexity,
    accommodationDuration,
    travelDuration,
    treatments,
    hospitals
  ]);

  useEffect(() => {
    if (!initialLoading && selectedTreatmentId) {
      triggerCalculation();
    }
  }, [triggerCalculation, initialLoading, selectedTreatmentId]);

  // Handle saving estimate to patient dashboard
  const handleSaveToDashboard = async () => {
    if (!user) {
      navigate('/login?redirect=/cost-estimator');
      return;
    }

    setSaving(true);
    setSaveSuccessMessage(null);
    try {
      const selectedTrt = treatments.find((t) => t._id === selectedTreatmentId);
      const selectedHosp = hospitals.find((h) => h._id === selectedHospitalId);

      const params: CostCalculationParams = {
        treatmentId: selectedTreatmentId,
        treatmentName: selectedTrt ? selectedTrt.name : undefined,
        city: selectedCity,
        hospitalId: selectedHospitalId || undefined,
        hospitalName: selectedHosp ? selectedHosp.name : 'Accredited Partner Hospital',
        complexity,
        accommodationDuration: Number(accommodationDuration),
        travelDuration: Number(travelDuration)
      };

      await saveCostEstimate(params);
      setSaveSuccessMessage('Estimate saved to your dashboard! You can review or compare it anytime.');
      setTimeout(() => setSaveSuccessMessage(null), 7000);
    } catch (err: any) {
      console.error('Failed to save estimate:', err);
      alert('Failed to save estimate. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Helper to format ranges nicely
  const formatRange = (range?: { minINR: number; maxINR: number; minUSD: number; maxUSD: number }) => {
    if (!range) return '—';
    if (currency === 'INR') {
      return `₹${range.minINR.toLocaleString('en-IN')} – ₹${range.maxINR.toLocaleString('en-IN')}`;
    }
    return `$${range.minUSD.toLocaleString('en-US')} – $${range.maxUSD.toLocaleString('en-US')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-primary-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-200 border border-primary-400/30 text-xs font-semibold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-primary-300" />
              Illustrative Planning Calculator
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Treatment Journey Cost Estimator
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Calculate an illustrative, end-to-end journey budget covering medical surgery, accredited hospital facility costs, private recovery lodging, local transit, and travel.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Display Currency
            </span>
            <div className="inline-flex p-1 bg-navy-800/80 rounded-2xl border border-slate-700/80 shadow-inner">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  currency === 'INR'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ₹ INR (India)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  currency === 'USD'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                $ USD (International)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Clear Non-Binding Disclaimer Notice Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 flex items-start gap-3.5 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-amber-900 uppercase tracking-wide text-[11px]">
            Important Notice: Illustrative Planning Estimate Only
          </p>
          <p className="leading-relaxed text-amber-900/90">
            These figures are illustrative estimates for planning purposes only. Actual costs vary by hospital, doctor, treatment plan, patient condition, travel dates and other factors. A final quotation must come directly from the healthcare provider. This tool does not provide medical diagnoses or guaranteed pricing invoices.
          </p>
        </div>
      </div>

      {/* 3. Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="bg-slate-50/60 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  Journey Parameters
                </h2>
                <p className="text-xs text-slate-500">
                  Select your medical procedure, destination city, and stay specifications.
                </p>
              </div>
              {calculating && (
                <span className="flex items-center gap-1.5 text-xs text-primary-700 font-medium animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Recalculating...
                </span>
              )}
            </CardHeader>

            <CardBody className="p-6 space-y-6">
              {/* Field 1: Treatment */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  1. Treatment / Surgical Procedure <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedTreatmentId}
                  onChange={(e) => setSelectedTreatmentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-xs"
                >
                  {treatments.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} — {t.category}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Baseline procedure cost benchmarks are derived from verified Indian hospital catalog data.
                </p>
              </div>

              {/* Field 2: Destination City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  2. Destination Medical City <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setSelectedCity(city)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-all flex items-center gap-1.5 ${
                        selectedCity === city
                          ? 'border-primary-600 bg-primary-50 text-primary-900 ring-1 ring-primary-500'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-primary-600 shrink-0" />
                      <span className="truncate">{city}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 3: Hospital */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  3. Hospital Center in {selectedCity} <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedHospitalId}
                  onChange={(e) => setSelectedHospitalId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-xs"
                >
                  {hospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name} ({h.accreditation?.join(', ') || 'JCI / NABH'})
                    </option>
                  ))}
                  {hospitals.length === 0 && (
                    <option value="">Accredited Partner Hospital in {selectedCity}</option>
                  )}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Includes top JCI and NABH accredited international medical centers.
                </p>
              </div>

              {/* Field 4: Approximate Treatment Complexity / Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  4. Approximate Treatment Complexity / Category <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {COMPLEXITY_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => setComplexity(opt.value)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        complexity === opt.value
                          ? 'border-primary-600 bg-primary-50/80 shadow-xs ring-1 ring-primary-500'
                          : 'border-slate-200 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              complexity === opt.value
                                ? 'border-primary-600 bg-primary-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {complexity === opt.value && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </span>
                          <span className="text-xs font-bold text-navy-950">{opt.label}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 pl-6">{opt.tagline}</p>
                      </div>
                      <Badge variant={complexity === opt.value ? 'primary' : 'neutral'} size="sm">
                        {opt.multiplierText}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field 5: Accommodation Duration */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    5. Accommodation Duration (Lodging)
                  </label>
                  <span className="text-xs font-extrabold text-primary-700 px-2 py-0.5 bg-primary-50 rounded-lg">
                    {accommodationDuration} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="30"
                  step="1"
                  value={accommodationDuration}
                  onChange={(e) => setAccommodationDuration(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Short Stay (3 days)</span>
                  <span>Standard Recovery (10-14 days)</span>
                  <span>Extended (30 days)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Covers private recovery hotels / serviced suites (~₹3,200 – ₹6,200 / $40 – $75 per night).
                </p>
              </div>

              {/* Field 6: Travel Duration */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    6. Total Travel & Journey Duration
                  </label>
                  <span className="text-xs font-extrabold text-primary-700 px-2 py-0.5 bg-primary-50 rounded-lg">
                    {travelDuration} Days Total
                  </span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="45"
                  step="1"
                  value={travelDuration}
                  onChange={(e) => setTravelDuration(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 Week (7 days)</span>
                  <span>2-3 Weeks (14-21 days)</span>
                  <span>6+ Weeks (45 days)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Includes international round-trip flight buffer, pre-admission consultation, surgery, recovery, and fit-to-fly clinical sign-off.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Calculated Results (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Total Range Highlight Card */}
          <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-primary-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary-300" />
                Estimated Total Range
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary-400/20 text-primary-200 border border-primary-400/30">
                Planning Range
              </span>
            </div>

            <div className="py-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-mono">
                {formatRange(estimate?.totals.estimatedTotalRange)}
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Estimated total journey envelope for <strong>{estimate?.treatmentName}</strong> at <strong>{estimate?.hospitalName}</strong>, {estimate?.city}.
              </p>
            </div>

            {/* Save to Dashboard Action */}
            <div className="pt-3 border-t border-slate-700/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="saffron"
                size="md"
                onClick={handleSaveToDashboard}
                disabled={saving || !estimate}
                className="flex-1 justify-center font-bold shadow-md"
                leftIcon={<Save className="w-4 h-4" />}
              >
                {saving ? 'Saving to Dashboard...' : 'Save Estimate to My Dashboard'}
              </Button>

              <Link to={`/consultation?treatment=${selectedTreatmentId}&hospital=${selectedHospitalId}`}>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto text-white border-slate-600 hover:bg-white/10"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Request Quotation
                </Button>
              </Link>
            </div>

            {saveSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>
                  {saveSuccessMessage}{' '}
                  <Link to="/dashboard" className="underline font-bold text-white ml-1">
                    View in Dashboard &rarr;
                  </Link>
                </span>
              </div>
            )}
          </div>

          {/* Three Core Subtotals as requested */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Estimated Medical Cost */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-primary-600" />
                Estimated Medical Cost
              </span>
              <div className="text-base font-extrabold text-navy-950 font-mono">
                {formatRange(estimate?.totals.estimatedMedicalCost)}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Surgery + Clinical / OT fees
              </p>
            </div>

            {/* 2. Estimated Travel Cost */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block flex items-center gap-1">
                <Plane className="w-3.5 h-3.5 text-primary-600" />
                Estimated Travel Cost
              </span>
              <div className="text-base font-extrabold text-navy-950 font-mono">
                {formatRange(estimate?.totals.estimatedTravelCost)}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Flights + Local Transit
              </p>
            </div>

            {/* 3. Estimated Accommodation Cost */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-primary-600" />
                Estimated Lodging
              </span>
              <div className="text-base font-extrabold text-navy-950 font-mono">
                {formatRange(estimate?.totals.estimatedAccommodationCost)}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {accommodationDuration} nights private recovery
              </p>
            </div>
          </div>

          {/* Itemized 6-Category Breakdown Card */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-navy-950">
                  Itemized Journey Breakdown (Estimated Ranges)
                </h3>
                <p className="text-xs text-slate-500">
                  Non-binding planning ranges for each component of your journey.
                </p>
              </div>
              <Badge variant="primary" size="sm">
                6 Components
              </Badge>
            </CardHeader>

            <CardBody className="p-5 space-y-3">
              {/* Category 1: Medical Treatment */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950">Medical Treatment</h4>
                    <p className="text-[11px] text-slate-500">
                      Primary surgical intervention, operating theater time, lead surgeon & specialist faculty fees.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-navy-950 font-mono">
                    {formatRange(estimate?.breakdown.medicalTreatment)}
                  </span>
                </div>
              </div>

              {/* Category 2: Hospital/Clinical Costs */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950">Hospital/Clinical Costs</h4>
                    <p className="text-[11px] text-slate-500">
                      Pre-op diagnostics, pathology workup, ICU standby, nursing care, pharmacy & surgical consumables.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-navy-950 font-mono">
                    {formatRange(estimate?.breakdown.hospitalClinical)}
                  </span>
                </div>
              </div>

              {/* Category 3: Accommodation */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950">
                      Accommodation ({accommodationDuration} Nights)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Comfort medical suites or 4-star recovery hotel close to {estimate?.hospitalName}.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-navy-950 font-mono">
                    {formatRange(estimate?.breakdown.accommodation)}
                  </span>
                </div>
              </div>

              {/* Category 4: Local Transportation */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950">Local Transportation</h4>
                    <p className="text-[11px] text-slate-500">
                      Dedicated airport chauffeur pickup/drop + clinic follow-up transfers in {estimate?.city}.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-navy-950 font-mono">
                    {formatRange(estimate?.breakdown.localTransportation)}
                  </span>
                </div>
              </div>

              {/* Category 5: Travel */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950">Travel (Flights)</h4>
                    <p className="text-[11px] text-slate-500">
                      Round-trip international flight budget planning estimate for patient.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-navy-950 font-mono">
                    {formatRange(estimate?.breakdown.travel)}
                  </span>
                </div>
              </div>

              {/* Category 6: Other Estimated Expenses */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-950">Other Estimated Expenses</h4>
                    <p className="text-[11px] text-slate-500">
                      Indian e-Medical Visa (MED-1), high-speed 5G tourist SIM, incidental daily sustenance & meals.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-navy-950 font-mono">
                    {formatRange(estimate?.breakdown.otherExpenses)}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Mandatory Disclaimer Display (Exact prompt requirement) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase">
              <Info className="w-3.5 h-3.5 text-primary-600" />
              Statutory Disclaimer
            </div>
            <p className="italic leading-relaxed">
              "These figures are illustrative estimates for planning purposes only. Actual costs vary by hospital, doctor, treatment plan, patient condition, travel dates and other factors. A final quotation must come directly from the healthcare provider."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimatorPage;
