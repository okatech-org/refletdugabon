-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Admin can manage products" ON public.products;
DROP POLICY IF EXISTS "Admin can manage gallery images" ON public.gallery_images;

-- Create proper policies for authenticated users only
CREATE POLICY "Authenticated users can manage products"
ON public.products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage gallery images"
ON public.gallery_images
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);