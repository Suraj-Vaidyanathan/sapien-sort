
import React from 'react';
import { Card } from '@/components/ui/card';
import { Box } from 'lucide-react';

interface Bin {
  id: string;
  location: string;
  capacity: number;
  currentCount: number;
  status: 'available' | 'full' | 'maintenance';
}

interface BinGridProps {
  bins: Bin[];
}

const BinGrid: React.FC<BinGridProps> = ({ bins }) => {
  const getBinColor = (bin: Bin) => {
    if (bin.status === 'maintenance') return 'bg-red-100 border-red-300';
    if (bin.status === 'full') return 'bg-red-100 border-red-300';
    
    const fillPercentage = (bin.currentCount / bin.capacity) * 100;
    if (fillPercentage >= 90) return 'bg-yellow-100 border-yellow-300';
    if (fillPercentage >= 50) return 'bg-blue-100 border-blue-300';
    return 'bg-green-100 border-green-300';
  };

  const getBinTextColor = (bin: Bin) => {
    if (bin.status === 'maintenance') return 'text-red-700';
    if (bin.status === 'full') return 'text-red-700';
    
    const fillPercentage = (bin.currentCount / bin.capacity) * 100;
    if (fillPercentage >= 90) return 'text-yellow-700';
    if (fillPercentage >= 50) return 'text-blue-700';
    return 'text-green-700';
  };

  const getFillPercentage = (bin: Bin) => {
    return Math.round((bin.currentCount / bin.capacity) * 100);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bin Status Grid</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {bins.map(bin => (
          <div
            key={bin.id}
            className={`p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getBinColor(bin)}`}
          >
            <div className="flex flex-col items-center space-y-2">
              <Box className={`w-6 h-6 ${getBinTextColor(bin)}`} />
              
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600">{bin.location}</div>
                <div className={`text-sm font-bold ${getBinTextColor(bin)}`}>
                  {bin.currentCount}/{bin.capacity}
                </div>
                <div className={`text-xs ${getBinTextColor(bin)}`}>
                  {bin.status === 'maintenance' ? 'MAINT' : `${getFillPercentage(bin)}%`}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    bin.status === 'maintenance' ? 'bg-red-500' :
                    bin.status === 'full' ? 'bg-red-500' :
                    getFillPercentage(bin) >= 90 ? 'bg-yellow-500' :
                    getFillPercentage(bin) >= 50 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(getFillPercentage(bin), 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Available (&lt;50%)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Filling (50-89%)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Nearly Full (90-99%)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Full/Maintenance</span>
        </div>
      </div>
    </Card>
  );
};

export default BinGrid;
