
import React from 'react';
import { Card } from '@/components/ui/card';
import { Package, MapPin, Clock, Bot } from 'lucide-react';

interface CurrentPackageCardProps {
  packageId: string | null;
  destination: string | null;
  assignedBot: string | null;
  estimatedTime: string | null;
  currentRow: number | null;
}

const CurrentPackageCard: React.FC<CurrentPackageCardProps> = ({
  packageId,
  destination,
  assignedBot,
  estimatedTime,
  currentRow,
}) => {
  return (
    <Card className="p-3 bg-blue-50 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">Current Package</h3>
        <Package className="w-4 h-4 text-blue-600" />
      </div>
      
      {packageId ? (
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Package className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-600">ID:</span>
            <span className="font-mono font-medium text-xs">{packageId}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-600">Dest:</span>
            <span className="font-medium text-green-600 text-xs">{destination}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Bot className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-600">Bot:</span>
            <span className="font-medium text-blue-600 text-xs">{assignedBot}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-600">Row:</span>
            <span className="font-medium text-xs">Row {currentRow}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-600">ETA:</span>
            <span className="font-medium text-orange-600 text-xs">{estimatedTime}</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <Package className="w-8 h-8 text-gray-400 mx-auto mb-1" />
          <p className="text-gray-500 text-xs">No package being processed</p>
        </div>
      )}
    </Card>
  );
};

export default CurrentPackageCard;
