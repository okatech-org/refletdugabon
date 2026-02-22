import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Import default images for pages
import heroAgricultureImage from "@/assets/hero-agriculture.jpg";
import farmerWomanImage from "@/assets/farmer-woman.jpg";
import restaurantImage from "@/assets/restaurant.jpg";
import culturalDanceImage from "@/assets/cultural-dance.jpg";

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

// Field definition with optional default value
export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "rich_text" | "image";
  defaultValue?: string;
}

export interface SectionDef {
  label: string;
  fields: FieldDef[];
}

export interface PageDef {
  label: string;
  sections: Record<string, SectionDef>;
}

// Content structure definition for each page
export const PAGE_CONTENT_STRUCTURE: Record<string, PageDef> = {
  accueil: {
    label: "Accueil",
    sections: {
      hero: {
        label: "Section Héro",
        fields: [
          { key: "badge", label: "Badge", type: "text", defaultValue: "Association Loi 1901" },
          { key: "title", label: "Titre", type: "text", defaultValue: "Ensemble, cultivons" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text", defaultValue: "l'avenir du Gabon" },
          { key: "subtitle", label: "Sous-titre", type: "text", defaultValue: "Reflet du Gabon œuvre pour l'autonomie alimentaire, la valorisation culturelle et l'insertion professionnelle des jeunes et des femmes au Gabon." },
          { key: "image", label: "Image de fond", type: "image", defaultValue: heroAgricultureImage },
          { key: "stat1_value", label: "Stat 1 - Valeur", type: "text", defaultValue: "500+" },
          { key: "stat1_label", label: "Stat 1 - Label", type: "text", defaultValue: "Bénéficiaires" },
          { key: "stat2_value", label: "Stat 2 - Valeur", type: "text", defaultValue: "3" },
          { key: "stat2_label", label: "Stat 2 - Label", type: "text", defaultValue: "Piliers d'action" },
          { key: "stat3_value", label: "Stat 3 - Valeur", type: "text", defaultValue: "2018" },
          { key: "stat3_label", label: "Stat 3 - Label", type: "text", defaultValue: "Année de création" },
        ],
      },
      mission: {
        label: "Section Mission",
        fields: [
          { key: "badge", label: "Badge", type: "text", defaultValue: "Notre Mission" },
          { key: "title", label: "Titre", type: "text", defaultValue: "Un engagement pour" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text", defaultValue: "un Gabon durable" },
          { key: "description", label: "Description", type: "rich_text", defaultValue: "Reflet du Gabon est une association loi 1901 qui agit pour l'autonomie alimentaire, la valorisation culturelle et l'insertion professionnelle des jeunes et des femmes au Gabon." },
          { key: "image", label: "Image", type: "image", defaultValue: farmerWomanImage },
          { key: "floating_value", label: "Carte flottante - Valeur", type: "text", defaultValue: "15+" },
          { key: "floating_text", label: "Carte flottante - Texte", type: "text", defaultValue: "Années d'engagement" },
        ],
      },
      impact: {
        label: "Section Impact",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Notre Impact en Chiffres" },
          { key: "description", label: "Description", type: "text", defaultValue: "Des résultats concrets qui témoignent de notre engagement" },
          { key: "stat1_value", label: "Stat 1 - Valeur", type: "text", defaultValue: "500+" },
          { key: "stat1_label", label: "Stat 1 - Label", type: "text", defaultValue: "Femmes formées" },
          { key: "stat2_value", label: "Stat 2 - Valeur", type: "text", defaultValue: "50" },
          { key: "stat2_label", label: "Stat 2 - Label", type: "text", defaultValue: "Hectares cultivés" },
          { key: "stat3_value", label: "Stat 3 - Valeur", type: "text", defaultValue: "1000+" },
          { key: "stat3_label", label: "Stat 3 - Label", type: "text", defaultValue: "Repas servis" },
          { key: "stat4_value", label: "Stat 4 - Valeur", type: "text", defaultValue: "20+" },
          { key: "stat4_label", label: "Stat 4 - Label", type: "text", defaultValue: "Événements culturels" },
        ],
      },
      cta: {
        label: "Section Appel à l'action",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Rejoignez notre mission" },
          { key: "description", label: "Description", type: "text", defaultValue: "Chaque geste compte. Ensemble, construisons un avenir meilleur pour le Gabon." },
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
          { key: "badge", label: "Badge", type: "text", defaultValue: "Restaurant" },
          { key: "title", label: "Titre", type: "text", defaultValue: "Les Délices du Gabon" },
          { key: "subtitle", label: "Sous-titre", type: "text", defaultValue: "Une cuisine authentique gabonaise au cœur de la Normandie" },
          { key: "image", label: "Image de fond", type: "image", defaultValue: restaurantImage },
        ],
      },
      about: {
        label: "Section À propos",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Notre Restaurant" },
          { key: "description", label: "Description", type: "rich_text" },
        ],
      },
      contact: {
        label: "Informations de contact",
        fields: [
          { key: "address", label: "Adresse", type: "text", defaultValue: "Rouen, Normandie" },
          { key: "phone", label: "Téléphone", type: "text", defaultValue: "+33 6 XX XX XX XX" },
          { key: "hours", label: "Horaires", type: "text", defaultValue: "Mar-Sam : 11h-22h" },
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
          { key: "title", label: "Titre", type: "text", defaultValue: "Nos Moyens" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text", defaultValue: "d'Action" },
          { key: "description", label: "Description", type: "text", defaultValue: "Trois piliers complémentaires pour un impact durable" },
        ],
      },
      cooperative: {
        label: "Section Coopérative",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Coopérative Agricole" },
          { key: "description", label: "Description", type: "rich_text" },
          { key: "image", label: "Image", type: "image", defaultValue: farmerWomanImage },
        ],
      },
      restaurant: {
        label: "Section Restaurant",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Restaurant" },
          { key: "description", label: "Description", type: "rich_text" },
          { key: "image", label: "Image", type: "image", defaultValue: restaurantImage },
        ],
      },
      culture: {
        label: "Section Culture",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Culture" },
          { key: "description", label: "Description", type: "rich_text" },
          { key: "image", label: "Image", type: "image", defaultValue: culturalDanceImage },
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
          { key: "title", label: "Titre", type: "text", defaultValue: "Coopérative Agricole de Nkoltang" },
          { key: "subtitle", label: "Sous-titre", type: "text", defaultValue: "Former, produire, nourrir" },
          { key: "image", label: "Image de fond", type: "image", defaultValue: heroAgricultureImage },
        ],
      },
      about: {
        label: "Section À propos",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Notre Coopérative" },
          { key: "description", label: "Description", type: "rich_text" },
        ],
      },
      cta: {
        label: "Section CTA",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Soutenez la coopérative" },
          { key: "description", label: "Description", type: "text", defaultValue: "Votre soutien contribue directement à l'autonomie alimentaire au Gabon." },
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
          { key: "title", label: "Titre", type: "text", defaultValue: "Culture & Traditions" },
          { key: "subtitle", label: "Sous-titre", type: "text", defaultValue: "Préserver et transmettre le patrimoine gabonais" },
          { key: "image", label: "Image de fond", type: "image", defaultValue: culturalDanceImage },
        ],
      },
      mission: {
        label: "Mission Culturelle",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Notre Mission Culturelle" },
          { key: "description", label: "Description", type: "rich_text" },
        ],
      },
      cta: {
        label: "Section CTA",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Participez à nos événements" },
          { key: "description", label: "Description", type: "text", defaultValue: "Rejoignez-nous pour célébrer la culture gabonaise." },
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
          { key: "title", label: "Titre", type: "text", defaultValue: "Nos" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text", defaultValue: "Projets" },
          { key: "description", label: "Description", type: "text", defaultValue: "Découvrez nos initiatives pour un Gabon durable" },
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
          { key: "title", label: "Titre", type: "text", defaultValue: "Contactez" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text", defaultValue: "-nous" },
          { key: "description", label: "Description", type: "text", defaultValue: "N'hésitez pas à nous écrire" },
        ],
      },
      info: {
        label: "Informations",
        fields: [
          { key: "address", label: "Adresse", type: "text", defaultValue: "Rouen, Normandie, France" },
          { key: "phone", label: "Téléphone", type: "text", defaultValue: "+33 6 XX XX XX XX" },
          { key: "email", label: "Email", type: "text", defaultValue: "contact@refletdugabon.fr" },
        ],
      },
    },
  },
  presidente: {
    label: "Présidente",
    sections: {
      hero: {
        label: "Section Héro",
        fields: [
          { key: "badge", label: "Badge", type: "text", defaultValue: "Message de la Direction" },
          { key: "title", label: "Titre", type: "text", defaultValue: "Le Mot de la" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text", defaultValue: "Présidente" },
        ],
      },
      message: {
        label: "Message de la Présidente",
        fields: [
          { key: "content", label: "Contenu du message", type: "rich_text" },
        ],
      },
      signature: {
        label: "Signature",
        fields: [
          { key: "closing", label: "Formule de conclusion", type: "text", defaultValue: "Avec toute ma gratitude et mon engagement," },
          { key: "name", label: "Nom", type: "text", defaultValue: "Annie Pichon" },
          { key: "title", label: "Titre / Fonction", type: "text", defaultValue: "Présidente de Reflet du Gabon" },
        ],
      },
      cta: {
        label: "Appel à l'action",
        fields: [
          { key: "text", label: "Texte", type: "text", defaultValue: "Vous souhaitez nous rejoindre dans cette aventure ?" },
        ],
      },
    },
  },
};
