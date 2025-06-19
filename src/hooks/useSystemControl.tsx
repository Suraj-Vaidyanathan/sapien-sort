
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SystemState = 'stopped' | 'running' | 'paused';

export const useSystemControl = () => {
  const [systemState, setSystemState] = useState<SystemState>('stopped');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const simulateSystemUpdates = async () => {
    try {
      // Update robot positions and battery levels
      const { data: robots } = await supabase.from('robots').select('*');
      
      if (robots) {
        for (const robot of robots) {
          let newBatteryLevel = robot.battery_level;
          let newStatus = robot.status;
          let newRow = robot.current_row;

          if (robot.status === 'active') {
            newBatteryLevel = Math.max(0, robot.battery_level - (Math.random() * 2 + 1));
            newRow = Math.floor(Math.random() * 5);
            if (newBatteryLevel <= 15) {
              newStatus = 'charging';
              newRow = 4; // charging station
            }
          } else if (robot.status === 'charging') {
            newBatteryLevel = Math.min(100, robot.battery_level + (Math.random() * 3 + 2));
            newRow = 4; // charging station
            if (newBatteryLevel >= 95) {
              newStatus = 'active';
            }
          }

          await supabase
            .from('robots')
            .update({
              battery_level: Math.round(newBatteryLevel),
              status: newStatus,
              current_row: newRow
            })
            .eq('id', robot.id);
        }
      }

      // Occasionally assign pending packages to available robots
      if (Math.random() > 0.7) {
        const { data: pendingPackages } = await supabase
          .from('packages')
          .select('*')
          .eq('status', 'pending')
          .is('bot_assigned', null)
          .limit(1);

        const { data: availableRobots } = await supabase
          .from('robots')
          .select('*')
          .eq('status', 'active');

        if (pendingPackages && pendingPackages.length > 0 && availableRobots && availableRobots.length > 0) {
          const randomBot = availableRobots[Math.floor(Math.random() * availableRobots.length)];
          await supabase
            .from('packages')
            .update({
              bot_assigned: randomBot.name,
              status: 'processing'
            })
            .eq('id', pendingPackages[0].id);
        }
      }

      // Occasionally complete packages
      if (Math.random() > 0.8) {
        const { data: processingPackages } = await supabase
          .from('packages')
          .select('*')
          .eq('status', 'processing')
          .limit(1);

        if (processingPackages && processingPackages.length > 0) {
          await supabase
            .from('packages')
            .update({ status: 'completed' })
            .eq('id', processingPackages[0].id);
        }
      }

    } catch (error) {
      console.error('Error updating system:', error);
    }
  };

  const startSystem = () => {
    console.log('System started');
    setSystemState('running');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(simulateSystemUpdates, 5000);
  };

  const pauseSystem = () => {
    console.log('System paused');
    setSystemState('paused');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const emergencyStop = async () => {
    console.log('Emergency stop activated');
    setSystemState('stopped');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      // Stop all robots
      await supabase
        .from('robots')
        .update({ status: 'idle' })
        .neq('status', 'charging');

      // Unassign current package
      await supabase
        .from('packages')
        .update({ 
          bot_assigned: null,
          status: 'pending'
        })
        .eq('status', 'processing');

    } catch (error) {
      console.error('Error during emergency stop:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    systemState,
    startSystem,
    pauseSystem,
    emergencyStop
  };
};
