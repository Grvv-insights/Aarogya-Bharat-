import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchTreatments } from '../services/treatmentService';
import { Treatment } from '../types';
import { CostComparisonCard } from '../components/common/CostComparisonCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Search, Filter, Stethoscope, MapPin, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Cardiology',
  'Orthopedics',
  'Oncology',
  'Neurology',
  'Organ Transplants',
  'Fertility & IVF',
  'Dental Tourism',
  'Cosmetic & Plastic Surgery'
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

export const TreatmentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialCity = searchParams.get('city') || 'All Cities';
  const initialSearch = searchParams.get('search') || '';

  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [loading, setLoading] = useState<boolean>(true);

  const loadTreatments = async () => {
    setLoading(true);
    try {
      const data = await fetchTreatments({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        city: selectedCity === 'All Cities' ? undefined : selectedCity,
        search: searchQuery || undefined
      });
      setTreatments(data);
    } catch (err) {
      console.error('Error fetching treatments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreatments();
  }, [selectedCategory, selectedCity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTreatments();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">
          <Stethoscope className="w-4 h-4" /> Medical Procedures & Pricing
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Explore Treatments & Procedures
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          Compare treatment durations, expected recovery times, and transparent cost ranges across accredited Indian hospitals.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments by procedure name or condition (e.g., CABG, Knee, CyberKnife)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* City Filter Dropdown */}
          <div className="relative w-full md:w-60">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm text-navy-950 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary-500 focus:outline-none"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" variant="primary" size="md" className="whitespace-nowrap">
            Search Treatments
          </Button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Planning Notice Banner */}
      <div className="p-3.5 rounded-xl bg-primary-50/70 border border-primary-100 text-xs text-primary-900 flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-primary-700 flex-shrink-0" />
        <span>
          Cost estimates and surgical durations shown are realistic planning benchmarks derived from accredited hospital guidelines. Exact pricing is confirmed by your surgeon following clinical evaluation.
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" label="Loading available procedures & cost estimates..." />
        </div>
      )}

      {/* Empty State */}
      {!loading && treatments.length === 0 && (
        <EmptyState
          title="No treatments found"
          description="Try broadening your category filter, city selection, or search term."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCity('All Cities');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      )}

      {/* Treatments Grid */}
      {!loading && treatments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((treatment) => (
            <CostComparisonCard key={treatment._id} treatment={treatment} />
          ))}
        </div>
      )}
    </div>
  );
};
