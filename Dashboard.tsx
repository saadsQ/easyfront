import React, { useState } from 'react';
import { StatCard } from './StatCard';
import { RevenueChart, ServiceStatusChart } from './Charts';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Car, Users, Wrench, DollarSign, Calendar, Plus } from 'lucide-react';
import { AddVehicleModal } from '../Vehicles/AddVehicleModal';
import { Vehicle } from '../../types/vehicle';
import apiClient from '../../utils/apiClient';

const Dashboard: React.FC = () => {
  const isDisabled = false; // Enable the Add Vehicle button
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const stats = [
    {
      title: 'Total Vehicles',
      value: 0,
      change: { value: 0, type: 'increase' as const, period: 'last month' },
      icon: Car,
      color: 'blue' as const
    },
    {
      title: 'Active Repairs',
      value: 0,
      change: { value: 0, type: 'decrease' as const, period: 'yesterday' },
      icon: Wrench,
      color: 'orange' as const
    },
    {
      title: 'Total Clients',
      value: 0,
      change: { value: 0, type: 'increase' as const, period: 'last week' },
      icon: Users,
      color: 'green' as const
    },
    {
      title: 'Monthly Revenue',
      value: 0,
      change: { value: 0, type: 'increase' as const, period: 'last month' },
      icon: DollarSign,
      color: 'emerald' as const,
      format: 'currency' as const
    }
  ];

  const quickActions = [
    { 
      icon: Wrench, 
      label: 'New Repair Order', 
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => {},
      disabled: true
    },
    { 
      icon: Car, 
      label: 'Add Vehicle', 
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => setIsAddVehicleModalOpen(true),
      disabled: false
    },
    { 
      icon: Users, 
      label: 'Register Client', 
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => {},
      disabled: true
    },
    { 
      icon: Calendar, 
      label: 'Schedule Service', 
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => {},
      disabled: true
    },
  ];

  const serviceStatus = [
    { label: 'Completed', count: 0, color: 'bg-green-500' },
    { label: 'In Progress', count: 0, color: 'bg-blue-500' },
    { label: 'Pending', count: 0, color: 'bg-yellow-500' },
    { label: 'Cancelled', count: 0, color: 'bg-red-500' },
  ];

  const handleAddVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      setIsLoading(true);
      await apiClient.post('/vehicules', vehicleData);
      // You might want to refresh the dashboard data here
      setIsAddVehicleModalOpen(false);
      // Show success message or notification
    } catch (error) {
      console.error('Error adding vehicle:', error);
      // Show error message or notification
    } finally {
      setIsLoading(false);
    }
  };

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
          <Button 
            variant="outline" 
            icon={Calendar}
            className="opacity-50 cursor-not-allowed"
            disabled={true}
          >
            Schedule Service
          </Button>
          <Button 
            icon={Plus}
            className="opacity-50 cursor-not-allowed"
            disabled={true}
          >
            New Repair Order
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} disabled={isDisabled} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.onClick}
                className={`${action.color} text-white p-4 h-auto flex-col gap-2 ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={action.disabled}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Status */}
        <Card className="p-6">
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
              <span className="font-medium text-gray-900">0 services</span> performed today
            </p>
          </div>
        </Card>

        {/* Revenue Chart */}
        <Card className="p-6">
          <RevenueChart />
        </Card>
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleModalOpen}
        onClose={() => setIsAddVehicleModalOpen(false)}
        onSave={handleAddVehicle}
      />
    </div>
  );
};

export default Dashboard;