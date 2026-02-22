
-- Create projects table for dynamic project management
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL DEFAULT 'En cours',
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Sprout',
  color TEXT NOT NULL DEFAULT 'primary',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view active projects
CREATE POLICY "Anyone can view active projects"
  ON public.projects FOR SELECT
  USING (true);

-- Admins can manage projects
CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with existing static projects
INSERT INTO public.projects (title, date, category, description, icon, color, sort_order) VALUES
('Développement de la Coopérative Agricole', 'En cours', 'Agriculture', 'Extension de notre site agricole de Nkoltang avec de nouvelles parcelles et formation de 50 nouvelles bénéficiaires aux techniques de culture maraîchère.', 'Sprout', 'primary', 1),
('Prix Cuistos Engagés 2022', 'Juin 2022', 'Restaurant', 'Notre restaurant ''Les Délices du Gabon'' a été finaliste du prix des Cuistos Engagés organisé par MIIMOSA à Paris, récompensant notre approche écoresponsable.', 'Award', 'gold', 2),
('Don de Matériel Agricole', '2023', 'Partenariat', 'Réception d''un don de matériel agricole de l''ONG IDRC AFRICA permettant d''améliorer significativement nos capacités de production à Nkoltang.', 'Package', 'ocean', 3);
