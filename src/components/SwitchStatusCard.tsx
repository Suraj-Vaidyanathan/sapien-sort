
import React from 'react';
import { Card } from '@/components/ui/card';

interface Switch {
  id: string;
  status: boolean;
  side: 'left' | 'right';
}

interface SwitchStatusCardProps {
  totalRows: number;
  switches: { [rowIndex: number]: { entry: Switch[]; exit: Switch[] } };
}

const SwitchStatusCard: React.FC<SwitchStatusCardProps> = ({ totalRows, switches }) => {
  const getRowLabel = (rowIndex: number) => {
    return `Layer ${rowIndex}`;
  };

  const getCurrentValue = (status: boolean) => {
    return status ? `${(Math.random() * 2 + 1).toFixed(1)}A` : '0.0A';
  };

  const SwitchIcon: React.FC<{ status: boolean; side: 'left' | 'right' }> = ({ status, side }) => (
    <div className={`flex flex-col items-center space-y-0.5 px-2 py-1 rounded ${status ? 'bg-green-100' : 'bg-red-100'}`}>
      <div className="flex items-center space-x-0.5">
        <span className={`w-1 h-1 inline-block rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={`text-sm font-medium ${status ? 'text-green-700' : 'text-red-700'}`}>
          {side === 'left' ? 'L' : 'R'}
        </span>
      </div>
      <span className="text-sm text-gray-600">{getCurrentValue(status)}</span>
    </div>
  );

  return (
    <Card className="p-3">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Gate Switch Status</h3>
      <div className="space-y-2">
        {Array.from({ length: totalRows }, (_, rowIndex) => {
          const rowSwitches = switches[rowIndex] || { entry: [], exit: [] };
          const entryStatus = rowSwitches.entry.length > 0 ? rowSwitches.entry[0].status : false;
          const exitStatus = !entryStatus;

          return (
            <div key={rowIndex} className="flex items-center justify-between px-2 py-1 bg-gray-50 rounded">
              <div className="w-16 text-sm font-medium text-gray-700">
                {getRowLabel(rowIndex)}
              </div>
              <div className="flex items-center space-x-4 flex-1 justify-end">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600 mb-1">Entry</span>
                  <div className="flex space-x-1">
                    <SwitchIcon status={entryStatus} side="left" />
                    <SwitchIcon status={entryStatus} side="right" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600 mb-1">Exit</span>
                  <div className="flex space-x-1">
                    <SwitchIcon status={exitStatus} side="left" />
                    <SwitchIcon status={exitStatus} side="right" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SwitchStatusCard;
