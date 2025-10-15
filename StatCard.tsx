import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../UI/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'slate';
  format?: 'number' | 'currency' | 'percentage';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  format = 'number'
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    slate: 'bg-slate-50 text-slate-600'
  };

  const formatValue = (val: string | number) => {
    if (format === 'currency') {
      return `$${Number(val).toLocaleString()}`;
    }
    if (format === 'percentage') {
      return `${val}%`;
    }
    return Number(val).toLocaleString();
  };

  return (
    <Card hover className="group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-2">
            {formatValue(value)}
          </p>
          {change && (
            <div className="flex items-center gap-1">
              {change.type === 'increase' ? (
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                change.type === 'increase' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {change.value}%
              </span>
              <span className="text-sm text-slate-500">vs {change.period}</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${colorClasses[color]} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};