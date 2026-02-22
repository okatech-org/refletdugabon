import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContentItem {
  id: string;
  page: string;
  section: string;
  content_key: string;
  content_value: string | null;
  content_type: string;
  updated_at: string;
}

// Hook to fetch all content for a specific page
export const useSiteContent = (page: string) => {
  return useQuery({
    queryKey: ["site-content", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("page", page);
      if (error) throw error;
      return data as SiteContentItem[];
    },
  });
};

// Helper to get a specific content value with a fallback
export const getContent = (
  data: SiteContentItem[] | undefined,
  section: string,
  key: string,
  fallback: string = ""
): string => {
  if (!data) return fallback;
  const item = data.find(
    (d) => d.section === section && d.content_key === key
  );
  return item?.content_value || fallback;
};

// Hook for admin to save content
export const useSaveContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: {
      page: string;
      section: string;
      content_key: string;
      content_value: string;
      content_type: string;
    }) => {
      const { data: existing } = await supabase
        .from("site_content")
        .select("id")
        .eq("page", item.page)
        .eq("section", item.section)
        .eq("content_key", item.content_key)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("site_content")
          .update({
            content_value: item.content_value,
            content_type: item.content_type,
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_content")
          .insert(item);
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["site-content", variables.page],
      });
    },
  });
};

// Hook for admin to save multiple content items at once
export const useSaveBulkContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      items: {
        page: string;
        section: string;
        content_key: string;
        content_value: string;
        content_type: string;
      }[]
    ) => {
      for (const item of items) {
        const { data: existing } = await supabase
          .from("site_content")
          .select("id")
          .eq("page", item.page)
          .eq("section", item.section)
          .eq("content_key", item.content_key)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("site_content")
            .update({
              content_value: item.content_value,
              content_type: item.content_type,
            })
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("site_content")
            .insert(item);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
    },
  });
};

// Content structure definition for each page
export const PAGE_CONTENT_STRUCTURE: Record<
  string,
  { label: string; sections: Record<string, { label: string; fields: { key: string; label: string; type: "text" | "rich_text" | "image" }[] }> }
> = {
  accueil: {
    label: "Accueil",
    sections: {
      hero: {
        label: "Section Héro",
        fields: [
          { key: "badge", label: "Badge", type: "text" },
          { key: "title", label: "Titre", type: "text" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text" },
          { key: "subtitle", label: "Sous-titre", type: "text" },
          { key: "image", label: "Image de fond", type: "image" },
          { key: "stat1_value", label: "Stat 1 - Valeur", type: "text" },
          { key: "stat1_label", label: "Stat 1 - Label", type: "text" },
          { key: "stat2_value", label: "Stat 2 - Valeur", type: "text" },
          { key: "stat2_label", label: "Stat 2 - Label", type: "text" },
          { key: "stat3_value", label: "Stat 3 - Valeur", type: "text" },
          { key: "stat3_label", label: "Stat 3 - Label", type: "text" },
        ],
      },
      mission: {
        label: "Section Mission",
        fields: [
          { key: "badge", label: "Badge", type: "text" },
          { key: "title", label: "Titre", type: "text" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text" },
          { key: "description", label: "Description", type: "rich_text" },
          { key: "image", label: "Image", type: "image" },
          { key: "floating_value", label: "Carte flottante - Valeur", type: "text" },
          { key: "floating_text", label: "Carte flottante - Texte", type: "text" },
        ],
      },
      impact: {
        label: "Section Impact",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "description", label: "Description", type: "text" },
          { key: "stat1_value", label: "Stat 1 - Valeur", type: "text" },
          { key: "stat1_label", label: "Stat 1 - Label", type: "text" },
          { key: "stat2_value", label: "Stat 2 - Valeur", type: "text" },
          { key: "stat2_label", label: "Stat 2 - Label", type: "text" },
          { key: "stat3_value", label: "Stat 3 - Valeur", type: "text" },
          { key: "stat3_label", label: "Stat 3 - Label", type: "text" },
          { key: "stat4_value", label: "Stat 4 - Valeur", type: "text" },
          { key: "stat4_label", label: "Stat 4 - Label", type: "text" },
        ],
      },
      cta: {
        label: "Section Appel à l'action",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "description", label: "Description", type: "text" },
        ],
      },
    },
  },
  restaurant: {
    label: "Restaurant",
    sections: {
      hero: {
        label: "Section Héro",
        fields: [
          { key: "badge", label: "Badge", type: "text" },
          { key: "title", label: "Titre", type: "text" },
          { key: "subtitle", label: "Sous-titre", type: "text" },
          { key: "image", label: "Image de fond", type: "image" },
        ],
      },
      about: {
        label: "Section À propos",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "description", label: "Description", type: "rich_text" },
        ],
      },
      contact: {
        label: "Informations de contact",
        fields: [
          { key: "address", label: "Adresse", type: "text" },
          { key: "phone", label: "Téléphone", type: "text" },
          { key: "hours", label: "Horaires", type: "text" },
        ],
      },
    },
  },
  moyens: {
    label: "Nos Moyens",
    sections: {
      hero: {
        label: "Section Héro",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text" },
          { key: "description", label: "Description", type: "text" },
        ],
      },
      cooperative: {
        label: "Section Coopérative",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "description", label: "Description", type: "rich_text" },
        ],
      },
      restaurant: {
        label: "Section Restaurant",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "description", label: "Description", type: "rich_text" },
        ],
      },
      culture: {
        label: "Section Culture",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "description", label: "Description", type: "rich_text" },
        ],
      },
    },
  },
  cooperative: {
    label: "Coopérative",
    sections: {
      hero: {
        label: "Section Héro",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "subtitle", label: "Sous-titre", type: "text" },
          { key: "image", label: "Image de fond", type: "image" },
        ],
      },
      about: {
        label: "Section À propos",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "description", label: "Description", type: "rich_text" },
        ],
      },
      cta: {
        label: "Section CTA",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "description", label: "Description", type: "text" },
        ],
      },
    },
  },
  culture: {
    label: "Culture",
    sections: {
      hero: {
        label: "Section Héro",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "subtitle", label: "Sous-titre", type: "text" },
          { key: "image", label: "Image de fond", type: "image" },
        ],
      },
      mission: {
        label: "Mission Culturelle",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "description", label: "Description", type: "rich_text" },
        ],
      },
      cta: {
        label: "Section CTA",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "description", label: "Description", type: "text" },
        ],
      },
    },
  },
  projets: {
    label: "Projets",
    sections: {
      hero: {
        label: "Section Héro",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text" },
          { key: "description", label: "Description", type: "text" },
        ],
      },
    },
  },
  contact: {
    label: "Contact",
    sections: {
      hero: {
        label: "Section Héro",
        fields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text" },
          { key: "description", label: "Description", type: "text" },
        ],
      },
      info: {
        label: "Informations",
        fields: [
          { key: "address", label: "Adresse", type: "text" },
          { key: "phone", label: "Téléphone", type: "text" },
          { key: "email", label: "Email", type: "text" },
        ],
      },
    },
  },
};
