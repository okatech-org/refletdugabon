import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Sprout, Award, Package, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent, getContent, isSectionVisible } from "@/hooks/useSiteContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.ComponentType<any>> = {
  Sprout, Award, Package, Users, Heart,
};

const Projets = () => {
  const { data: content } = useSiteContent("projets");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      {/* Hero */}
      {isSectionVisible(content, "hero") && (
        <section className="pt-24 pb-12 bg-gradient-hero">
          <div className="section-container">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Nos Réalisations
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                {getContent(content, "hero", "title", "Activités et")}{" "}
                <span className="text-gradient-primary">
                  {getContent(content, "hero", "title_highlight", "Projets Récents")}
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                {getContent(content, "hero", "description", "Suivez nos actualités et découvrez l'impact concret de nos actions sur le terrain au Gabon et en France.")}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Projects List */}
      <section className="py-20">
        <div className="section-container">
          <div className="max-w-4xl mx-auto space-y-8">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Chargement...</p>
            ) : projects?.map((project) => {
              const IconComp = iconMap[project.icon] || Sprout;
              return (
                <article
                  key={project.id}
                  className="bg-card rounded-2xl border border-border overflow-hidden card-hover"
                >
                  {project.image_url && (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-48 sm:h-56 object-cover"
                    />
                  )}
                  <div className="p-8">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        project.color === "primary" ? "bg-primary" :
                        project.color === "gold" ? "bg-amber-500" : "bg-blue-500"
                      }`}>
                        <IconComp className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${
                          project.color === "primary" ? "text-primary" :
                          project.color === "gold" ? "text-amber-500" : "text-blue-500"
                        }`}>
                          {project.category}
                        </span>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Calendar className="w-4 h-4" />
                          {project.date}
                        </div>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      {project.title}
                    </h2>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* CTA */}
          {isSectionVisible(content, "cta") && (
            <div className="text-center mt-16">
              <p className="text-muted-foreground mb-6">
                {getContent(content, "cta", "text", "Vous souhaitez contribuer à nos prochains projets ?")}
              </p>
              <Button asChild className="bg-gradient-primary hover:opacity-90 gap-2">
                <Link to="/contact">
                  Nous soutenir <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Projets;
