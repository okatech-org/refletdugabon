
-- Table pour stocker le contenu éditable des pages
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  section text NOT NULL,
  content_key text NOT NULL,
  content_value text,
  content_type text NOT NULL DEFAULT 'text',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(page, section, content_key)
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire le contenu du site
CREATE POLICY "Anyone can view site content"
ON public.site_content FOR SELECT USING (true);

-- Seuls les admins peuvent modifier le contenu
CREATE POLICY "Admins can manage site content"
ON public.site_content FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
