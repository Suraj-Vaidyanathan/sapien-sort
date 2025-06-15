
import React from 'react';
import { Card } from '@/components/ui/card';
import { Package, Bot, MapPin, Clock } from 'lucide-react';

interface PackageInfo {
  uid: string;
  botAssigned: string | null;
  destination: string;
  status: 'processing' | 'completed' | 'pending';
  timestamp: string;
}

interface PackageTableProps {
  packages: PackageInfo[];
}

const PackageTable: React.FC<PackageTableProps> = ({ packages }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-3">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Package Information</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 font-medium text-gray-700 text-xs">
                <div className="flex items-center space-x-1">
                  <Package className="w-3 h-3" />
                  <span>Package UID</span>
                </div>
              </th>
              <th className="text-left py-2 px-2 font-medium text-gray-700 text-xs">
                <div className="flex items-center space-x-1">
                  <Bot className="w-3 h-3" />
                  <span>Bot</span>
                </div>
              </th>
              <th className="text-left py-2 px-2 font-medium text-gray-700 text-xs">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Dest</span>
                </div>
              </th>
              <th className="text-left py-2 px-2 font-medium text-gray-700 text-xs">Status</th>
              <th className="text-left py-2 px-2 font-medium text-gray-700 text-xs">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Time</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {packages.slice(0, 4).map(pkg => (
              <tr key={pkg.uid} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">
                  <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{pkg.uid}</code>
                </td>
                <td className="py-2 px-2">
                  {pkg.botAssigned ? (
                    <span className="text-blue-600 font-medium text-xs">{pkg.botAssigned}</span>
                  ) : (
                    <span className="text-gray-400 text-xs">Unassigned</span>
                  )}
                </td>
                <td className="py-2 px-2">
                  <span className="font-medium text-xs">{pkg.destination}</span>
                </td>
                <td className="py-2 px-2">
                  <span className={`px-1 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                    {pkg.status}
                  </span>
                </td>
                <td className="py-2 px-2 text-xs text-gray-600">{pkg.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {packages.length === 0 && (
          <div className="text-center py-4">
            <Package className="w-8 h-8 text-gray-400 mx-auto mb-1" />
            <p className="text-gray-500 text-xs">No packages to display</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PackageTable;
