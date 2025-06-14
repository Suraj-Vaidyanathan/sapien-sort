
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
    <Card className="p-6 bg-blue-50 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Current Package</h3>
        <Package className="w-6 h-6 text-blue-600" />
      </div>
      
      {packageId ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Package ID:</span>
            <span className="font-mono font-medium">{packageId}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Destination:</span>
            <span className="font-medium text-green-600">{destination}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Assigned Bot:</span>
            <span className="font-medium text-blue-600">{assignedBot}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Current Row:</span>
            <span className="font-medium">Row {currentRow}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">ETA:</span>
            <span className="font-medium text-orange-600">{estimatedTime}</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No package being processed</p>
        </div>
      )}
    </Card>
  );
};

export default CurrentPackageCard;
