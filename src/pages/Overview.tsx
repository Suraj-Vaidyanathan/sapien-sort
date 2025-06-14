
import React from 'react';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import SystemOverviewCard from '@/components/SystemOverviewCard';
import InfeedOverviewCard from '@/components/InfeedOverviewCard';
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
    bins,
    chutes,
    botActive,
    cvRunning,
    infeedOverview,
    totalRows,
  } = useRealtimeData();

  // Use human-readable/DB-provided metrics everywhere
  const systemOverview = {
    botActive: botActive,
    cvRunning: cvRunning,
    networkStatus: 'Online',
    wcsStatus: 'Healthy',
    wmsStatus: 'Healthy',
    plcStatus: 'Healthy',
    warnings: 'Healthy',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
          <p className="text-gray-600 mt-2">
            Real-time monitoring of robotic package sorting system
          </p>
        </div>

        {/* Overview Row - System and Infeed Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <SystemOverviewCard {...systemOverview} />
          <InfeedOverviewCard {...infeedOverview} />
        </div>

        {/* Top row - Current Package */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CurrentPackageCard {...currentPackage} />
          <BatteryStatusCard robots={robots} />
        </div>

        {/* Robot Visualization and Switch Status */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <RobotVisualization robots={robots} totalRows={totalRows} />
          <SwitchStatusCard totalRows={totalRows} switches={switches} />
        </div>

        {/* Package Table */}
        <div className="mb-6">
          <PackageTable packages={packages} />
        </div>

        {/* Bin Grid */}
        <div className="mb-6">
          <BinGrid bins={bins} />
        </div>
      </div>
    </div>
  );
};
export default Overview;
