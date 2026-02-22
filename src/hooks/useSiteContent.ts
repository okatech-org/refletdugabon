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

// Helper to check if a section is visible (defaults to true if no entry exists)
export const isSectionVisible = (
  data: SiteContentItem[] | undefined,
  section: string
): boolean => {
  if (!data) return true;
  const item = data.find(
    (d) => d.section === section && d.content_key === "_visible"
  );
  if (!item) return true;
  return item.content_value !== "false";
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

// Hook to toggle section visibility
export const useToggleSectionVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      page,
      section,
      visible,
    }: {
      page: string;
      section: string;
      visible: boolean;
    }) => {
      const { data: existing } = await supabase
        .from("site_content")
        .select("id")
        .eq("page", page)
        .eq("section", section)
        .eq("content_key", "_visible")
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("site_content")
          .update({ content_value: visible ? "true" : "false" })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_content").insert({
          page,
          section,
          content_key: "_visible",
          content_value: visible ? "true" : "false",
          content_type: "system",
        });
        if (error) throw error;
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
      pillars: {
        label: "Nos 3 Piliers",
        fields: [
          { key: "badge", label: "Badge", type: "text", defaultValue: "Nos 3 Piliers" },
          { key: "title", label: "Titre", type: "text", defaultValue: "Les Moyens de Notre Action" },
          { key: "description", label: "Description", type: "text", defaultValue: "Trois initiatives complémentaires pour construire un avenir durable et solidaire entre la France et le Gabon." },
          { key: "pillar1_title", label: "Pilier 1 - Titre", type: "text", defaultValue: "Coopérative Agricole" },
          { key: "pillar1_subtitle", label: "Pilier 1 - Sous-titre", type: "text", defaultValue: "Nkoltang, Gabon" },
          { key: "pillar1_description", label: "Pilier 1 - Description", type: "text", defaultValue: "Formation et accompagnement des jeunes et des femmes dans l'agriculture durable. Lutte contre la faim et la pauvreté en zone rurale." },
          { key: "pillar1_image", label: "Pilier 1 - Image", type: "image", defaultValue: farmerWomanImage },
          { key: "pillar2_title", label: "Pilier 2 - Titre", type: "text", defaultValue: "Les Délices du Gabon" },
          { key: "pillar2_subtitle", label: "Pilier 2 - Sous-titre", type: "text", defaultValue: "Restaurant Associatif" },
          { key: "pillar2_description", label: "Pilier 2 - Description", type: "text", defaultValue: "Gastronomie africaine authentique en Normandie. Finaliste du prix 'Cuistos Engagés' pour notre approche écoresponsable." },
          { key: "pillar2_image", label: "Pilier 2 - Image", type: "image", defaultValue: restaurantImage },
          { key: "pillar3_title", label: "Pilier 3 - Titre", type: "text", defaultValue: "Groupe Culturel" },
          { key: "pillar3_subtitle", label: "Pilier 3 - Sous-titre", type: "text", defaultValue: "Ambassadeurs Culturels" },
          { key: "pillar3_description", label: "Pilier 3 - Description", type: "text", defaultValue: "Valorisation de la culture gabonaise à travers les danses traditionnelles, la musique et les animations culturelles." },
          { key: "pillar3_image", label: "Pilier 3 - Image", type: "image", defaultValue: culturalDanceImage },
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
  moyens: {
    label: "Nos Moyens",
    sections: {
      hero: {
        label: "Section Héro",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Trois Piliers pour un" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text", defaultValue: "Impact Durable" },
          { key: "description", label: "Description", type: "text", defaultValue: "Découvrez les moyens concrets par lesquels notre association œuvre pour l'autonomisation des communautés gabonaises." },
        ],
      },
      cooperative: {
        label: "Section Coopérative",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Coopérative Agricole à Nkoltang" },
          { key: "description", label: "Description", type: "rich_text" },
          { key: "image", label: "Image", type: "image", defaultValue: farmerWomanImage },
        ],
      },
      restaurant: {
        label: "Section Restaurant",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Restaurant \"Les Délices du Gabon\"" },
          { key: "description", label: "Description", type: "rich_text" },
          { key: "image", label: "Image", type: "image", defaultValue: restaurantImage },
        ],
      },
      culture: {
        label: "Section Culture",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Groupe Culturel" },
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
          { key: "subtitle", label: "Sous-titre", type: "text", defaultValue: "Agriculture durable pour l'autonomisation des femmes gabonaises." },
          { key: "image", label: "Image de fond", type: "image", defaultValue: heroAgricultureImage },
        ],
      },
      stats: {
        label: "Statistiques",
        fields: [
          { key: "stat1_value", label: "Stat 1 - Valeur", type: "text", defaultValue: "10" },
          { key: "stat1_label", label: "Stat 1 - Label", type: "text", defaultValue: "Hectares Cultivés" },
          { key: "stat2_value", label: "Stat 2 - Valeur", type: "text", defaultValue: "200+" },
          { key: "stat2_label", label: "Stat 2 - Label", type: "text", defaultValue: "Femmes Formées" },
          { key: "stat3_value", label: "Stat 3 - Valeur", type: "text", defaultValue: "30 km" },
          { key: "stat3_label", label: "Stat 3 - Label", type: "text", defaultValue: "De Libreville" },
          { key: "stat4_value", label: "Stat 4 - Valeur", type: "text", defaultValue: "15+" },
          { key: "stat4_label", label: "Stat 4 - Label", type: "text", defaultValue: "Cultures Différentes" },
        ],
      },
      about: {
        label: "Section À propos",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Transformer des Vies par l'Agriculture" },
          { key: "description", label: "Description", type: "rich_text" },
        ],
      },
      activities: {
        label: "Activités",
        fields: [
          { key: "title", label: "Titre de la section", type: "text", defaultValue: "Nos Activités" },
          { key: "description", label: "Description", type: "text", defaultValue: "De la formation à la production, nous couvrons toute la chaîne de valeur agricole." },
        ],
      },
      cta: {
        label: "Section CTA",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Soutenez Notre Coopérative" },
          { key: "description", label: "Description", type: "text", defaultValue: "Votre soutien permet de former plus de femmes, d'acquérir du matériel agricole et de développer nos activités pour un impact encore plus grand." },
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
          { key: "title", label: "Titre", type: "text", defaultValue: "Groupe Culturel Gabonais" },
          { key: "subtitle", label: "Sous-titre", type: "text", defaultValue: "Valorisation de la culture gabonaise à travers les arts traditionnels." },
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
      prestations: {
        label: "Prestations",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Nos Prestations" },
          { key: "description", label: "Description", type: "text", defaultValue: "Une gamme complète de services culturels pour tous vos événements." },
        ],
      },
      cta: {
        label: "Section CTA",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Réservez Notre Groupe" },
          { key: "description", label: "Description", type: "text", defaultValue: "Vous organisez un événement ? Notre groupe culturel apportera une touche d'authenticité africaine mémorable à votre célébration." },
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
          { key: "title", label: "Titre", type: "text", defaultValue: "Activités et" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text", defaultValue: "Projets Récents" },
          { key: "description", label: "Description", type: "text", defaultValue: "Suivez nos actualités et découvrez l'impact concret de nos actions sur le terrain au Gabon et en France." },
        ],
      },
      cta: {
        label: "Section CTA",
        fields: [
          { key: "text", label: "Texte", type: "text", defaultValue: "Vous souhaitez contribuer à nos prochains projets ?" },
        ],
      },
    },
  },
  boutique: {
    label: "Boutique",
    sections: {
      hero: {
        label: "Section Héro",
        fields: [
          { key: "badge", label: "Badge", type: "text", defaultValue: "Boutique Express" },
          { key: "title", label: "Titre", type: "text", defaultValue: "Artisanat" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text", defaultValue: "Gabonais" },
          { key: "description", label: "Description", type: "text", defaultValue: "Découvrez notre sélection de produits artisanaux authentiques et offrez des bons cadeaux pour le restaurant \"Les Délices du Gabon\"." },
        ],
      },
      gift_cards: {
        label: "Bons Cadeaux",
        fields: [
          { key: "title", label: "Titre", type: "text", defaultValue: "Offrez une Expérience Culinaire" },
          { key: "description", label: "Description", type: "text", defaultValue: "Nos bons cadeaux vous permettent d'offrir un moment de découverte gastronomique au restaurant \"Les Délices du Gabon\"." },
        ],
      },
    },
  },
  galerie: {
    label: "Galerie",
    sections: {
      hero: {
        label: "Section Héro",
        fields: [
          { key: "badge", label: "Badge", type: "text", defaultValue: "Galerie Photos" },
          { key: "title", label: "Titre", type: "text", defaultValue: "Nos" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text", defaultValue: "Moments" },
          { key: "title_suffix", label: "Titre (suite)", type: "text", defaultValue: "en Images" },
          { key: "description", label: "Description", type: "text", defaultValue: "Découvrez en images nos activités agricoles à Nkoltang, nos événements culturels et l'ambiance du restaurant \"Les Délices du Gabon\"." },
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
          { key: "title", label: "Titre", type: "text", defaultValue: "Parlons de Votre" },
          { key: "title_highlight", label: "Titre (partie colorée)", type: "text", defaultValue: "Engagement" },
          { key: "description", label: "Description", type: "text", defaultValue: "Une question, une idée de partenariat ou envie de nous rejoindre ? Notre équipe est à votre écoute." },
        ],
      },
      info: {
        label: "Informations",
        fields: [
          { key: "address", label: "Adresse", type: "text", defaultValue: "Verneuil-sur-Avre, Normandie, France" },
          { key: "phone", label: "Téléphone", type: "text", defaultValue: "+33 6 81 65 78 70" },
          { key: "email", label: "Email", type: "text", defaultValue: "assorefletdugabon@yahoo.com" },
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
