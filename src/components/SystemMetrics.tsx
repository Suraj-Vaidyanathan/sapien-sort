
import React from 'react';

interface Robot {
  id: string;
  name: string;
  currentRow: number;
  status: 'active' | 'idle' | 'charging' | 'error';
  batteryLevel: number;
}

interface Package {
  uid: string;
  botAssigned: string | null;
  destination: string;
  status: 'processing' | 'completed' | 'pending';
  timestamp: string;
}

interface SystemMetricsProps {
  robots: Robot[];
  packages: Package[];
}

export const useSystemMetrics = (robots: Robot[], packages: Package[]) => {
  const activeBotCount = robots.filter(bot => bot.status === 'active').length;
  const totalBotCount = robots.length;
  const chargingBotCount = robots.filter(bot => bot.status === 'charging').length;
  const idleBotCount = robots.filter(bot => bot.status === 'idle').length;
  
  const processingPackageCount = packages.filter(pkg => pkg.status === 'processing').length;
  const completedPackageCount = packages.filter(pkg => pkg.status === 'completed').length;
  const pendingPackageCount = packages.filter(pkg => pkg.status === 'pending').length;
  
  const averageBatteryLevel = robots.length > 0 
    ? Math.round(robots.reduce((sum, bot) => sum + bot.batteryLevel, 0) / robots.length)
    : 0;
  
  const lowBatteryBots = robots.filter(bot => bot.batteryLevel <= 20);

  return {
    activeBotCount,
    totalBotCount,
    chargingBotCount,
    idleBotCount,
    processingPackageCount,
    completedPackageCount,
    pendingPackageCount,
    averageBatteryLevel,
    lowBatteryBots,
    systemHealth: activeBotCount > 0 && lowBatteryBots.length === 0 ? 'healthy' : 'warning'
  };
};

const SystemMetrics: React.FC<SystemMetricsProps> = ({ robots, packages }) => {
  const metrics = useSystemMetrics(robots, packages);
  
  return (
    <div className="text-xs text-gray-500">
      Active: {metrics.activeBotCount} | Charging: {metrics.chargingBotCount} | 
      Processing: {metrics.processingPackageCount} | Avg Battery: {metrics.averageBatteryLevel}%
    </div>
  );
};

export default SystemMetrics;
