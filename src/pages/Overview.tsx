
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

const TOTAL_ROWS = 5;

const Overview = () => {
  const {
    systemStatus,
    currentPackage,
    robots,
    switches,
    packages,
    bins,
  } = useRealtimeData();

  const activeBotCount = robots.filter(r => r.status === 'active').length;
  const totalBotCount = robots.length;
  const systemOverview = {
    botActive: `${activeBotCount}/${totalBotCount}`,
    cvRunning: `${TOTAL_ROWS}/${TOTAL_ROWS}`,
    networkStatus: 'Online',
    wcsStatus: 'Healthy',
    wmsStatus: 'Healthy',
    plcStatus: 'Healthy',
    warnings: 'Healthy',
  };

  const infeedOverview = {
    cvStatus: 'Healthy',
    cvSpeed: '0.8 m/s',
    camStatus: 'Healthy',
    profilerStatus: 'Healthy',
    mergerCvStatus: 'Healthy',
    mergerSpeed: '1 m/s',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-2">
      <div
        className="
          w-full
          max-w-screen-xl
          flex flex-col
          gap-2
          justify-center
          mx-auto
          "
        style={{ height: '100vh', minHeight: 0 }}
      >
        {/* 1st row: Overview cards - smaller paddings, tighter */}
        <div className="grid grid-cols-2 gap-2" style={{ height: '12%' }}>
          <SystemOverviewCard {...systemOverview} />
          <InfeedOverviewCard {...infeedOverview} />
        </div>
        {/* 2nd row: Current Package + Battery Status */}
        <div className="grid grid-cols-4 gap-2" style={{ height: '18%' }}>
          <div className="col-span-3 h-full flex">
            <CurrentPackageCard {...currentPackage} />
          </div>
          <div className="h-full flex">
            <BatteryStatusCard robots={robots} />
          </div>
        </div>
        {/* 3rd row: Bot visualization + Switch */}
        <div className="grid grid-cols-6 gap-2" style={{ height: '26%' }}>
          <div className="col-span-4 h-full flex">
            <RobotVisualization robots={robots} totalRows={TOTAL_ROWS} />
          </div>
          <div className="col-span-2 h-full flex">
            <SwitchStatusCard totalRows={TOTAL_ROWS} switches={switches} />
          </div>
        </div>
        {/* 4th row: Package Table + BinGrid - smaller */}
        <div className="grid grid-cols-2 gap-2" style={{ height: '18%' }}>
          <div className="h-full flex">
            <PackageTable packages={packages} />
          </div>
          <div className="h-full flex">
            <BinGrid bins={bins} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Overview;
