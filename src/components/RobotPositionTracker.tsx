import React from 'react';
import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { console } from 'inspector';

interface Robot {
  id: string;
  name: string;
  currentRow: number;
  status: 'active' | 'idle' | 'charging' | 'error';
  batteryLevel: number;
}

interface RobotPositionTrackerProps {
  robots: Robot[];
  totalRows: number;
}

const RobotPositionTracker: React.FC<RobotPositionTrackerProps> = ({ robots, totalRows }) => {
  const getRowLabel = (rowIndex: number) => {
    return `Layer ${rowIndex}`;
  };

  const getRobotColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'charging': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRowFromSector = (sector: number) => {
    if (sector < 10) return 0;
    if (sector >= 10 && sector <= 20) return 1;
    if (sector >= 21 && sector <= 26) return 0;
    if (sector >= 27 && sector <= 41) return 2;
    if (sector >= 42 && sector <= 54) return 3;
    if (sector >= 55) return 4;
    return 2;
  };

  const getRobotsInRow = (rowIndex: number) => {
    return robots.filter(robot => getRowFromSector(robot.currentRow) === rowIndex);
  };

  return (
    <Card className="p-2 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Robot Positions</h3>
      
      <div className="space-y-1 flex-1">
        {Array.from({ length: totalRows }, (_, rowIndex) => totalRows - 1 - rowIndex).map(rowIndex => {
          const robotsInRow = getRobotsInRow(rowIndex);
          
          return (
            <div key={rowIndex} className="flex items-center space-x-2 px-2 py-1 bg-gray-50 rounded min-h-[32px]">
              <div className="w-12 text-xs font-medium text-gray-700">
                {getRowLabel(rowIndex)}
              </div>
              
              <div className="flex-1 flex items-center space-x-2 min-h-[24px]">
                {robotsInRow.length > 0 ? (
                  robotsInRow.map(robot => (
                    <div
                      key={robot.id}
                      className="flex items-center space-x-1 px-1.5 py-0.5 bg-white rounded shadow-sm border text-xs"
                      title={`${robot.name} - ${robot.status} - ${robot.batteryLevel}%`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${getRobotColor(robot.status)}`} />
                      <Bot className="w-2.5 h-2.5 text-gray-600" />
                      <span className="font-medium">{robot.name}</span>
                      <span className="text-gray-500">{robot.batteryLevel}%</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">No robots</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-2 flex flex-wrap gap-2 text-xs border-t pt-2">
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span>Active</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          <span>Idle</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Charging</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>Error</span>
        </div>
      </div>
    </Card>
  );
};

export default RobotPositionTracker;
