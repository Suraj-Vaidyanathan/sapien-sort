
import React, { useState, useEffect } from "react";

// Add explicit Robot interface so TypeScript understands array elements
interface Robot {
  id: string;
  name: string;
  currentRow: number;
  status: 'active' | 'idle' | 'charging' | 'error';
  batteryLevel: number;
}

// Simulated real-time data hook
export const useRealtimeData = () => {
  const [data, setData] = useState({
    systemStatus: {
      status: 'online' as 'online' | 'warning' | 'offline',
      packagesProcessed: 1247,
      totalPackages: 1500,
      uptime: '23h 45m',
    },
    currentPackage: {
      packageId: 'PKG-2024-001247',
      destination: 'Bin A3',
      assignedBot: 'RB-04',
      estimatedTime: '2m 30s',
      currentRow: 2,
    },
    robots: [
      { id: '1', name: 'RB-01', currentRow: 0, status: 'active' as const, batteryLevel: 85 },
      { id: '2', name: 'RB-02', currentRow: 2, status: 'active' as const, batteryLevel: 67 },
      { id: '3', name: 'RB-03', currentRow: 4, status: 'charging' as const, batteryLevel: 95 },
      { id: '4', name: 'RB-04', currentRow: 2, status: 'active' as const, batteryLevel: 23 },
    ] as Robot[],
    switches: {
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
    },
    packages: [
      { uid: 'PKG-2024-001247', botAssigned: 'RB-04', destination: 'Bin A3', status: 'processing' as const, timestamp: '14:32:15' },
      { uid: 'PKG-2024-001246', botAssigned: 'RB-02', destination: 'Bin B7', status: 'processing' as const, timestamp: '14:31:58' },
      { uid: 'PKG-2024-001245', botAssigned: null, destination: 'Bin C2', status: 'pending' as const, timestamp: '14:31:42' },
      { uid: 'PKG-2024-001244', botAssigned: 'RB-01', destination: 'Bin A1', status: 'completed' as const, timestamp: '14:31:20' },
      { uid: 'PKG-2024-001243', botAssigned: 'RB-03', destination: 'Bin D5', status: 'completed' as const, timestamp: '14:30:55' },
    ],
    bins: [
      { id: 'A1', location: 'A1', capacity: 50, currentCount: 47, status: 'available' as const },
      { id: 'A2', location: 'A2', capacity: 50, currentCount: 50, status: 'full' as const },
      { id: 'A3', location: 'A3', capacity: 50, currentCount: 23, status: 'available' as const },
      { id: 'B1', location: 'B1', capacity: 50, currentCount: 45, status: 'available' as const },
      { id: 'B2', location: 'B2', capacity: 50, currentCount: 12, status: 'available' as const },
      { id: 'B3', location: 'B3', capacity: 50, currentCount: 0, status: 'maintenance' as const },
      { id: 'C1', location: 'C1', capacity: 50, currentCount: 33, status: 'available' as const },
      { id: 'C2', location: 'C2', capacity: 50, currentCount: 41, status: 'available' as const },
      { id: 'C3', location: 'C3', capacity: 50, currentCount: 18, status: 'available' as const },
      { id: 'D1', location: 'D1', capacity: 50, currentCount: 49, status: 'available' as const },
      { id: 'D2', location: 'D2', capacity: 50, currentCount: 37, status: 'available' as const },
      { id: 'D3', location: 'D3', capacity: 50, currentCount: 28, status: 'available' as const },
    ],
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => ({
        ...prevData,
        systemStatus: {
          ...prevData.systemStatus,
          packagesProcessed: prevData.systemStatus.packagesProcessed + Math.floor(Math.random() * 3),
        },
        robots: (prevData.robots as Robot[]).map((robot) => {
          let newBatteryLevel = robot.batteryLevel;
          let newStatus = robot.status;

          if (robot.status === 'active') {
            newBatteryLevel = robot.batteryLevel - (Math.random() * 1.9 + 0.1);
            if (newBatteryLevel <= 15) {
              newStatus = 'charging';
            }
          } else if (robot.status === 'charging') {
            newBatteryLevel = robot.batteryLevel + (Math.random() * 2.5 + 0.5);
            if (newBatteryLevel >= 100) {
              newBatteryLevel = 100;
              newStatus = 'active'; // exit charging if at 100%
            }
          } else {
            newBatteryLevel = robot.batteryLevel - (Math.random() * 0.45 + 0.05);
          }

          const clampedBatteryLevel = Math.round(Math.max(0, Math.min(100, newBatteryLevel)));

          return {
            ...robot,
            batteryLevel: clampedBatteryLevel,
            status: newStatus,
            currentRow: newStatus === 'active'
              ? Math.floor(Math.random() * 5)
              : newStatus === 'charging'
              ? 4
              : robot.currentRow,
          };
        }),
        bins: prevData.bins.map(bin => ({
          ...bin,
          currentCount: bin.status === 'maintenance' ? bin.currentCount :
            Math.min(bin.capacity, bin.currentCount + (Math.random() > 0.7 ? 1 : 0)),
        })),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return data;
};
