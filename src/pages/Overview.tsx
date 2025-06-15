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
import { Button } from '@/components/ui/button';
import { Play, Pause, AlertTriangle } from 'lucide-react';

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

  const handleStart = () => {
    console.log('System started');
    // Add start system logic here
  };

  const handlePause = () => {
    console.log('System paused');
    // Add pause system logic here
  };

  const handleEmergencyStop = () => {
    console.log('Emergency stop activated');
    // Add emergency stop logic here
  };

  // Dynamically compute botActive based on real data
  const activeBotCount = robots.filter(r => r.status === 'active').length;
  const totalBotCount = robots.length;
  const systemOverview = {
    botActive: `${activeBotCount}/${totalBotCount}`,
    cvRunning: '4/4',
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

  // Map switches to the expected format for SwitchStatusCard
  const mappedSwitches = Object.keys(switches).reduce((acc, key) => {
    const rowIndex = parseInt(key);
    const rowSwitches = switches[rowIndex];
    
    acc[rowIndex] = {
      entry: rowSwitches.entry.map(sw => ({
        id: sw.id,
        status: sw.state,
        side: sw.side
      })),
      exit: rowSwitches.exit.map(sw => ({
        id: sw.id,
        status: sw.state,
        side: sw.side
      }))
    };
    
    return acc;
  }, {} as { [rowIndex: number]: { entry: { id: string; status: boolean; side: 'left' | 'right' }[]; exit: { id: string; status: boolean; side: 'left' | 'right' }[] } });

  // Map packages to the expected format for PackageTable
  const mappedPackages = packages.map(pkg => ({
    uid: pkg.uid,
    botAssigned: pkg.botAssigned,
    destination: pkg.destination,
    status: pkg.status === 'processing' ? 'processing' as const :
             pkg.status === 'completed' ? 'completed' as const :
             'pending' as const,
    timestamp: pkg.timestamp
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-1">
      <div className="max-w-7xl mx-auto">
        {/* Control Buttons */}
        <div className="mb-1 flex items-center gap-2 h-8">
          <Button 
            onClick={handleStart}
            className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
          >
            <Play className="w-3 h-3 mr-1" />
            Start
          </Button>
          <Button 
            onClick={handlePause}
            variant="outline"
            className="h-7 px-3 text-xs"
          >
            <Pause className="w-3 h-3 mr-1" />
            Pause
          </Button>
          <Button 
            onClick={handleEmergencyStop}
            variant="destructive"
            className="h-7 px-3 text-xs"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Emergency Stop
          </Button>
        </div>

        {/* Top row - System and Infeed Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 mb-1">
          <SystemOverviewCard {...systemOverview} />
          <InfeedOverviewCard {...infeedOverview} />
          <CurrentPackageCard {...currentPackage} />
          <BatteryStatusCard robots={robots} />
        </div>

        {/* Middle row - Robot Visualization and Switch Status */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-1 mb-1">
          <div className="xl:col-span-2">
            <RobotVisualization robots={robots} totalRows={TOTAL_ROWS} />
          </div>
          <div className="xl:col-span-1">
            <SwitchStatusCard totalRows={TOTAL_ROWS} switches={mappedSwitches} />
          </div>
        </div>

        {/* Bottom row - Package Table and Bin Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-1">
          <PackageTable packages={mappedPackages} />
          <BinGrid bins={bins} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
