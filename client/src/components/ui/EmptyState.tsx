import React from 'react';
import { Search } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm max-w-lg mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
        {icon || <Search className="w-8 h-8 text-slate-400" />}
      </div>
      <h3 className="text-lg font-bold text-navy-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};
