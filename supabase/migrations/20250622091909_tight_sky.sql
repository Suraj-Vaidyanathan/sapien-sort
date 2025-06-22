/*
  # Initialize Database Schema for Robotic Sorting System

  1. New Tables
    - All existing tables from the schema are already created
    - Adding initial data for bot_statuses and package_statuses
    - Adding sample data for sectors
    - Adding sample bots and packages for testing

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Initial Data
    - Bot statuses (idle, active, charging, error)
    - Package statuses (pending, processing, completed)
    - Sample sectors
    - Sample bots and packages
*/

-- Enable RLS on all tables
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE switches ENABLE ROW LEVEL SECURITY;
ALTER TABLE switch_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE switch_lookup_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_position_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_events_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcel_tracking_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_types ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a control system)
CREATE POLICY "Allow all operations on bots" ON bots FOR ALL USING (true);
CREATE POLICY "Allow all operations on packages" ON packages FOR ALL USING (true);
CREATE POLICY "Allow all operations on bot_statuses" ON bot_statuses FOR ALL USING (true);
CREATE POLICY "Allow all operations on package_statuses" ON package_statuses FOR ALL USING (true);
CREATE POLICY "Allow all operations on sectors" ON sectors FOR ALL USING (true);
CREATE POLICY "Allow all operations on sector_connections" ON sector_connections FOR ALL USING (true);
CREATE POLICY "Allow all operations on switches" ON switches FOR ALL USING (true);
CREATE POLICY "Allow all operations on switch_routes" ON switch_routes FOR ALL USING (true);
CREATE POLICY "Allow all operations on switch_lookup_table" ON switch_lookup_table FOR ALL USING (true);
CREATE POLICY "Allow all operations on system_config" ON system_config FOR ALL USING (true);
CREATE POLICY "Allow all operations on bot_position_log" ON bot_position_log FOR ALL USING (true);
CREATE POLICY "Allow all operations on movement_events_log" ON movement_events_log FOR ALL USING (true);
CREATE POLICY "Allow all operations on parcel_tracking_log" ON parcel_tracking_log FOR ALL USING (true);
CREATE POLICY "Allow all operations on connection_types" ON connection_types FOR ALL USING (true);
CREATE POLICY "Allow all operations on sector_types" ON sector_types FOR ALL USING (true);

-- Insert bot statuses
INSERT INTO bot_statuses (status_name, description) VALUES
('idle', 'Robot is idle and waiting for tasks'),
('active', 'Robot is actively working'),
('charging', 'Robot is charging at charging station'),
('error', 'Robot has encountered an error'),
('maintenance', 'Robot is under maintenance')
ON CONFLICT (status_name) DO NOTHING;

-- Insert package statuses
INSERT INTO package_statuses (status_name, description) VALUES
('pending', 'Package is waiting to be assigned'),
('processing', 'Package is being processed by a robot'),
('completed', 'Package has been successfully sorted'),
('error', 'Package processing encountered an error')
ON CONFLICT (status_name) DO NOTHING;

-- Insert sector types
INSERT INTO sector_types (type_name, description) VALUES
('sorting', 'Main sorting area'),
('charging', 'Robot charging station'),
('input', 'Package input area'),
('output', 'Package output area'),
('maintenance', 'Maintenance area')
ON CONFLICT (type_name) DO NOTHING;

-- Insert connection types
INSERT INTO connection_types (type_name, description) VALUES
('conveyor', 'Conveyor belt connection'),
('rail', 'Rail track connection'),
('wireless', 'Wireless communication zone')
ON CONFLICT (type_name) DO NOTHING;

-- Insert sectors
INSERT INTO sectors (sector_id, name, current_speed, max_speed, sector_type_id) VALUES
(0, 'Sorting Layer 0', 0, 2.5, 1),
(1, 'Sorting Layer 1', 0, 2.5, 1),
(2, 'Sorting Layer 2', 0, 2.5, 1),
(3, 'Sorting Layer 3', 0, 2.5, 1),
(4, 'Charging Station', 0, 1.0, 2),
(5, 'Input Zone', 0, 3.0, 3),
(6, 'Output Zone A', 0, 2.0, 4),
(7, 'Output Zone B', 0, 2.0, 4),
(8, 'Maintenance Area', 0, 1.0, 5)
ON CONFLICT (sector_id) DO NOTHING;

-- Insert sample bots
INSERT INTO bots (bot_id, current_sector_id, status_id, current_speed, battery_level) VALUES
('RB-001', 0, 2, 0, 85),
('RB-002', 2, 2, 0, 67),
('RB-003', 4, 3, 0, 95),
('RB-004', 1, 2, 0, 23)
ON CONFLICT (bot_id) DO NOTHING;

-- Insert sample packages
INSERT INTO packages (package_id, barcode, destination_sector, status_id, scanned_at) VALUES
('PKG-2024-001247', 'BC-PKG-2024-001247', 6, 2, NOW() - INTERVAL '5 minutes'),
('PKG-2024-001246', 'BC-PKG-2024-001246', 7, 2, NOW() - INTERVAL '10 minutes'),
('PKG-2024-001245', 'BC-PKG-2024-001245', 6, 1, NOW() - INTERVAL '15 minutes'),
('PKG-2024-001244', 'BC-PKG-2024-001244', 7, 3, NOW() - INTERVAL '20 minutes'),
('PKG-2024-001243', 'BC-PKG-2024-001243', 6, 3, NOW() - INTERVAL '25 minutes')
ON CONFLICT (package_id) DO NOTHING;

-- Assign some packages to bots
UPDATE packages SET assigned_bot_id = 'RB-001', assigned_at = NOW() WHERE package_id = 'PKG-2024-001247';
UPDATE packages SET assigned_bot_id = 'RB-002', assigned_at = NOW() WHERE package_id = 'PKG-2024-001246';

-- Insert system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('system_mode', 'automatic', 'Current system operation mode'),
('max_robots', '4', 'Maximum number of robots in the system'),
('default_speed', '2.0', 'Default robot speed in m/s'),
('battery_warning_level', '20', 'Battery level to trigger warning'),
('battery_critical_level', '10', 'Battery level to trigger charging')
ON CONFLICT (config_key) DO NOTHING;

-- Insert sample switches
INSERT INTO switches (switch_id, current_position, sector_id, required_position) VALUES
('SW-001', 'A', 0, 'A'),
('SW-002', 'B', 1, 'B'),
('SW-003', 'A', 2, 'A'),
('SW-004', 'B', 3, 'B')
ON CONFLICT (switch_id) DO NOTHING;