import React from 'react';
import {StatusCard} from '../UI/StatusCard';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Wrench, 
  Calendar, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Gauge,
  Building2,
  Package,
  Users2,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { id: 'unified', icon: Users2, label: 'Unified', active: true },
    { id: 'clients', icon: Users, label: 'Clients', active: true },
    { id: 'vehicles', icon: Car, label: 'Vehicles', active: true },
    { id: 'suppliers', icon: Building2, label: 'Suppliers', active: true },
    { id: 'enhanced-suppliers', icon: Sparkles, label: 'Enhanced Suppliers', active: true },
    { id: 'inventory', icon: Package, label: 'Inventory', active: true },
    { id: 'workers', icon: Wrench, label: 'Workers', active: false },
    { id: 'repairs', icon: Wrench, label: 'Repairs', active: false },
    { id: 'appointments', icon: Calendar, label: 'Appointments', active: false },
    { id: 'reports', icon: BarChart3, label: 'Reports', active: false },
  ];

  const bottomItems = [
    { id: 'settings', icon: Settings, label: 'Settings', active: false },
    { id: 'help', icon: HelpCircle, label: 'Help', active: false },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AutoShop</h1>
            <p className="text-sm text-gray-500">Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => item.active && onTabChange(item.id)}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                  : item.active
                  ? 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              disabled={!item.active}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-500' : ''}`} />
              {item.label}
              {!item.active && (
                <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              className="w-full flex items-center px-3 py-3 text-sm font-medium text-gray-400 rounded-lg cursor-not-allowed"
              disabled
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
              <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                Soon
              </span>
            </button>
          );
        })}
        
        {/* System Status */}
        <div className="p-4">
        <StatusCard className="p-4 bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
          <div className="text-center">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Gauge className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium text-slate-900 mb-1">System Status</p>
            <p className="text-xs text-slate-600">All systems operational</p>
            <div className="mt-2 flex justify-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </StatusCard>
      </div>
    </div>
    </div>
  );
};

export default Sidebar;