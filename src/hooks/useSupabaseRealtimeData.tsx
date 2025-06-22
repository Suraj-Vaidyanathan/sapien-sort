
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Bot = Database['public']['Tables']['bots']['Row'];
type Package = Database['public']['Tables']['packages']['Row'];
type BotStatus = Database['public']['Tables']['bot_statuses']['Row'];
type PackageStatus = Database['public']['Tables']['package_statuses']['Row'];
type Sector = Database['public']['Tables']['sectors']['Row'];

export const useSupabaseRealtimeData = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [botStatuses, setBotStatuses] = useState<BotStatus[]>([]);
  const [packageStatuses, setPackageStatuses] = useState<PackageStatus[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock bins data since bins table doesn't exist in your database
  const [bins] = useState([
    { id: 'A1', location: 'A1', capacity: 50, currentCount: 47, status: 'available' as const },
    { id: 'A2', location: 'A2', capacity: 50, currentCount: 50, status: 'full' as const },
    { id: 'A3', location: 'A3', capacity: 50, currentCount: 23, status: 'available' as const },
    { id: 'B1', location: 'B1', capacity: 50, currentCount: 45, status: 'available' as const },
    { id: 'B2', location: 'B2', capacity: 50, currentCount: 12, status: 'available' as const },
    { id: 'B3', location: 'B3', capacity: 50, currentCount: 0, status: 'maintenance' as const },
    { id: 'C1', location: 'C1', capacity: 50, currentCount: 33, status: 'available' as const },
    { id: 'C2', location: 'C2', capacity: 50, currentCount: 41, status: 'available' as const },
    { id: 'C3', location: 'C3', capacity: 50, currentCount: 18, status: 'available' as const },
    { id: 'D1', location: 'D1', capacity: 50, currentCount: 49, status: 'available' as const },
    { id: 'D2', location: 'D2', capacity: 50, currentCount: 37, status: 'available' as const },
    { id: 'D3', location: 'D3', capacity: 50, currentCount: 28, status: 'available' as const },
  ]);

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      const [botsResponse, packagesResponse, botStatusesResponse, packageStatusesResponse, sectorsResponse] = await Promise.all([
        supabase.from('bots').select('*').order('bot_id'),
        supabase.from('packages').select('*').order('scanned_at', { ascending: false }),
        supabase.from('bot_statuses').select('*'),
        supabase.from('package_statuses').select('*'),
        supabase.from('sectors').select('*').order('sector_id')
      ]);

      if (botsResponse.data) setBots(botsResponse.data);
      if (packagesResponse.data) setPackages(packagesResponse.data);
      if (botStatusesResponse.data) setBotStatuses(botStatusesResponse.data);
      if (packageStatusesResponse.data) setPackageStatuses(packageStatusesResponse.data);
      if (sectorsResponse.data) setSectors(sectorsResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchInitialData();

    // Subscribe to bots changes
    const botsChannel = supabase
      .channel('bots-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bots'
      }, (payload) => {
        console.log('Bot change:', payload);
        if (payload.eventType === 'INSERT') {
          setBots(prev => [...prev, payload.new as Bot].sort((a, b) => a.bot_id.localeCompare(b.bot_id)));
        } else if (payload.eventType === 'UPDATE') {
          setBots(prev => prev.map(bot => 
            bot.bot_id === payload.new.bot_id ? payload.new as Bot : bot
          ));
        } else if (payload.eventType === 'DELETE') {
          setBots(prev => prev.filter(bot => bot.bot_id !== payload.old.bot_id));
        }
      })
      .subscribe();

    // Subscribe to packages changes
    const packagesChannel = supabase
      .channel('packages-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'packages'
      }, (payload) => {
        console.log('Package change:', payload);
        if (payload.eventType === 'INSERT') {
          setPackages(prev => [payload.new as Package, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setPackages(prev => prev.map(pkg => 
            pkg.package_id === payload.new.package_id ? payload.new as Package : pkg
          ));
        } else if (payload.eventType === 'DELETE') {
          setPackages(prev => prev.filter(pkg => pkg.package_id !== payload.old.package_id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(botsChannel);
      supabase.removeChannel(packagesChannel);
    };
  }, []);

  // Helper function to get status name by ID
  const getStatusName = (statusId: number | null, statuses: BotStatus[] | PackageStatus[]) => {
    const status = statuses.find(s => s.status_id === statusId);
    return status?.status_name || 'unknown';
  };

  // Get current package (most recent processing package)
  const currentPackage = packages.find(pkg => {
    const statusName = getStatusName(pkg.status_id, packageStatuses);
    return statusName === 'processing' || statusName === 'assigned';
  }) || null;

  // System status calculation
  const activeBotCount = bots.filter(bot => {
    const statusName = getStatusName(bot.status_id, botStatuses);
    return statusName === 'active' || statusName === 'running';
  }).length;
  const totalBotCount = bots.length;
  
  const systemStatus = {
    status: (activeBotCount > 0 ? 'online' : 'warning') as 'online' | 'warning' | 'offline',
    packagesProcessed: packages.filter(pkg => {
      const statusName = getStatusName(pkg.status_id, packageStatuses);
      return statusName === 'completed' || statusName === 'delivered';
    }).length,
    totalPackages: packages.length,
    uptime: '23h 45m',
  };

  // Transform data to match existing interfaces
  const transformedRobots = bots.map(bot => {
    const statusName = getStatusName(bot.status_id, botStatuses);
    return {
      id: bot.bot_id,
      name: bot.bot_id,
      currentRow: bot.current_sector_id || 0,
      status: (statusName === 'active' || statusName === 'running' ? 'active' : 
               statusName === 'idle' ? 'idle' :
               statusName === 'charging' ? 'charging' : 'error') as 'active' | 'idle' | 'charging' | 'error',
      batteryLevel: bot.battery_level || 0
    };
  });

  const transformedPackages = packages.map(pkg => {
    const statusName = getStatusName(pkg.status_id, packageStatuses);
    const sector = sectors.find(s => s.sector_id === pkg.destination_sector);
    return {
      uid: pkg.package_id,
      botAssigned: pkg.assigned_bot_id,
      destination: sector?.name || `Sector ${pkg.destination_sector}` || 'Unknown',
      status: (statusName === 'processing' || statusName === 'assigned' ? 'processing' :
               statusName === 'completed' || statusName === 'delivered' ? 'completed' : 'pending') as 'processing' | 'completed' | 'pending',
      timestamp: pkg.scanned_at ? new Date(pkg.scanned_at).toLocaleTimeString() : 'Unknown'
    };
  });

  const transformedBins = bins.map(bin => ({
    id: bin.id,
    location: bin.location,
    capacity: bin.capacity,
    currentCount: bin.currentCount,
    status: bin.status as 'available' | 'full' | 'maintenance'
  }));

  const transformedCurrentPackage = currentPackage ? {
    packageId: currentPackage.package_id,
    destination: sectors.find(s => s.sector_id === currentPackage.destination_sector)?.name || 'Unknown',
    assignedBot: currentPackage.assigned_bot_id,
    estimatedTime: '2m 30s',
    currentRow: transformedRobots.find(r => r.name === currentPackage.assigned_bot_id)?.currentRow || 0
  } : {
    packageId: null,
    destination: null,
    assignedBot: null,
    estimatedTime: null,
    currentRow: null
  };

  return {
    robots: transformedRobots,
    packages: transformedPackages,
    bins: transformedBins,
    currentPackage: transformedCurrentPackage,
    systemStatus,
    loading,
    activeBotCount,
    totalBotCount
  };
};
