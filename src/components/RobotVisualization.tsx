import React from 'react';
import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';

interface Robot {
  id: string;
  name: string;
  currentRow: number;
  status: 'active' | 'idle' | 'charging' | 'error';
  batteryLevel: number;
}

interface RobotVisualizationProps {
  robots: Robot[];
  totalRows: number;
}

const RobotVisualization: React.FC<RobotVisualizationProps> = ({ robots, totalRows }) => {
  const getRowLabel = (rowIndex: number) => {
    if (rowIndex === 0) return 'Infeed';
    if (rowIndex === totalRows - 1) return 'Charging';
    return `Chute ${rowIndex}`;
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

  const getRobotsInRow = (rowIndex: number) => {
    return robots.filter(robot => robot.currentRow === rowIndex);
  };

  return (
    <Card className="p-3 h-full">
      <h3 className="text-base font-semibold text-gray-800 mb-2">Robot Positions</h3>
      
      <div className="space-y-2">
        {Array.from({ length: totalRows }, (_, rowIndex) => {
          const robotsInRow = getRobotsInRow(rowIndex);
          
          return (
            <div key={rowIndex} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <div className="w-16 text-xs font-medium text-gray-700">
                {getRowLabel(rowIndex)}
              </div>
              
              <div className="flex-1 flex items-center space-x-1 min-h-[24px]">
                {robotsInRow.length > 0 ? (
                  robotsInRow.map(robot => (
                    <div
                      key={robot.id}
                      className="flex items-center space-x-1 px-2 py-0.5 bg-white rounded-full shadow-sm border"
                      title={`${robot.name} - ${robot.status} - ${robot.batteryLevel}%`}
                    >
                      <div className={`w-2 h-2 rounded-full ${getRobotColor(robot.status)}`} />
                      <Bot className="w-3 h-3 text-gray-600" />
                      <span className="text-xs">{robot.name}</span>
                      <span className="text-[10px] text-gray-500">{robot.batteryLevel}%</span>
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
      
      <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Active</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>Idle</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Charging</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Error</span>
        </div>
      </div>
    </Card>
  );
};

export default RobotVisualization;
