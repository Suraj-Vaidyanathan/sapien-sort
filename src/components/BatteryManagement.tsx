
import React from 'react';
import { Card } from '@/components/ui/card';
import { Battery, BatteryLow, BatteryCharging } from 'lucide-react';

interface Robot {
  id: string;
  name: string;
  batteryLevel: number;
  status: 'active' | 'idle' | 'charging' | 'error';
}

interface BatteryManagementProps {
  robots: Robot[];
}

const BatteryManagement: React.FC<BatteryManagementProps> = ({ robots }) => {
  const getBatteryIcon = (level: number, status: string) => {
    if (status === 'charging') return BatteryCharging;
    if (level <= 20) return BatteryLow;
    return Battery;
  };

  const getBatteryColor = (level: number, status: string) => {
    if (status === 'charging') return 'text-blue-600';
    if (level <= 20) return 'text-red-600';
    if (level <= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBatteryBg = (level: number) => {
    if (level <= 20) return 'bg-red-100';
    if (level <= 50) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const getCurrentValue = (status: string) => {
    if (status === 'charging') return `${(Math.random() * 2 + 1).toFixed(1)}A`;
    if (status === 'active') return `${(Math.random() * 3 + 4).toFixed(1)}A`;
    return '0.0A';
  };

  return (
    <Card className="p-3">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Battery Status</h3>
      
      <div className="grid grid-cols-1 gap-2">
        {robots.map(robot => {
          const BatteryIcon = getBatteryIcon(robot.batteryLevel, robot.status);
          const currentValue = getCurrentValue(robot.status);
          
          return (
            <div key={robot.id} className={`p-2 rounded-lg ${getBatteryBg(robot.batteryLevel)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BatteryIcon className={`w-4 h-4 ${getBatteryColor(robot.batteryLevel, robot.status)}`} />
                  <span className="font-medium text-gray-800 text-sm">{robot.name}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          robot.batteryLevel <= 20 ? 'bg-red-500' :
                          robot.batteryLevel <= 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${robot.batteryLevel}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getBatteryColor(robot.batteryLevel, robot.status)}`}>
                      {robot.batteryLevel}%
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Current</div>
                    <div className="text-sm font-medium text-gray-800">{currentValue}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default BatteryManagement;
