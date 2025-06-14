
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
  <Card className="p-5 bg-blue-50 border-blue-300 max-w-md">
    <h3 className="text-lg font-bold text-blue-900 mb-2">Infeed Overview</h3>
    <ul className="space-y-1 text-sm text-gray-800">
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
