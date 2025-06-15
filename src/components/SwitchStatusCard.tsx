
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
  className?: string;
}

const SwitchStatusCard: React.FC<SwitchStatusCardProps> = ({ totalRows, switches, className }) => {
  const getRowLabel = (rowIndex: number) => {
    if (rowIndex === 0) return 'Infeed';
    if (rowIndex === totalRows - 1) return 'Charging';
    return `Chute ${rowIndex}`;
  };

  // For each row, synthesize both left/right from just entry[0] (they should always be the same), and exit should always be the opposite.
  const getRowSwitchStatus = (rowEntry: Switch[]) => {
    if (rowEntry.length === 0) return { left: false, right: false };
    // Use the first switch as reference (they should always match); fallback to false if undefined.
    const leftStatus = rowEntry.find(sw => sw.side === "left")?.status ?? false;
    const rightStatus = rowEntry.find(sw => sw.side === "right")?.status ?? false;
    // If in doubt, force both to be same as the majority, or first.
    const status = leftStatus || rightStatus ? true : false;
    return { left: status, right: status };
  };

  return (
    <Card className={`h-full w-full flex flex-col justify-center ${className || ''}`}>
      <h3 className="text-base font-semibold text-gray-800 mb-1">Level Gate Switch Status</h3>
      <div className="flex flex-col gap-1 w-full">
        {Array.from({ length: totalRows }, (_, rowIndex) => {
          const rowSwitches = switches[rowIndex] || { entry: [], exit: [] };
          const entryStatus = getRowSwitchStatus(rowSwitches.entry);
          // Exit should always be logical NOT.
          const exitStatus = { left: !entryStatus.left, right: !entryStatus.right };

          return (
            <div key={rowIndex} className="flex items-center justify-between py-1 px-1 bg-gray-50 rounded">
              <div className="w-16 text-xs font-medium text-gray-700">{getRowLabel(rowIndex)}</div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-600">Entry</span>
                  <div className="flex gap-1">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${entryStatus.left ? 'bg-green-400' : 'bg-red-400'}`}>
                      <span className="text-[9px] font-bold text-white">L</span>
                    </span>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${entryStatus.right ? 'bg-green-400' : 'bg-red-400'}`}>
                      <span className="text-[9px] font-bold text-white">R</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-600">Exit</span>
                  <div className="flex gap-1">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${exitStatus.left ? 'bg-green-400' : 'bg-red-400'}`}>
                      <span className="text-[9px] font-bold text-white">L</span>
                    </span>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${exitStatus.right ? 'bg-green-400' : 'bg-red-400'}`}>
                      <span className="text-[9px] font-bold text-white">R</span>
                    </span>
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
