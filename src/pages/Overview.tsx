
import React from 'react';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import SystemStatusCard from '@/components/SystemStatusCard';
import CurrentPackageCard from '@/components/CurrentPackageCard';
import RobotVisualization from '@/components/RobotVisualization';
import SwitchStatusCard from '@/components/SwitchStatusCard';
import BatteryStatusCard from '@/components/BatteryStatusCard';
import PackageTable from '@/components/PackageTable';
import BinGrid from '@/components/BinGrid';

const Overview = () => {
  const {
    systemStatus,
    currentPackage,
    robots,
    switches,
    packages,
    bins
  } = useRealtimeData();

  const TOTAL_ROWS = 5; // Configurable: can be easily changed

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
          <p className="text-gray-600 mt-2">Real-time monitoring of robotic package sorting system</p>
        </div>

        {/* Top row - System Status and Current Package */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SystemStatusCard {...systemStatus} />
          <CurrentPackageCard {...currentPackage} />
        </div>

        {/* Second row - Robot Visualization and Switch Status */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <RobotVisualization robots={robots} totalRows={TOTAL_ROWS} />
          <SwitchStatusCard totalRows={TOTAL_ROWS} switches={switches} />
        </div>

        {/* Third row - Battery Status */}
        <div className="mb-6">
          <BatteryStatusCard robots={robots} />
        </div>

        {/* Fourth row - Package Table */}
        <div className="mb-6">
          <PackageTable packages={packages} />
        </div>

        {/* Fifth row - Bin Grid */}
        <div className="mb-6">
          <BinGrid bins={bins} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
