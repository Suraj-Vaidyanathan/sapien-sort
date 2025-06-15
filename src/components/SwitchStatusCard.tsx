
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
    if (rowIndex === 0) return 'Infeed';
    if (rowIndex === totalRows - 1) return 'Charging';
    return `Chute ${rowIndex}`;
  };

  const SwitchIcon: React.FC<{ status: boolean; side: 'left' | 'right' }> = ({ status, side }) => (
    <div className={`flex items-center space-x-1 px-2 py-1 rounded ${status ? 'bg-green-100' : 'bg-red-100'}`}>
      {status ? (
        <span className="w-2 h-2 inline-block rounded-full bg-green-500" />
      ) : (
        <span className="w-2 h-2 inline-block rounded-full bg-red-500" />
      )}
      <span className={`text-xs font-medium ${status ? 'text-green-700' : 'text-red-700'}`}>
        {side.toUpperCase()}
      </span>
    </div>
  );

  return (
    <Card className="p-3">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Level Gate Switch Status</h3>
      <div className="space-y-2">
        {Array.from({ length: totalRows }, (_, rowIndex) => {
          const rowSwitches = switches[rowIndex] || { entry: [], exit: [] };
          
          // For each row, both left and right switches should have the same value
          // Entry and exit should be opposites
          const entryStatus = rowSwitches.entry.length > 0 ? rowSwitches.entry[0].status : false;
          const exitStatus = !entryStatus; // Exit is opposite of entry

          return (
            <div key={rowIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="w-16 text-xs font-medium text-gray-700">
                {getRowLabel(rowIndex)}
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-xs text-gray-600">Entry</span>
                  <div className="flex space-x-1">
                    <SwitchIcon status={entryStatus} side="left" />
                    <SwitchIcon status={entryStatus} side="right" />
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-xs text-gray-600">Exit</span>
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
