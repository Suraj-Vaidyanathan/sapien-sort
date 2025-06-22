
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Box } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const [localBins, setLocalBins] = useState(bins);
  const [pendingToggle, setPendingToggle] = useState<{ bin: Bin; newEnabled: boolean } | null>(null);

  const getBinColor = (bin: Bin) => {
    if (bin.status === 'maintenance') return 'bg-red-100 border-red-300';
    
    const fillPercentage = (bin.currentCount / bin.capacity) * 100;
    
    if (bin.currentCount >= bin.capacity) return 'bg-red-100 border-red-300';
    if (fillPercentage >= 50) return 'bg-blue-100 border-blue-300';
    return 'bg-green-100 border-green-300';
  };

  const getBinTextColor = (bin: Bin) => {
    if (bin.status === 'maintenance') return 'text-red-700';
    
    const fillPercentage = (bin.currentCount / bin.capacity) * 100;
    
    if (bin.currentCount >= bin.capacity) return 'text-red-700';
    if (fillPercentage >= 50) return 'text-blue-700';
    return 'text-green-700';
  };

  const getFillPercentage = (bin: Bin) => {
    return Math.round((bin.currentCount / bin.capacity) * 100);
  };

  const getProgressBarColor = (bin: Bin) => {
    if (bin.status === 'maintenance') return 'bg-red-500';
    
    const fillPercentage = getFillPercentage(bin);
    
    if (bin.currentCount >= bin.capacity) return 'bg-red-500';
    if (fillPercentage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getFillStatusLabel = (bin: Bin) => {
    const fillPercentage = getFillPercentage(bin);
    
    if (bin.currentCount >= bin.capacity) return 'Full';
    if (fillPercentage >= 50) return 'Filling';
    return 'Available';
  };

  const handleSwitchToggle = (bin: Bin, newEnabled: boolean) => {
    setPendingToggle({ bin, newEnabled });
  };

  const confirmSwitchToggle = async () => {
    if (!pendingToggle) return;

    const { bin, newEnabled } = pendingToggle;
    const newStatus = newEnabled ? 'available' : 'maintenance';
    
    // Update local state
    setLocalBins(prev => prev.map(b => 
      b.id === bin.id ? { ...b, status: newStatus as 'available' | 'full' | 'maintenance' } : b
    ));

    setPendingToggle(null);
  };

  return (
    <Card className="p-3">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Bin Status Grid</h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {localBins.map(bin => (
          <div
            key={bin.id}
            className={`p-2 rounded-lg border transition-all duration-200 hover:shadow-md ${getBinColor(bin)}`}
          >
            <div className="flex flex-col items-center space-y-1">
              <Box className={`w-4 h-4 ${getBinTextColor(bin)}`} />
              
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600">{bin.location}</div>
                <div className={`text-xs font-bold ${getBinTextColor(bin)}`}>
                  {bin.currentCount}/{bin.capacity}
                </div>
                <div className={`text-xs ${getBinTextColor(bin)}`}>
                  {getFillStatusLabel(bin)}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${getProgressBarColor(bin)}`}
                  style={{ width: `${Math.min(getFillPercentage(bin), 100)}%` }}
                />
              </div>

              <div className="flex items-center space-x-1 pt-1">
                <span className="text-xs text-gray-600">
                  {bin.status === 'maintenance' ? 'Disabled' : 'Enabled'}
                </span>
                <Switch
                  checked={bin.status !== 'maintenance'}
                  onCheckedChange={(checked) => handleSwitchToggle(bin, checked)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Filling</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Full</span>
        </div>
      </div>

      <AlertDialog open={!!pendingToggle} onOpenChange={() => setPendingToggle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Toggle Bin Status</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingToggle && (
                <>
                  Are you sure you want to {pendingToggle.newEnabled ? 'enable' : 'disable'} bin {pendingToggle.bin.location}?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingToggle(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSwitchToggle}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default BinGrid;
