
import React from 'react';
import { useSupabaseRealtimeData } from '@/hooks/useSupabaseRealtimeData';
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
    robots,
    packages,
    bins,
    currentPackage,
    systemStatus,
    loading,
    activeBotCount,
    totalBotCount
  } = useSupabaseRealtimeData();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading system data...</p>
        </div>
      </div>
    );
  }

  // System overview data with real-time information
  const systemOverview = {
    botActive: `${activeBotCount}/${totalBotCount}`,
    cvRunning: '4/4',
    networkStatus: 'Online',
    wcsStatus: 'Healthy',
    wmsStatus: 'Healthy',
    plcStatus: 'Healthy',
    warnings: activeBotCount < totalBotCount ? 'Warning' : 'Healthy',
  };

  const infeedOverview = {
    cvStatus: 'Healthy',
    cvSpeed: '0.8 m/s',
    camStatus: 'Healthy',
    profilerStatus: 'Healthy',
    mergerCvStatus: 'Healthy',
    mergerSpeed: '1 m/s',
  };

  // Mock switches data (since we don't have real switch data in DB yet)
  const mockSwitches = {
    0: {
      entry: [
        { id: 'e0l', status: true, side: 'left' as const },
        { id: 'e0r', status: true, side: 'right' as const },
      ],
      exit: [
        { id: 'x0l', status: true, side: 'left' as const },
        { id: 'x0r', status: false, side: 'right' as const },
      ],
    },
    1: {
      entry: [
        { id: 'e1l', status: true, side: 'left' as const },
        { id: 'e1r', status: true, side: 'right' as const },
      ],
      exit: [
        { id: 'x1l', status: true, side: 'left' as const },
        { id: 'x1r', status: true, side: 'right' as const },
      ],
    },
    2: {
      entry: [
        { id: 'e2l', status: true, side: 'left' as const },
        { id: 'e2r', status: true, side: 'right' as const },
      ],
      exit: [
        { id: 'x2l', status: true, side: 'left' as const },
        { id: 'x2r', status: true, side: 'right' as const },
      ],
    },
    3: {
      entry: [
        { id: 'e3l', status: false, side: 'left' as const },
        { id: 'e3r', status: true, side: 'right' as const },
      ],
      exit: [
        { id: 'x3l', status: true, side: 'left' as const },
        { id: 'x3r', status: true, side: 'right' as const },
      ],
    },
    4: {
      entry: [
        { id: 'e4l', status: true, side: 'left' as const },
        { id: 'e4r', status: true, side: 'right' as const },
      ],
      exit: [
        { id: 'x4l', status: true, side: 'left' as const },
        { id: 'x4r', status: true, side: 'right' as const },
      ],
    },
  };

  // Transform robots data to match existing interface
  const transformedRobots = robots.map(robot => ({
    id: robot.id,
    name: robot.name,
    currentRow: robot.current_row,
    status: robot.status as 'active' | 'idle' | 'charging' | 'error',
    batteryLevel: robot.battery_level
  }));

  // Transform packages data
  const transformedPackages = packages.map(pkg => ({
    uid: pkg.uid,
    botAssigned: pkg.bot_assigned,
    destination: pkg.destination || 'Unknown',
    status: pkg.status as 'processing' | 'completed' | 'pending',
    timestamp: new Date(pkg.timestamp).toLocaleTimeString()
  }));

  // Transform bins data
  const transformedBins = bins.map(bin => ({
    id: bin.id,
    location: bin.location,
    capacity: bin.capacity,
    currentCount: bin.current_count,
    status: bin.status as 'available' | 'full' | 'maintenance'
  }));

  // Transform current package data
  const transformedCurrentPackage = currentPackage ? {
    packageId: currentPackage.uid,
    destination: currentPackage.destination,
    assignedBot: currentPackage.bot_assigned,
    estimatedTime: '2m 30s', // Mock value
    currentRow: transformedRobots.find(r => r.name === currentPackage.bot_assigned)?.currentRow || 0
  } : {
    packageId: null,
    destination: null,
    assignedBot: null,
    estimatedTime: null,
    currentRow: null
  };

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
          <CurrentPackageCard {...transformedCurrentPackage} />
          <BatteryStatusCard robots={transformedRobots} />
        </div>

        {/* Middle row - Robot Visualization and Switch Status */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-1 mb-1">
          <div className="xl:col-span-2">
            <RobotVisualization robots={transformedRobots} totalRows={TOTAL_ROWS} />
          </div>
          <div className="xl:col-span-1">
            <SwitchStatusCard totalRows={TOTAL_ROWS} switches={mockSwitches} />
          </div>
        </div>

        {/* Bottom row - Package Table and Bin Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-1">
          <PackageTable packages={transformedPackages} />
          <BinGrid bins={transformedBins} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
