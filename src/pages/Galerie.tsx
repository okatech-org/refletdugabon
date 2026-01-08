import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Initial gallery images (to be replaced with database images when available)
const defaultGalleryImages = [
  {
    id: "1",
    title: "Terres agricoles de Nkoltang",
    description: "Vue panoramique du site agricole",
    image_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
    category: "agriculture",
  },
  {
    id: "2",
    title: "Récolte des légumes",
    description: "Les bénéficiaires récoltent les produits",
    image_url: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800",
    category: "agriculture",
  },
  {
    id: "3",
    title: "Formation agricole",
    description: "Séance de formation sur les techniques de culture",
    image_url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800",
    category: "agriculture",
  },
  {
    id: "4",
    title: "Danse traditionnelle",
    description: "Spectacle de danse gabonaise",
    image_url: "https://images.unsplash.com/photo-1545959570-a94084071b5d?w=800",
    category: "culture",
  },
  {
    id: "5",
    title: "Festival culturel",
    description: "Performance lors d'un festival local",
    image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    category: "culture",
  },
  {
    id: "6",
    title: "Instruments traditionnels",
    description: "Musiciens jouant des instruments gabonais",
    image_url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
    category: "culture",
  },
  {
    id: "7",
    title: "Restaurant Les Délices du Gabon",
    description: "Ambiance chaleureuse du restaurant",
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    category: "restaurant",
  },
  {
    id: "8",
    title: "Plat signature",
    description: "Cuisine gabonaise traditionnelle",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    category: "restaurant",
  },
  {
    id: "9",
    title: "Équipe de cuisiniers",
    description: "Notre équipe en action",
    image_url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
    category: "restaurant",
  },
  {
    id: "10",
    title: "Travail communautaire",
    description: "Les femmes préparent les semis",
    image_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
    category: "agriculture",
  },
  {
    id: "11",
    title: "Marché local",
    description: "Vente des produits de la coopérative",
    image_url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
    category: "agriculture",
  },
  {
    id: "12",
    title: "Célébration culturelle",
    description: "Fête traditionnelle gabonaise",
    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    category: "culture",
  },
];

const categories = [
  { id: "all", name: "Toutes" },
  { id: "agriculture", name: "Agriculture" },
  { id: "culture", name: "Culture" },
  { id: "restaurant", name: "Restaurant" },
];

const Galerie = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: dbImages } = useQuery({
    queryKey: ["gallery_images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Use database images if available, otherwise use defaults
  const galleryImages = dbImages && dbImages.length > 0 ? dbImages : defaultGalleryImages;

  const filteredImages = galleryImages.filter(
    (img) => selectedCategory === "all" || img.category === selectedCategory
  );

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxIndex === null) return;
    const newIndex =
      direction === "next"
        ? (lightboxIndex + 1) % filteredImages.length
        : (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxIndex(newIndex);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Galerie Photos
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Nos{" "}
              <span className="text-gradient-primary">Moments</span>{" "}
              en Images
            </h1>
            <p className="text-muted-foreground text-lg">
              Découvrez en images nos activités agricoles à Nkoltang, nos événements culturels 
              et l'ambiance du restaurant "Les Délices du Gabon".
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b border-border bg-card/50 sticky top-16 z-30">
        <div className="section-container">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold mb-1">{image.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aucune image trouvée
              </h3>
              <p className="text-muted-foreground">
                Essayez une autre catégorie.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox("prev");
            }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox("next");
            }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div
            className="max-w-5xl max-h-[90vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[lightboxIndex].image_url}
              alt={filteredImages[lightboxIndex].title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4">
              <h3 className="text-white text-xl font-semibold">
                {filteredImages[lightboxIndex].title}
              </h3>
              <p className="text-white/70 mt-1">
                {filteredImages[lightboxIndex].description}
              </p>
              <p className="text-white/50 text-sm mt-2">
                {lightboxIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Galerie;
