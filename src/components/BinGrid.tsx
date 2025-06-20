
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Box } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';

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
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getBinColor = (bin: Bin) => {
    // Maintenance bins are always red
    if (bin.status === 'maintenance') return 'bg-red-100 border-red-300';
    
    // For available bins, check fill percentage
    const fillPercentage = (bin.currentCount / bin.capacity) * 100;
    
    // Full bins (at capacity) are red
    if (bin.currentCount >= bin.capacity) return 'bg-red-100 border-red-300';
    
    // Nearly full bins (90%+) are yellow
    if (fillPercentage >= 90) return 'bg-yellow-100 border-yellow-300';
    
    // Filling bins (50%+) are blue
    if (fillPercentage >= 50) return 'bg-blue-100 border-blue-300';
    
    // Available bins with low fill are green
    return 'bg-green-100 border-green-300';
  };

  const getBinTextColor = (bin: Bin) => {
    // Maintenance bins are always red text
    if (bin.status === 'maintenance') return 'text-red-700';
    
    // For available bins, check fill percentage
    const fillPercentage = (bin.currentCount / bin.capacity) * 100;
    
    // Full bins (at capacity) are red text
    if (bin.currentCount >= bin.capacity) return 'text-red-700';
    
    // Nearly full bins (90%+) are yellow text
    if (fillPercentage >= 90) return 'text-yellow-700';
    
    // Filling bins (50%+) are blue text
    if (fillPercentage >= 50) return 'text-blue-700';
    
    // Available bins with low fill are green text
    return 'text-green-700';
  };

  const getFillPercentage = (bin: Bin) => {
    return Math.round((bin.currentCount / bin.capacity) * 100);
  };

  const getProgressBarColor = (bin: Bin) => {
    // Maintenance bins have red progress bar
    if (bin.status === 'maintenance') return 'bg-red-500';
    
    const fillPercentage = getFillPercentage(bin);
    
    // Full bins (at capacity) are red
    if (bin.currentCount >= bin.capacity) return 'bg-red-500';
    
    // Nearly full bins (90%+) are yellow
    if (fillPercentage >= 90) return 'bg-yellow-500';
    
    // Filling bins (50%+) are blue
    if (fillPercentage >= 50) return 'bg-blue-500';
    
    // Available bins with low fill are green
    return 'bg-green-500';
  };

  const handleBinClick = (bin: Bin) => {
    setSelectedBin(bin);
    setIsDialogOpen(true);
  };

  const handleToggleBin = async () => {
    if (!selectedBin) return;

    const newStatus = selectedBin.status === 'maintenance' ? 'available' : 'maintenance';
    
    try {
      // When switching from maintenance to available, check if bin should be marked as full
      let finalStatus = newStatus;
      if (newStatus === 'available' && selectedBin.currentCount >= selectedBin.capacity) {
        finalStatus = 'full';
      }

      const { error } = await supabase
        .from('bins')
        .update({ status: finalStatus })
        .eq('id', selectedBin.id);

      if (error) {
        console.error('Error updating bin status:', error);
      }
    } catch (error) {
      console.error('Error toggling bin:', error);
    }

    setIsDialogOpen(false);
    setSelectedBin(null);
  };

  return (
    <Card className="p-3">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Bin Status Grid</h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {bins.map(bin => (
          <div
            key={bin.id}
            className={`p-2 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${getBinColor(bin)}`}
            onClick={() => handleBinClick(bin)}
          >
            <div className="flex flex-col items-center space-y-1">
              <Box className={`w-4 h-4 ${getBinTextColor(bin)}`} />
              
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600">{bin.location}</div>
                <div className={`text-xs font-bold ${getBinTextColor(bin)}`}>
                  {bin.currentCount}/{bin.capacity}
                </div>
                <div className={`text-xs ${getBinTextColor(bin)}`}>
                  {bin.status === 'maintenance' ? 'MAINT' : `${getFillPercentage(bin)}%`}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${getProgressBarColor(bin)}`}
                  style={{ width: `${Math.min(getFillPercentage(bin), 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Filling</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>Nearly Full</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Full/Maint</span>
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Toggle Bin Status</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedBin && (
                <>
                  Are you sure you want to {selectedBin.status === 'maintenance' ? 'enable' : 'disable'} bin {selectedBin.location}?
                  <br />
                  This will change its status from <strong>{selectedBin.status}</strong> to <strong>{selectedBin.status === 'maintenance' ? 'available' : 'maintenance'}</strong>.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedBin(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleBin}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default BinGrid;
