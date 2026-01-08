import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ShoppingBag, Gift, Palette, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "all", name: "Tous les produits", icon: ShoppingBag },
  { id: "artisanat", name: "Artisanat", icon: Palette },
  { id: "bijoux", name: "Bijoux", icon: Heart },
  { id: "textiles", name: "Textiles", icon: ShoppingBag },
  { id: "bons-cadeaux", name: "Bons Cadeaux", icon: Gift },
];

const Boutique = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredProducts = products?.filter(
    (product) => selectedCategory === "all" || product.category === selectedCategory
  );

  const handleAddToCart = (productName: string) => {
    toast({
      title: "Produit ajouté !",
      description: `${productName} a été ajouté à votre panier.`,
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Boutique Express
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Artisanat{" "}
              <span className="text-gradient-primary">Gabonais</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Découvrez notre sélection de produits artisanaux authentiques et offrez des bons cadeaux 
              pour le restaurant "Les Délices du Gabon".
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border bg-card/50">
        <div className="section-container">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="section-container">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-2xl mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-elegant transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">
                      {categories.find((c) => c.id === product.category)?.name || product.category}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mt-1 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-foreground">
                        {Number(product.price).toFixed(2)} €
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product.name)}
                        className="bg-gradient-primary hover:opacity-90"
                      >
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-muted-foreground">
                Essayez une autre catégorie ou revenez plus tard.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Gift Cards Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Gift className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Offrez une Expérience Culinaire
            </h2>
            <p className="text-muted-foreground">
              Nos bons cadeaux vous permettent d'offrir un moment de découverte 
              gastronomique au restaurant "Les Délices du Gabon".
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => setSelectedCategory("bons-cadeaux")}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Voir les Bons Cadeaux
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Boutique;
