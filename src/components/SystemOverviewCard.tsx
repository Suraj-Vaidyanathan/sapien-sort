
import React from "react";
import { Card } from "@/components/ui/card";

interface SystemOverviewCardProps {
  botActive: string;
  cvRunning: string;
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
  <Card className="p-3 bg-blue-50 border-blue-300">
    <h3 className="text-sm font-bold text-blue-900 mb-2">System Overview</h3>
    <ul className="space-y-1 text-xs text-gray-800">
      <li>
        <span className="font-semibold">BOT Active:</span> {botActive}
      </li>
      <li>
        <span className="font-semibold">CV Running:</span> {cvRunning}
      </li>
      <li>
        <span className="font-semibold">Network:</span> {networkStatus}
      </li>
      <li>
        <span className="font-semibold">WCS & WMS:</span> {wcsStatus}
      </li>
      <li>
        <span className="font-semibold">WCS & PLC:</span> {plcStatus}
      </li>
      <li>
        <span className="font-semibold">Warnings:</span> {warnings}
      </li>
    </ul>
  </Card>
);

export default SystemOverviewCard;
