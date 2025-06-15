
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
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Information</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Package UID</span>
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <span>Bot Assigned</span>
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Destination</span>
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Timestamp</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <tr key={pkg.uid} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{pkg.uid}</code>
                </td>
                <td className="py-3 px-4">
                  {pkg.botAssigned ? (
                    <span className="text-blue-600 font-medium">{pkg.botAssigned}</span>
                  ) : (
                    <span className="text-gray-400">Unassigned</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium">{pkg.destination}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                    {pkg.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{pkg.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {packages.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No packages to display</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PackageTable;
