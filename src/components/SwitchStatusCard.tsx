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

  // Entry: for each row, both L and R always same (mirror value of entry[0] if present, default false)
  // Exit: always logical NOT of entry
  const getSynchronizedEntryStatus = (rowEntry: Switch[]) => {
    if (rowEntry && rowEntry.length > 0) {
      // Find any available switch and use its value
      const referenceStatus = rowEntry[0]?.status ?? false;
      return { left: referenceStatus, right: referenceStatus };
    }
    return { left: false, right: false };
  };

  return (
    <Card className={`h-full w-full flex flex-col justify-center ${className || ''} p-3`}>
      <h3 className="text-base font-semibold text-gray-800 mb-1">Level Gate Switch Status</h3>
      <div className="flex flex-col gap-1 w-full">
        {Array.from({ length: totalRows }, (_, rowIndex) => {
          const rowSwitches = switches[rowIndex] || { entry: [], exit: [] };
          const entryStatus = getSynchronizedEntryStatus(rowSwitches.entry);
          const exitStatus = { left: !entryStatus.left, right: !entryStatus.right };

          return (
            <div key={rowIndex} className="flex items-center justify-between py-1 px-1 bg-gray-50 rounded">
              <div className="w-14 text-xs font-medium text-gray-700">{getRowLabel(rowIndex)}</div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-600">Entry</span>
                  <div className="flex gap-1">
                    <span className={`w-3 h-3 rounded-full flex items-center justify-center ${entryStatus.left ? 'bg-green-400' : 'bg-red-400'}`}>
                      <span className="text-[8px] font-bold text-white">L</span>
                    </span>
                    <span className={`w-3 h-3 rounded-full flex items-center justify-center ${entryStatus.right ? 'bg-green-400' : 'bg-red-400'}`}>
                      <span className="text-[8px] font-bold text-white">R</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-600">Exit</span>
                  <div className="flex gap-1">
                    <span className={`w-3 h-3 rounded-full flex items-center justify-center ${exitStatus.left ? 'bg-green-400' : 'bg-red-400'}`}>
                      <span className="text-[8px] font-bold text-white">L</span>
                    </span>
                    <span className={`w-3 h-3 rounded-full flex items-center justify-center ${exitStatus.right ? 'bg-green-400' : 'bg-red-400'}`}>
                      <span className="text-[8px] font-bold text-white">R</span>
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
