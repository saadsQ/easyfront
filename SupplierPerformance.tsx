import React from 'react';
import { Badge } from '../UI/Badge';
import {
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Package,
  DollarSign,
  Star,
  Activity
} from 'lucide-react';

interface SupplierPerformanceProps {
  supplierId: string;
  supplierName: string;
}

export const SupplierPerformance: React.FC<SupplierPerformanceProps> = ({
  supplierId,
  supplierName,
}) => {
  const performanceData = {
    overallScore: 87,
    reliability: 92,
    quality: 85,
    pricing: 80,
    communication: 90,
    deliverySpeed: 88,
    stockAvailability: 84,
    trend: 'up',
    trendValue: 5,
  };

  const recentMetrics = [
    {
      month: 'Oct',
      orders: 12,
      onTime: 11,
      quality: 4.5,
      spend: 45200,
    },
    {
      month: 'Sep',
      orders: 15,
      onTime: 14,
      quality: 4.3,
      spend: 52100,
    },
    {
      month: 'Aug',
      orders: 10,
      onTime: 9,
      quality: 4.6,
      spend: 38500,
    },
  ];

  const insights = [
    {
      type: 'positive',
      icon: CheckCircle2,
      text: 'Consistently delivers on time (92% success rate)',
      color: 'text-green-600 bg-green-50 border-green-200',
    },
    {
      type: 'positive',
      icon: Award,
      text: 'Top 3 supplier by reliability',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      text: '3 items approaching low stock levels',
      color: 'text-orange-600 bg-orange-50 border-orange-200',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 55) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 rounded-xl p-8 border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Overall Performance</h3>
            <p className="text-sm text-gray-600">Based on delivery, quality, and reliability metrics</p>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-bold ${getScoreColor(performanceData.overallScore)}`}>
              {performanceData.overallScore}
            </div>
            <div className="flex items-center justify-end mt-2">
              {performanceData.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
              <span className={`ml-1 text-sm font-semibold ${
                performanceData.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {performanceData.trend === 'up' ? '+' : '-'}{performanceData.trendValue}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-60 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Reliability</span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{performanceData.reliability}%</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full ${getScoreBg(performanceData.reliability)}`}
                style={{ width: `${performanceData.reliability}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Quality</span>
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{performanceData.quality}%</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full ${getScoreBg(performanceData.quality)}`}
                style={{ width: `${performanceData.quality}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Delivery Speed</span>
              <Clock className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{performanceData.deliverySpeed}%</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full ${getScoreBg(performanceData.deliverySpeed)}`}
                style={{ width: `${performanceData.deliverySpeed}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-700">{metric.month}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{metric.orders} orders</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-gray-900">{metric.onTime}/{metric.orders} on-time</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">{metric.quality} rating</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{metric.spend.toLocaleString()} MAD</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {Math.round((metric.onTime / metric.orders) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Success</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pricing Competitiveness</span>
              <span className="text-sm font-semibold text-gray-900">{performanceData.pricing}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreBg(performanceData.pricing)}`}
                style={{ width: `${performanceData.pricing}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Communication</span>
              <span className="text-sm font-semibold text-gray-900">{performanceData.communication}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreBg(performanceData.communication)}`}
                style={{ width: `${performanceData.communication}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Stock Availability</span>
              <span className="text-sm font-semibold text-gray-900">{performanceData.stockAvailability}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreBg(performanceData.stockAvailability)}`}
                style={{ width: `${performanceData.stockAvailability}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`flex items-start p-4 rounded-lg border ${insight.color}`}
            >
              <insight.icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
