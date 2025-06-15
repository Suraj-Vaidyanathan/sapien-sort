
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

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

  // If entry is open, exit is closed and vice versa (simulate typical interlock logic)
  const getToggleStatus = (entry: Switch[], exit: Switch[]) => {
    return entry.map((entrySw, idx) => {
      const controlledEntry = entrySw.status;
      // Exit is the opposite
      const controlledExit = !controlledEntry;
      return { entry: controlledEntry, exit: controlledExit, side: entrySw.side, id: entrySw.id };
    });
  };

  const SwitchIcon: React.FC<{ status: boolean; side: 'left' | 'right' }> = ({ status, side }) => (
    <div className={`flex items-center space-x-1 px-2 py-1 rounded ${status ? 'bg-green-100' : 'bg-red-100'}`}>
      {status ? (
        <span className="w-3 h-3 inline-block rounded-full bg-green-500" />
      ) : (
        <span className="w-3 h-3 inline-block rounded-full bg-red-500" />
      )}
      <span className={`text-xs font-medium ${status ? 'text-green-700' : 'text-red-700'}`}>
        {side.toUpperCase()}
      </span>
    </div>
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Level Gate Switch Status</h3>
      <div className="space-y-3">
        {Array.from({ length: totalRows }, (_, rowIndex) => {
          const rowSwitches = switches[rowIndex] || { entry: [], exit: [] };
          // recalculated switches
          const toggledSwitches = getToggleStatus(rowSwitches.entry, rowSwitches.exit);

          return (
            <div key={rowIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="w-20 text-sm font-medium text-gray-700">
                {getRowLabel(rowIndex)}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-xs text-gray-600">Entry</span>
                  <div className="flex space-x-1">
                    {toggledSwitches.map(sw => (
                      <SwitchIcon key={sw.id} status={sw.entry} side={sw.side} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-xs text-gray-600">Exit</span>
                  <div className="flex space-x-1">
                    {toggledSwitches.map(sw => (
                      <SwitchIcon key={sw.id + "-exit"} status={sw.exit} side={sw.side} />
                    ))}
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
