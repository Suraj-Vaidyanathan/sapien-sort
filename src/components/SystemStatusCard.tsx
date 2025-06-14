
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface SystemStatusCardProps {
  status: 'online' | 'warning' | 'offline';
  packagesProcessed: number;
  totalPackages: number;
  uptime: string;
}

const SystemStatusCard: React.FC<SystemStatusCardProps> = ({
  status,
  packagesProcessed,
  totalPackages,
  uptime,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'System Online',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'System Warning',
        };
      case 'offline':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'System Offline',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const completionRate = totalPackages > 0 ? (packagesProcessed / totalPackages) * 100 : 0;

  return (
    <Card className={`p-6 ${config.bg} ${config.border} border-2`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">System Status</h3>
        <div className="flex items-center space-x-2">
          <Icon className={`w-6 h-6 ${config.color}`} />
          <span className={`font-medium ${config.color}`}>{config.text}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Packages Processed</p>
          <p className="text-2xl font-bold text-gray-800">{packagesProcessed}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Packages</p>
          <p className="text-2xl font-bold text-gray-800">{totalPackages}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Completion Rate</p>
          <p className="text-2xl font-bold text-gray-800">{completionRate.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Uptime</p>
          <p className="text-2xl font-bold text-gray-800">{uptime}</p>
        </div>
      </div>
    </Card>
  );
};

export default SystemStatusCard;
