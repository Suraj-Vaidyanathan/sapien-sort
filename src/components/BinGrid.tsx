import React from 'react';
import { Card } from '@/components/ui/card';

interface BinGridProps {
  bins: { [key: string]: string };
}

const BinGrid: React.FC<BinGridProps> = ({ bins }) => {
  const binCount = Object.keys(bins).length;
  const rows = 4;
  const cols = Math.ceil(binCount / rows);

  const grid = [];
  let binIndex = 0;

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      if (binIndex < binCount) {
        const binId = `bin${binIndex + 1}`;
        row.push(
          <div key={binId} className="p-2 border rounded flex items-center justify-center">
            {bins[binId] || binId}
          </div>
        );
        binIndex++;
      } else {
        row.push(<div key={`empty-${i}-${j}`} />);
      }
    }
    grid.push(<div key={`row-${i}`} className="flex">{row}</div>);
  }

  return (
    <Card className="p-3 h-full">
      <h3 className="text-base font-semibold text-gray-800 mb-2">Bin Grid</h3>
      <div className="grid gap-1">
        {grid}
      </div>
    </Card>
  );
};

export default BinGrid;
