import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PageSetting {
  id: string;
  page_key: string;
  page_label: string;
  nav_label: string;
  href: string;
  is_visible: boolean;
  sort_order: number;
  updated_at: string;
}

export const usePageSettings = () => {
  return useQuery({
    queryKey: ["page-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_settings")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as PageSetting[];
    },
  });
};

export const useVisiblePages = () => {
  const { data, ...rest } = usePageSettings();
  return {
    data: data?.filter((p) => p.is_visible),
    ...rest,
  };
};
