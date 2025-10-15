import React from 'react';
import { Car, Wrench, Users, DollarSign, TrendingUp, TrendingDown, Calendar, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const isDisabled = true; // This will control the disabled state of buttons
  
  const stats: DashboardStats = {
    totalVehicles: 0,
    activeRepairs: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    vehiclesTrend: 0,
    repairsTrend: 0,
    clientsTrend: 0,
    revenueTrend: 15,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const quickActions = [
    { icon: Wrench, label: 'New Repair Order', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Car, label: 'Add Vehicle', color: 'bg-green-500 hover:bg-green-600' },
    { icon: Users, label: 'Register Client', color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: Calendar, label: 'Schedule Service', color: 'bg-orange-500 hover:bg-orange-600' },
  ];

  const serviceStatus = [
    { label: 'Completed', count: 0, color: 'bg-green-500' },
    { label: 'In Progress', count: 0, color: 'bg-blue-500' },
    { label: 'Pending', count: 0, color: 'bg-yellow-500' },
    { label: 'Cancelled', count: 0, color: 'bg-red-500' },
  ];

  // Disabled button styles
  const disabledButtonClass = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening at your shop today.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${disabledButtonClass}`}
            disabled={isDisabled}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Service
          </button>
          <button 
            className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${disabledButtonClass}`}
            disabled={isDisabled}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Repair Order
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalVehicles}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">{stats.vehiclesTrend}% vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Repairs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeRepairs}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-sm text-red-600">{Math.abs(stats.repairsTrend)}% vs yesterday</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">{stats.clientsTrend}% vs last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">{stats.revenueTrend}% vs last month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className={`${action.color} text-white p-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${disabledButtonClass}`}
                disabled={isDisabled}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue</h2>
            <div className="flex items-center text-sm text-green-600">
                 <span>No data</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">Revenue trend over the last 6 months</p>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end space-x-2 h-32">
            {[0, 0, 0, 0, 0, 0].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-indigo-500 rounded-t-md transition-all hover:bg-indigo-600"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* Service Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h2>
          <p className="text-sm text-gray-600 mb-6">Current month breakdown</p>
          
          <div className="space-y-4">
            {serviceStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <span className="text-sm font-medium text-gray-700">{status.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{status.count}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">0  services</span> performed today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;