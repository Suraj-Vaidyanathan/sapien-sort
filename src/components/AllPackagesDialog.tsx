
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Package, Bot, MapPin, Clock, Eye } from 'lucide-react';

interface PackageInfo {
  uid: string;
  botAssigned: string | null;
  destination: string;
  status: 'processing' | 'completed' | 'pending';
  timestamp: string;
}

interface AllPackagesDialogProps {
  packages: PackageInfo[];
}

const AllPackagesDialog: React.FC<AllPackagesDialogProps> = ({ packages }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedPackages = [...packages].sort((a, b) => {
    // Sort by status priority (processing first, then pending, then completed)
    const statusPriority = { processing: 0, pending: 1, completed: 2 };
    const aPriority = statusPriority[a.status] || 3;
    const bPriority = statusPriority[b.status] || 3;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // Then sort by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
          <Eye className="w-3 h-3 mr-1" />
          View All
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>All Package Records ({packages.length})</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center space-x-1">
                    <Package className="w-4 h-4" />
                    <span>Package UID</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-1">
                    <Bot className="w-4 h-4" />
                    <span>Assigned Bot</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Destination</span>
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Timestamp</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPackages.map((pkg) => (
                <TableRow key={pkg.uid} className="hover:bg-gray-50">
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {pkg.uid}
                    </code>
                  </TableCell>
                  <TableCell>
                    {pkg.botAssigned ? (
                      <span className="text-blue-600 font-medium">
                        {pkg.botAssigned}
                      </span>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{pkg.destination}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(pkg.status)}`}>
                      {pkg.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {pkg.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {packages.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No packages found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllPackagesDialog;
