
-- Table to control page visibility
CREATE TABLE public.page_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key text NOT NULL UNIQUE,
  page_label text NOT NULL,
  nav_label text NOT NULL,
  href text NOT NULL,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view page settings"
  ON public.page_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage page settings"
  ON public.page_settings FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE TRIGGER update_page_settings_updated_at
  BEFORE UPDATE ON public.page_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with current pages (Restaurant hidden by default)
INSERT INTO public.page_settings (page_key, page_label, nav_label, href, is_visible, sort_order) VALUES
  ('accueil', 'Accueil', 'Accueil', '/', true, 1),
  ('moyens', 'Nos Moyens', 'Nos Moyens', '/moyens', true, 2),
  ('projets', 'Projets', 'Projets', '/projets', true, 3),
  ('culture', 'Culture', 'Culture', '/culture', true, 4),
  ('cooperative', 'Coopérative', 'Coopérative', '/cooperative', true, 5),
  ('galerie', 'Galerie', 'Galerie', '/galerie', true, 6),
  ('boutique', 'Boutique', 'Boutique', '/boutique', true, 7),
  ('contact', 'Contact', 'Contact', '/contact', true, 8);

-- Add Restaurant as a project with its image
INSERT INTO public.projects (title, date, category, description, icon, color, sort_order, is_active, image_url)
VALUES (
  'Restaurant Les Délices du Gabon',
  'Depuis 2020',
  'Restaurant',
  'Notre restaurant associatif « Les Délices du Gabon » propose une cuisine authentique gabonaise et africaine en Normandie, France. Reconnu pour notre approche écoresponsable, nous avons été finalistes du prix "Les Cuistos Engagés" organisé par MIIMOSA à Paris en juin 2022. Les bénéfices du restaurant soutiennent directement nos projets d''autonomisation au Gabon. Recettes traditionnelles, produits locaux et gestion durable sont au cœur de notre démarche solidaire.',
  'Award',
  'gold',
  0,
  true,
  NULL
);
