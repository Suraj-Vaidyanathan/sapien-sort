
import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface InfeedOverviewCardProps {
  cvStatus: string;
  cvSpeed: string;
  camStatus: string;
  profilerStatus: string;
  mergerCvStatus: string;
  mergerSpeed: string;
}

const InfeedOverviewCard: React.FC<InfeedOverviewCardProps> = ({
  cvStatus,
  cvSpeed,
  camStatus,
  profilerStatus,
  mergerCvStatus,
  mergerSpeed,
}) => {
  const getStatusColor = (status: string) => {
    if (status === 'Online' || status === 'Active') return 'text-green-600';
    if (status === 'Warning' || status.includes('Warning')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Online' || status === 'Active') return CheckCircle;
    if (status === 'Warning' || status.includes('Warning')) return AlertTriangle;
    return XCircle;
  };

  const StatusItem: React.FC<{ label: string; value: string }> = ({ label, value }) => {
    const Icon = getStatusIcon(value);
    return (
      <li className="flex items-center justify-between">
        <span className="font-semibold text-sm">{label}:</span>
        <div className="flex items-center space-x-1">
          <Icon className={`w-4 h-4 ${getStatusColor(value)}`} />
          <span className={`text-sm ${getStatusColor(value)}`}>{value}</span>
        </div>
      </li>
    );
  };

  const SpeedItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <li className="flex items-center justify-between">
      <span className="font-semibold text-sm">{label}:</span>
      <span className="text-sm text-gray-700">{value}</span>
    </li>
  );

  return (
    <Card className="p-3 bg-blue-50 border-blue-300">
      <h3 className="text-base font-bold text-blue-900 mb-2">Infeed Overview</h3>
      <ul className="space-y-1 text-gray-800">
        <StatusItem label="CV Status" value={cvStatus} />
        <SpeedItem label="CV Speed" value={cvSpeed} />
        <StatusItem label="Camera" value={camStatus} />
        <StatusItem label="Profiler" value={profilerStatus} />
        <StatusItem label="Merger CV" value={mergerCvStatus} />
        <SpeedItem label="Merger Speed" value={mergerSpeed} />
      </ul>
    </Card>
  );
};

export default InfeedOverviewCard;
