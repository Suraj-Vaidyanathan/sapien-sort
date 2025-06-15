
-- Table for robots
CREATE TABLE public.robots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  current_row INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'idle', 'charging', 'error')),
  battery_level INTEGER NOT NULL
);

-- Table for chutes (CV system per chute/row)
CREATE TABLE public.chutes (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL, -- e.g. "Chute 1"
  cv_status TEXT NOT NULL CHECK (cv_status IN ('running', 'stopped', 'maintenance', 'error')),
  speed NUMERIC NOT NULL
);

-- Table for switches (switch state for each chute/row, left/right)
CREATE TABLE public.switches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chute_id INTEGER NOT NULL REFERENCES public.chutes(id),
  side TEXT NOT NULL CHECK (side IN ('left', 'right')),
  state BOOLEAN NOT NULL -- true=open, false=closed
);

-- Table for CV systems (overall status)
CREATE TABLE public.cv_systems (
  id SERIAL PRIMARY KEY,
  system_type TEXT NOT NULL, -- "infeed", "merger", etc.
  status TEXT NOT NULL CHECK (status IN ('healthy', 'warning', 'error')),
  speed NUMERIC NOT NULL
);

-- Table for packages
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  uid TEXT NOT NULL,
  bot_assigned TEXT,
  destination TEXT,
  status TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT now()
);

-- Table for bins
CREATE TABLE public.bins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  current_count INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'full', 'maintenance'))
);

-- Set RLS to allow full read access to everyone for all tables (DEMO ONLY! TIGHTEN LATER)
ALTER TABLE public.robots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.switches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all read robots" ON public.robots FOR SELECT USING (true);
CREATE POLICY "Allow all read chutes" ON public.chutes FOR SELECT USING (true);
CREATE POLICY "Allow all read switches" ON public.switches FOR SELECT USING (true);
CREATE POLICY "Allow all read cv_systems" ON public.cv_systems FOR SELECT USING (true);
CREATE POLICY "Allow all read packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Allow all read bins" ON public.bins FOR SELECT USING (true);

-- Demo rows for chutes (5 chutes, for CV Running)
INSERT INTO public.chutes (label, cv_status, speed) VALUES
('Infeed', 'running', 0.8),
('Chute 1', 'running', 1.0),
('Chute 2', 'running', 1.0),
('Chute 3', 'running', 1.0),
('Charging', 'running', 0.0);

-- Demo rows for switches (left/right per chute)
INSERT INTO public.switches (chute_id, side, state)
SELECT c.id, 'left', true FROM public.chutes c
UNION ALL
SELECT c.id, 'right', true FROM public.chutes c;

-- Demo rows for robots
INSERT INTO public.robots (name, current_row, status, battery_level) VALUES
('RB-01', 0, 'active', 85),
('RB-02', 2, 'active', 67),
('RB-03', 4, 'charging', 95),
('RB-04', 2, 'active', 23);

-- Demo rows for cv_systems
INSERT INTO public.cv_systems (system_type, status, speed) VALUES
('infeed', 'healthy', 0.8),
('merger', 'healthy', 1.0);

-- Demo rows for bins (3 only as sample)
INSERT INTO public.bins (location, capacity, current_count, status) VALUES
('A1', 50, 47, 'available'),
('A2', 50, 50, 'full'),
('A3', 50, 23, 'available');
