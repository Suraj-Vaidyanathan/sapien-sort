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

const CARD_CLASS = "p-3 bg-blue-50 border-blue-300 rounded shadow max-w-full h-full min-h-0 flex flex-col justify-center";
const GRID_COMMON = "gap-3";

const Overview = () => {
  const {
    systemStatus,
    currentPackage,
    robots,
    switches,
    packages,
    bins,
  } = useRealtimeData();

  const TOTAL_ROWS = 5;
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-2">
      <div className="w-full max-w-screen-xl flex flex-col gap-3" style={{height: '96vh'}}>
        <div className="grid grid-cols-2 gap-3" style={{ height: '13%' }}>
          <SystemOverviewCard {...systemOverview} className={CARD_CLASS} />
          <InfeedOverviewCard {...infeedOverview} className={CARD_CLASS} />
        </div>
        <div className="grid grid-cols-4 gap-3" style={{ height: '17%' }}>
          <CurrentPackageCard {...currentPackage} className={CARD_CLASS + " col-span-3"} />
          <BatteryStatusCard robots={robots} className={CARD_CLASS + " "} />
        </div>
        <div className="grid grid-cols-6 gap-3" style={{ height: '27%' }}>
          <RobotVisualization robots={robots} totalRows={TOTAL_ROWS} className={CARD_CLASS + " col-span-4"} />
          <SwitchStatusCard totalRows={TOTAL_ROWS} switches={switches} className={CARD_CLASS + " col-span-2"} />
        </div>
        <div className="grid grid-cols-2 gap-3" style={{ height: '22%' }}>
          <PackageTable packages={packages} className={CARD_CLASS + " "} />
          <BinGrid bins={bins} className={CARD_CLASS + " "} />
        </div>
      </div>
    </div>
  );
};
export default Overview;
