import React from 'react';
import { Link } from 'react-router-dom';
import { Treatment } from '../../types';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight, CheckCircle2, TrendingDown, Info, Clock, Stethoscope } from 'lucide-react';

export interface CostComparisonCardProps {
  treatment: Treatment;
  onSelect?: (treatment: Treatment) => void;
}

export const CostComparisonCard: React.FC<CostComparisonCardProps> = ({
  treatment,
  onSelect
}) => {
  const formatUSD = (val: number) => `$${val.toLocaleString()}`;

  const indiaCostDisplay = treatment.estimatedCostRange
    ? `$${treatment.estimatedCostRange.minUSD.toLocaleString()} – $${treatment.estimatedCostRange.maxUSD.toLocaleString()}`
    : formatUSD(treatment.avgCostUSD || 6000);

  const usaCost = treatment.estimatedCostRange?.usaComparisonUSD || treatment.usaComparisonCostUSD || 100000;
  const ukCost = treatment.estimatedCostRange?.ukComparisonUSD || treatment.ukComparisonCostUSD || 35000;
  const baseIndiaCost = treatment.estimatedCostRange ? treatment.estimatedCostRange.minUSD : (treatment.avgCostUSD || 6000);
  const savingsUSD = usaCost - baseIndiaCost;

  const targetSlug = treatment.slug || treatment._id;

  return (
    <Card hover className="flex flex-col justify-between border-slate-200">
      <CardBody className="p-6 flex flex-col justify-between h-full">
        <div>
          {/* Category & Badge */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="primary">{treatment.category}</Badge>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <TrendingDown className="w-3.5 h-3.5" />
              Save {treatment.savingsPercentage}%
            </span>
          </div>

          {/* Treatment Title */}
          <h3 className="text-lg font-bold text-navy-950 mb-2 line-clamp-1">
            {treatment.name}
          </h3>
          <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {treatment.description}
          </p>

          {/* Cost Comparison Table */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-semibold text-navy-900">India Cost Range:</span>
              </div>
              <span className="text-sm sm:text-base font-extrabold text-primary-700">
                {indiaCostDisplay}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                USA Average Benchmark:
              </span>
              <span className="line-through font-medium text-slate-400">
                {formatUSD(usaCost)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                UK Average Benchmark:
              </span>
              <span className="line-through font-medium text-slate-400">
                {formatUSD(ukCost)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Estimated Savings:</span>
              <span className="text-emerald-700 font-bold">
                +{formatUSD(savingsUSD)} saved
              </span>
            </div>
          </div>

          {/* Duration & Clinical Specs */}
          <div className="bg-white rounded-lg p-2.5 border border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
              <span className="truncate">{treatment.estimatedDuration || '2 - 4 hours'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
              <span>Success: {treatment.successRate || 98}%</span>
            </div>
          </div>

          {/* Cost Disclaimer */}
          <p className="text-[10px] text-slate-400 mb-4 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span>*Demo estimate for planning. Final quotes depend on medical assessment.</span>
          </p>
        </div>

        {/* Action Buttons: View Treatment & Request Quote */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <Link to={`/treatments/${targetSlug}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full font-semibold">
              View Treatment
            </Button>
          </Link>

          {onSelect ? (
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => onSelect(treatment)}
            >
              Select
            </Button>
          ) : (
            <Link to={`/plan-journey?treatment=${treatment._id}`} className="w-full">
              <Button
                variant="primary"
                size="sm"
                className="w-full font-semibold"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Get Quote
              </Button>
            </Link>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
