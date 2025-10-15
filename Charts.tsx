import React from 'react';
import { Card } from '../UI/Card';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

export const RevenueChart: React.FC = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const revenue = [45000, 52000, 48000, 61000, 55000, 67000];
  const maxRevenue = Math.max(...revenue);
  const percentageChange = 12.5;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue</h2>
          <p className="text-sm text-gray-600">Revenue trend over the last 6 months</p>
        </div>
        <div className="flex items-center text-emerald-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">+{percentageChange}%</span>
        </div>
      </div>
      <div className="h-64 flex items-end gap-4 mt-4">
        {months.map((month, index) => (
          <div key={month} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-slate-100 rounded-t-lg relative group">
              <div 
                className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                style={{ height: `${(revenue[index] / maxRevenue) * 180}px` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  ${revenue[index].toLocaleString()}
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-600 mt-2">{month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ServiceStatusChart: React.FC = () => {
  const services = [
    { status: 'Completed', count: 24, color: 'bg-emerald-500' },
    { status: 'In Progress', count: 8, color: 'bg-blue-500' },
    { status: 'Pending', count: 12, color: 'bg-amber-500' },
    { status: 'Cancelled', count: 3, color: 'bg-red-500' }
  ];

  const total = services.reduce((sum, service) => sum + service.count, 0);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Service Status</h3>
          <p className="text-sm text-slate-600">Current month breakdown</p>
        </div>
        <PieChart className="h-5 w-5 text-slate-400" />
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.status} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${service.color}`} />
              <span className="text-sm font-medium text-slate-700">{service.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">{service.count}</span>
              <div className="w-20 bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${service.color}`}
                  style={{ width: `${(service.count / total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const ActivityChart: React.FC = () => {
  const activities = [
    { time: '9:00 AM', value: 12 },
    { time: '11:00 AM', value: 19 },
    { time: '1:00 PM', value: 15 },
    { time: '3:00 PM', value: 22 },
    { time: '5:00 PM', value: 8 }
  ];

  const maxValue = Math.max(...activities.map(a => a.value));

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Daily Activity</h3>
          <p className="text-sm text-slate-600">Services performed today</p>
        </div>
        <Activity className="h-5 w-5 text-slate-400" />
      </div>

      <div className="h-40 flex items-end justify-between gap-2">
        {activities.map((activity, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full bg-slate-100 rounded-t relative group">
              <div 
                className="bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t transition-all duration-300 hover:from-emerald-600 hover:to-emerald-500 cursor-pointer"
                style={{ height: `${(activity.value / maxValue) * 120}px` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {activity.value}
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-500 mt-2">{activity.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};