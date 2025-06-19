
-- Enable realtime for existing tables
ALTER TABLE public.packages REPLICA IDENTITY FULL;
ALTER TABLE public.robots REPLICA IDENTITY FULL;
ALTER TABLE public.bins REPLICA IDENTITY FULL;
ALTER TABLE public.switches REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE packages;
ALTER PUBLICATION supabase_realtime ADD TABLE robots;
ALTER PUBLICATION supabase_realtime ADD TABLE bins;
ALTER PUBLICATION supabase_realtime ADD TABLE switches;

-- Clear existing data and insert fresh test data
DELETE FROM public.packages;
DELETE FROM public.robots;
DELETE FROM public.bins;

-- Insert robots data
INSERT INTO public.robots (name, current_row, status, battery_level) VALUES
('RB-01', 0, 'active', 85),
('RB-02', 2, 'active', 67),
('RB-03', 4, 'charging', 95),
('RB-04', 2, 'active', 23);

-- Insert packages data
INSERT INTO public.packages (uid, bot_assigned, destination, status) VALUES
('PKG-2024-001247', 'RB-04', 'Bin A3', 'processing'),
('PKG-2024-001246', 'RB-02', 'Bin B7', 'processing'),
('PKG-2024-001245', null, 'Bin C2', 'pending'),
('PKG-2024-001244', 'RB-01', 'Bin A1', 'completed'),
('PKG-2024-001243', 'RB-03', 'Bin D5', 'completed');

-- Insert bins data
INSERT INTO public.bins (location, capacity, current_count, status) VALUES
('A1', 50, 47, 'available'),
('A2', 50, 50, 'full'),
('A3', 50, 23, 'available'),
('B1', 50, 45, 'available'),
('B2', 50, 12, 'available'),
('B3', 50, 0, 'maintenance'),
('C1', 50, 33, 'available'),
('C2', 50, 41, 'available'),
('C3', 50, 18, 'available'),
('D1', 50, 49, 'available'),
('D2', 50, 37, 'available'),
('D3', 50, 28, 'available');

-- Create a function to simulate new packages
CREATE OR REPLACE FUNCTION public.create_random_package()
RETURNS void AS $$
DECLARE
  package_uid text;
  destinations text[] := ARRAY['Bin A1', 'Bin A2', 'Bin A3', 'Bin B1', 'Bin B2', 'Bin B3', 'Bin C1', 'Bin C2', 'Bin C3', 'Bin D1', 'Bin D2', 'Bin D3'];
  random_destination text;
  package_counter int;
BEGIN
  -- Get current package count to generate unique UID
  SELECT COUNT(*) + 1248 INTO package_counter FROM packages;
  
  package_uid := 'PKG-2024-' || LPAD(package_counter::text, 6, '0');
  random_destination := destinations[floor(random() * array_length(destinations, 1) + 1)::int];
  
  INSERT INTO packages (uid, destination, status, bot_assigned)
  VALUES (package_uid, random_destination, 'pending', null);
END;
$$ LANGUAGE plpgsql;
