-- Update products table to allow admin INSERT/UPDATE/DELETE
CREATE POLICY "Admin can manage products"
ON public.products
FOR ALL
USING (true)
WITH CHECK (true);

-- Update gallery_images table to allow admin INSERT/UPDATE/DELETE
CREATE POLICY "Admin can manage gallery images"
ON public.gallery_images
FOR ALL
USING (true)
WITH CHECK (true);