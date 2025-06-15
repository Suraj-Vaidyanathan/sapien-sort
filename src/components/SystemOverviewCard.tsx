
import React from "react";
import { Card } from "@/components/ui/card";

interface SystemOverviewCardProps {
  botActive: string; // e.g., '11/11'
  cvRunning: string; // e.g., '4/4'
  networkStatus: string;
  wcsStatus: string;
  wmsStatus: string;
  plcStatus: string;
  warnings: string;
}

const SystemOverviewCard: React.FC<SystemOverviewCardProps> = ({
  botActive,
  cvRunning,
  networkStatus,
  wcsStatus,
  wmsStatus,
  plcStatus,
  warnings,
}) => (
  <Card className="p-3 bg-blue-50 border-blue-300 max-w-full h-full">
    {/* Reduced padding for smaller card */}
    <h3 className="text-base font-bold text-blue-900 mb-1">System Overview</h3>
    <ul className="space-y-0.5 text-xs text-gray-800">
      <li>
        <span className="font-semibold">BOT Active:</span> {botActive}
      </li>
      <li>
        <span className="font-semibold">CV Running:</span> {cvRunning}
      </li>
      <li>
        <span className="font-semibold">Network Status:</span> {networkStatus}
      </li>
      <li>
        <span className="font-semibold">WCS &amp; WMS Comm.:</span> {wcsStatus}
      </li>
      <li>
        <span className="font-semibold">WCS &amp; PLC Comm.:</span> {plcStatus}
      </li>
      <li>
        <span className="font-semibold">Warning &amp; Errors:</span> {warnings}
      </li>
    </ul>
  </Card>
);

export default SystemOverviewCard;
