
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export interface Robot {
  id: string;
  name: string;
  currentRow: number;
  status: 'active' | 'idle' | 'charging' | 'error';
  batteryLevel: number;
}

export interface Chute {
  id: number;
  label: string;
  cvStatus: 'running' | 'stopped' | 'maintenance' | 'error';
  speed: number;
}

export interface Switch {
  id: string;
  chuteId: number;
  side: 'left' | 'right';
  state: boolean;
}

export interface CVSystem {
  id: number;
  systemType: string;
  status: 'healthy' | 'warning' | 'error';
  speed: number;
}

export interface Package {
  id: string;
  uid: string;
  botAssigned: string | null;
  destination: string | null;
  status: string;
  timestamp: string;
}

export interface Bin {
  id: string;
  location: string;
  capacity: number;
  currentCount: number;
  status: 'available' | 'full' | 'maintenance';
}

export const useRealtimeData = () => {
  // Robots
  const { data: robotsData = [], isLoading: robotsLoading } = useQuery({
    queryKey: ['robots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('robots')
        .select('*');
      if (error) throw error;
      // map snake_case to camelCase
      return data.map((r: any) => ({
        id: r.id,
        name: r.name,
        currentRow: r.current_row,
        status: r.status,
        batteryLevel: r.battery_level
      })) as Robot[];
    },
  });

  // Chutes
  const { data: chutesData = [] } = useQuery({
    queryKey: ['chutes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chutes')
        .select('*');
      if (error) throw error;
      return data.map((c: any) => ({
        id: c.id,
        label: c.label,
        cvStatus: c.cv_status,
        speed: parseFloat(c.speed)
      })) as Chute[];
    }
  });

  // Switches (all switches in DB: left and right per chute)
  const { data: switchesData = [] } = useQuery({
    queryKey: ['switches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('switches')
        .select('*');
      if (error) throw error;
      return data.map((s: any) => ({
        id: s.id,
        chuteId: s.chute_id,
        side: s.side,
        state: s.state
      })) as Switch[];
    }
  });

  // CV systems (for infeed, merger, etc)
  const { data: cvSystemsData = [] } = useQuery({
    queryKey: ['cv_systems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cv_systems')
        .select('*');
      if (error) throw error;
      return data.map((c: any) => ({
        id: c.id,
        systemType: c.system_type,
        status: c.status,
        speed: parseFloat(c.speed)
      })) as CVSystem[];
    }
  });

  // Packages
  const { data: packagesData = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw error;
      return data.map((p: any) => ({
        id: p.id,
        uid: p.uid,
        botAssigned: p.bot_assigned,
        destination: p.destination,
        status: p.status,
        timestamp: p.timestamp
      })) as Package[];
    }
  });

  // Bins
  const { data: binsData = [] } = useQuery({
    queryKey: ['bins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bins')
        .select('*');
      if (error) throw error;
      return data.map((b: any) => ({
        id: b.id,
        location: b.location,
        capacity: b.capacity,
        currentCount: b.current_count,
        status: b.status
      })) as Bin[];
    }
  });

  // Compose systemStatus, currentPackage, switches structure, etc.
  // -----
  // System Status (fake one for now—could be tied to events table/statistics later)
  const systemStatus = {
    status: 'online',
    packagesProcessed: packagesData.length,
    totalPackages: packagesData.length,
    uptime: 'N/A'
  };

  // Current package: just grab the most recent non-completed package
  const currentPackage = (() => {
    const active = packagesData.find((pkg) => pkg.status !== "completed");
    return active
      ? {
          packageId: active.uid,
          destination: active.destination || "",
          assignedBot: active.botAssigned,
          estimatedTime: '-', // Not available
          currentRow:
            robotsData.find((rb) => rb.name === active.botAssigned)?.currentRow ?? null,
        }
      : {
          packageId: null,
          destination: null,
          assignedBot: null,
          estimatedTime: null,
          currentRow: null,
        };
  })();

  // Build a structure for the SwitchStatusCard: { [rowIndex]: { entry: Switch[], exit: Switch[] } }
  // - Both entry and exit will reflect the same state for left/right.
  // - Use chutes' id as rowIndex for compatibility.
  const switches: { [row: number]: { entry: Switch[]; exit: Switch[] } } = {};
  chutesData.forEach((chute) => {
    const switchesForChute = switchesData.filter((s) => s.chuteId === chute.id);
    switches[chute.id] = {
      entry: switchesForChute,
      exit: switchesForChute,
    };
  });

  // Map system overview (botActive, cvRunning, etc)
  const activeBotCount = robotsData.filter((r) => r.status === 'active').length;
  const totalBotCount = robotsData.length;

  // cvRunning as available chutes with cvStatus='running'
  const runningChutes = chutesData.filter((c) => c.cvStatus === 'running').length;
  const totalChutes = chutesData.length;

  // Infeed/merger CV status
  const infeedCV = cvSystemsData.find((s) => s.systemType === 'infeed');
  const mergerCV = cvSystemsData.find((s) => s.systemType === 'merger');

  return {
    systemStatus,
    currentPackage,
    robots: robotsData,
    switches, // Now with entry/exit = left/right, and no contradiction
    packages: packagesData,
    bins: binsData,
    chutes: chutesData,
    cvSystems: cvSystemsData,
    botActive: `${activeBotCount}/${totalBotCount}`,
    cvRunning: `${runningChutes}/${totalChutes}`,
    infeedOverview: {
      cvStatus: infeedCV?.status || "N/A",
      cvSpeed: infeedCV ? `${infeedCV.speed} m/s` : "N/A",
      camStatus: "Healthy", // Not yet in DB
      profilerStatus: "Healthy",
      mergerCvStatus: mergerCV?.status || "N/A",
      mergerSpeed: mergerCV ? `${mergerCV.speed} m/s` : "N/A",
    },
    totalRows: totalChutes // for layout/compat
  };
};
