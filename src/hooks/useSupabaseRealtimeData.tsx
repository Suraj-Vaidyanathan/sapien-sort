
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Robot = Database['public']['Tables']['robots']['Row'];
type Package = Database['public']['Tables']['packages']['Row'];
type Bin = Database['public']['Tables']['bins']['Row'];

export const useSupabaseRealtimeData = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      const [robotsResponse, packagesResponse, binsResponse] = await Promise.all([
        supabase.from('robots').select('*'),
        supabase.from('packages').select('*').order('timestamp', { ascending: false }),
        supabase.from('bins').select('*').order('location')
      ]);

      if (robotsResponse.data) setRobots(robotsResponse.data);
      if (packagesResponse.data) setPackages(packagesResponse.data);
      if (binsResponse.data) setBins(binsResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchInitialData();

    // Subscribe to robots changes
    const robotsChannel = supabase
      .channel('robots-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'robots'
      }, (payload) => {
        console.log('Robot change:', payload);
        if (payload.eventType === 'INSERT') {
          setRobots(prev => [...prev, payload.new as Robot]);
        } else if (payload.eventType === 'UPDATE') {
          setRobots(prev => prev.map(robot => 
            robot.id === payload.new.id ? payload.new as Robot : robot
          ));
        } else if (payload.eventType === 'DELETE') {
          setRobots(prev => prev.filter(robot => robot.id !== payload.old.id));
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
            pkg.id === payload.new.id ? payload.new as Package : pkg
          ));
        } else if (payload.eventType === 'DELETE') {
          setPackages(prev => prev.filter(pkg => pkg.id !== payload.old.id));
        }
      })
      .subscribe();

    // Subscribe to bins changes
    const binsChannel = supabase
      .channel('bins-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bins'
      }, (payload) => {
        console.log('Bin change:', payload);
        if (payload.eventType === 'INSERT') {
          setBins(prev => [...prev, payload.new as Bin].sort((a, b) => a.location.localeCompare(b.location)));
        } else if (payload.eventType === 'UPDATE') {
          setBins(prev => prev.map(bin => 
            bin.id === payload.new.id ? payload.new as Bin : bin
          ));
        } else if (payload.eventType === 'DELETE') {
          setBins(prev => prev.filter(bin => bin.id !== payload.old.id));
        }
      })
      .subscribe();

    // Simulate new packages being created periodically
    const packageInterval = setInterval(async () => {
      try {
        await supabase.rpc('create_random_package');
      } catch (error) {
        console.error('Error creating random package:', error);
      }
    }, 15000); // Create new package every 15 seconds

    return () => {
      supabase.removeChannel(robotsChannel);
      supabase.removeChannel(packagesChannel);
      supabase.removeChannel(binsChannel);
      clearInterval(packageInterval);
    };
  }, []);

  // Get current package (most recent processing package)
  const currentPackage = packages.find(pkg => pkg.status === 'processing') || null;

  // System status calculation
  const activeBotCount = robots.filter(r => r.status === 'active').length;
  const totalBotCount = robots.length;
  const systemStatus = {
    status: (activeBotCount > 0 ? 'online' : 'warning') as 'online' | 'warning' | 'offline',
    packagesProcessed: packages.filter(p => p.status === 'completed').length,
    totalPackages: packages.length,
    uptime: '23h 45m',
  };

  return {
    robots,
    packages,
    bins,
    currentPackage,
    systemStatus,
    loading,
    activeBotCount,
    totalBotCount
  };
};
