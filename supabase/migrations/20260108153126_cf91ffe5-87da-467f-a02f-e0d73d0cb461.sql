-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (avoids infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Update contact_messages to allow admin read
CREATE POLICY "Admins can view contact messages"
ON public.contact_messages
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages
FOR DELETE
USING (public.is_admin());

-- Update products policies to be admin-only for management
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;

CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Update gallery_images policies to be admin-only for management
DROP POLICY IF EXISTS "Authenticated users can manage gallery images" ON public.gallery_images;

CREATE POLICY "Admins can manage gallery images"
ON public.gallery_images
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());