import React from 'react';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
import { Clock, User, Wrench, ExternalLink } from 'lucide-react';

interface Repair {
  id: string;
  vehicle: string;
  client: string;
  issue: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  technician: string;
  timeRemaining: string;
  progress: number;
}

const mockRepairs: Repair[] = [
  {
    id: '1',
    vehicle: '2021 Toyota Camry',
    client: 'John Smith',
    issue: 'Engine diagnostic and oil change',
    status: 'in-progress',
    priority: 'medium',
    technician: 'Mike Johnson',
    timeRemaining: '2h 30m',
    progress: 65
  },
  {
    id: '2',
    vehicle: '2019 Honda Accord',
    client: 'Sarah Wilson',
    issue: 'Brake pad replacement',
    status: 'pending',
    priority: 'high',
    technician: 'Alex Chen',
    timeRemaining: '4h 15m',
    progress: 0
  },
  {
    id: '3',
    vehicle: '2020 Ford F-150',
    client: 'Robert Davis',
    issue: 'Transmission service',
    status: 'completed',
    priority: 'low',
    technician: 'Mike Johnson',
    timeRemaining: 'Completed',
    progress: 100
  }
];

export const RecentRepairs: React.FC = () => {
  const getStatusBadge = (status: Repair['status']) => {
    const variants = {
      pending: 'warning' as const,
      'in-progress': 'info' as const,
      completed: 'success' as const
    };
    return <Badge variant={variants[status]}>{status.replace('-', ' ')}</Badge>;
  };

  const getPriorityBadge = (priority: Repair['priority']) => {
    const variants = {
      low: 'default' as const,
      medium: 'warning' as const,
      high: 'error' as const,
      urgent: 'error' as const
    };
    return <Badge variant={variants[priority]} size="sm">{priority}</Badge>;
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Repairs</h3>
          <p className="text-sm text-slate-600">Latest service activities</p>
        </div>
        <Button variant="ghost" size="sm" icon={ExternalLink}>
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {mockRepairs.map((repair) => (
          <div key={repair.id} className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 mb-1">{repair.vehicle}</h4>
                <p className="text-sm text-slate-600 mb-2">{repair.issue}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <User className="h-3 w-3" />
                  <span>{repair.client}</span>
                  <span>•</span>
                  <Wrench className="h-3 w-3" />
                  <span>{repair.technician}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {getStatusBadge(repair.status)}
                {getPriorityBadge(repair.priority)}
              </div>
            </div>

            {repair.status === 'in-progress' && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Progress</span>
                  <span>{repair.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${repair.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                <span>{repair.timeRemaining}</span>
              </div>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};