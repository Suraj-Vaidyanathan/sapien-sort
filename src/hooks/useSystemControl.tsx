import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SystemState = 'stopped' | 'running' | 'paused';

export const useSystemControl = () => {
  const [systemState, setSystemState] = useState<SystemState>('stopped');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const packageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const simulateSystemUpdates = async () => {
    try {
      console.log('Running system simulation update...');
      
      // Update robot positions and battery levels
      const { data: bots } = await supabase.from('bots').select('*');
      
      if (bots) {
        for (const bot of bots) {
          let newBatteryLevel = bot.battery_level || 0;
          let newStatusId = bot.status_id;
          let newSectorId = bot.current_sector_id || 0;

          // Get current status name to determine behavior
          const { data: statusData } = await supabase
            .from('bot_statuses')
            .select('status_name')
            .eq('status_id', bot.status_id)
            .single();

          const currentStatus = statusData?.status_name || 'idle';

          // Handle battery level 0 - force charging
          if (newBatteryLevel <= 0) {
            const { data: chargingStatus } = await supabase
              .from('bot_statuses')
              .select('status_id')
              .eq('status_name', 'charging')
              .single();
            
            if (chargingStatus) {
              newStatusId = chargingStatus.status_id;
              newSectorId = 4; // charging station sector
              newBatteryLevel = 1; // Set to 1% to start charging
              
              // Unassign any packages if robot goes to charging
              await supabase
                .from('packages')
                .update({ 
                  assigned_bot_id: null,
                  status_id: 1 // assuming 1 is pending status
                })
                .eq('assigned_bot_id', bot.bot_id);
            }
          } else if (currentStatus === 'active' || currentStatus === 'running') {
            // Drain battery for active robots
            newBatteryLevel = Math.max(0, newBatteryLevel - (Math.random() * 3 + 2));
            // Move robots around randomly
            newSectorId = Math.floor(Math.random() * 5);
            
            // If battery is low, send to charging
            if (newBatteryLevel <= 15) {
              const { data: chargingStatus } = await supabase
                .from('bot_statuses')
                .select('status_id')
                .eq('status_name', 'charging')
                .single();
              
              if (chargingStatus) {
                newStatusId = chargingStatus.status_id;
                newSectorId = 4; // charging station
                
                // Unassign any packages if robot goes to charging
                await supabase
                  .from('packages')
                  .update({ 
                    assigned_bot_id: null,
                    status_id: 1 // assuming 1 is pending status
                  })
                  .eq('assigned_bot_id', bot.bot_id);
              }
            }
          } else if (currentStatus === 'charging') {
            // Charge the battery
            newBatteryLevel = Math.min(100, newBatteryLevel + (Math.random() * 5 + 3));
            newSectorId = 4; // keep at charging station
            
            // If battery is full, make active again
            if (newBatteryLevel >= 95) {
              const { data: activeStatus } = await supabase
                .from('bot_statuses')
                .select('status_id')
                .ilike('status_name', '%active%')
                .single();
              
              if (activeStatus) {
                newStatusId = activeStatus.status_id;
              }
            }
          }

          await supabase
            .from('bots')
            .update({
              battery_level: Math.round(newBatteryLevel),
              status_id: newStatusId,
              current_sector_id: newSectorId
            })
            .eq('bot_id', bot.bot_id);
        }
      }

      // Assign pending packages to available robots
      if (Math.random() > 0.3) {
        const { data: pendingStatus } = await supabase
          .from('package_statuses')
          .select('status_id')
          .eq('status_name', 'pending')
          .single();

        if (pendingStatus) {
          const { data: pendingPackages } = await supabase
            .from('packages')
            .select('*')
            .eq('status_id', pendingStatus.status_id)
            .is('assigned_bot_id', null)
            .limit(1);

          const { data: activeStatuses } = await supabase
            .from('bot_statuses')
            .select('status_id')
            .or('status_name.ilike.%active%,status_name.ilike.%running%');

          if (activeStatuses && activeStatuses.length > 0) {
            const activeStatusIds = activeStatuses.map(s => s.status_id);
            
            const { data: availableBots } = await supabase
              .from('bots')
              .select('*')
              .in('status_id', activeStatusIds)
              .gt('battery_level', 20);

            if (pendingPackages && pendingPackages.length > 0 && availableBots && availableBots.length > 0) {
              const randomBot = availableBots[Math.floor(Math.random() * availableBots.length)];
              console.log(`Assigning package ${pendingPackages[0].package_id} to robot ${randomBot.bot_id}`);
              
              const { data: processingStatus } = await supabase
                .from('package_statuses')
                .select('status_id')
                .eq('status_name', 'processing')
                .single();

              if (processingStatus) {
                await supabase
                  .from('packages')
                  .update({
                    assigned_bot_id: randomBot.bot_id,
                    status_id: processingStatus.status_id,
                    assigned_at: new Date().toISOString()
                  })
                  .eq('package_id', pendingPackages[0].package_id);
              }
            }
          }
        }
      }

      // Complete packages randomly
      if (Math.random() > 0.5) {
        const { data: processingStatus } = await supabase
          .from('package_statuses')
          .select('status_id')
          .eq('status_name', 'processing')
          .single();

        if (processingStatus) {
          const { data: processingPackages } = await supabase
            .from('packages')
            .select('*')
            .eq('status_id', processingStatus.status_id)
            .limit(1);

          if (processingPackages && processingPackages.length > 0) {
            console.log(`Completing package ${processingPackages[0].package_id}`);
            
            const { data: completedStatus } = await supabase
              .from('package_statuses')
              .select('status_id')
              .eq('status_name', 'completed')
              .single();

            if (completedStatus) {
              await supabase
                .from('packages')
                .update({ 
                  status_id: completedStatus.status_id,
                  assigned_bot_id: null,
                  delivered_at: new Date().toISOString()
                })
                .eq('package_id', processingPackages[0].package_id);
            }
          }
        }
      }

    } catch (error) {
      console.error('Error updating system:', error);
    }
  };

  const generateNewPackage = async () => {
    try {
      console.log('Generating new package...');
      
      const packageId = `PKG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const { data: pendingStatus } = await supabase
        .from('package_statuses')
        .select('status_id')
        .eq('status_name', 'pending')
        .single();

      const { data: sectors } = await supabase
        .from('sectors')
        .select('sector_id')
        .in('sector_id', [6, 7]); // Output zones

      const randomSector = sectors && sectors.length > 0 
        ? sectors[Math.floor(Math.random() * sectors.length)].sector_id 
        : 6;

      if (pendingStatus) {
        const { error } = await supabase
          .from('packages')
          .insert({
            package_id: packageId,
            status_id: pendingStatus.status_id,
            destination_sector: randomSector,
            scanned_at: new Date().toISOString(),
            barcode: `BC-${packageId}`
          });

        if (error) {
          console.error('Error creating package:', error);
        } else {
          console.log('New package created successfully');
        }
      }
    } catch (error) {
      console.error('Error generating package:', error);
    }
  };

  const startSystem = async () => {
    console.log('System started - beginning real-time simulation');
    setSystemState('running');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (packageIntervalRef.current) {
      clearInterval(packageIntervalRef.current);
    }
    
    try {
      const { data: idleStatus } = await supabase
        .from('bot_statuses')
        .select('status_id')
        .eq('status_name', 'idle')
        .single();

      const { data: activeStatus } = await supabase
        .from('bot_statuses')
        .select('status_id')
        .ilike('status_name', '%active%')
        .single();

      if (idleStatus && activeStatus) {
        await supabase
          .from('bots')
          .update({ status_id: activeStatus.status_id })
          .eq('status_id', idleStatus.status_id)
          .gt('battery_level', 15); // Only activate bots with enough battery
        
        console.log('Reactivated idle robots with sufficient battery');
      }
    } catch (error) {
      console.error('Error reactivating robots:', error);
    }
    
    // Run simulation every 5 seconds
    intervalRef.current = setInterval(simulateSystemUpdates, 5000);
    
    // Generate new packages every 10 seconds
    packageIntervalRef.current = setInterval(generateNewPackage, 10000);
    
    // Run one update immediately
    simulateSystemUpdates();
  };

  const pauseSystem = () => {
    console.log('System paused - stopping simulation');
    setSystemState('paused');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (packageIntervalRef.current) {
      clearInterval(packageIntervalRef.current);
      packageIntervalRef.current = null;
    }
  };

  const emergencyStop = async () => {
    console.log('Emergency stop activated - stopping all operations');
    setSystemState('stopped');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (packageIntervalRef.current) {
      clearInterval(packageIntervalRef.current);
      packageIntervalRef.current = null;
    }

    try {
      const { data: chargingStatus } = await supabase
        .from('bot_statuses')
        .select('status_id')
        .eq('status_name', 'charging')
        .single();

      const { data: idleStatus } = await supabase
        .from('bot_statuses')
        .select('status_id')
        .eq('status_name', 'idle')
        .single();

      const { data: pendingStatus } = await supabase
        .from('package_statuses')
        .select('status_id')
        .eq('status_name', 'pending')
        .single();

      const { data: processingStatus } = await supabase
        .from('package_statuses')
        .select('status_id')
        .eq('status_name', 'processing')
        .single();

      if (chargingStatus && idleStatus) {
        await supabase
          .from('bots')
          .update({ status_id: idleStatus.status_id })
          .neq('status_id', chargingStatus.status_id);
      }

      if (pendingStatus && processingStatus) {
        await supabase
          .from('packages')
          .update({ 
            assigned_bot_id: null,
            status_id: pendingStatus.status_id
          })
          .eq('status_id', processingStatus.status_id);
      }

      console.log('Emergency stop completed - all operations halted');
    } catch (error) {
      console.error('Error during emergency stop:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (packageIntervalRef.current) {
        clearInterval(packageIntervalRef.current);
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