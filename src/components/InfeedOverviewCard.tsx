
import React from "react";
import { Card } from "@/components/ui/card";

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
}) => (
  <Card className="p-3 bg-blue-50 border-blue-300 max-w-full h-full">
    {/* Reduced padding for smaller card */}
    <h3 className="text-base font-bold text-blue-900 mb-1">Infeed Overview</h3>
    <ul className="space-y-0.5 text-xs text-gray-800">
      <li>
        <span className="font-semibold">Infeed CV Status:</span> {cvStatus}
      </li>
      <li>
        <span className="font-semibold">Infeed CV Speed:</span> {cvSpeed}
      </li>
      <li>
        <span className="font-semibold">Cognex Camera Status:</span> {camStatus}
      </li>
      <li>
        <span className="font-semibold">Profiler Status:</span> {profilerStatus}
      </li>
      <li>
        <span className="font-semibold">Merger CV Status:</span> {mergerCvStatus}
      </li>
      <li>
        <span className="font-semibold">Merger Speed:</span> {mergerSpeed}
      </li>
    </ul>
  </Card>
);

export default InfeedOverviewCard;
