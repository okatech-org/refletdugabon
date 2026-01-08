import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Sprout, Award, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "Développement de la Coopérative Agricole",
    date: "En cours",
    category: "Agriculture",
    description: "Extension de notre site agricole de Nkoltang avec de nouvelles parcelles et formation de 50 nouvelles bénéficiaires aux techniques de culture maraîchère.",
    icon: Sprout,
    color: "primary",
  },
  {
    id: 2,
    title: "Prix Cuistos Engagés 2022",
    date: "Juin 2022",
    category: "Restaurant",
    description: "Notre restaurant 'Les Délices du Gabon' a été finaliste du prix des Cuistos Engagés organisé par MIIMOSA à Paris, récompensant notre approche écoresponsable.",
    icon: Award,
    color: "gold",
  },
  {
    id: 3,
    title: "Don de Matériel Agricole",
    date: "2023",
    category: "Partenariat",
    description: "Réception d'un don de matériel agricole de l'ONG IDRC AFRICA permettant d'améliorer significativement nos capacités de production à Nkoltang.",
    icon: Package,
    color: "ocean",
  },
];

const Projets = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Nos Réalisations
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Activités et{" "}
              <span className="text-gradient-primary">Projets Récents</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Suivez nos actualités et découvrez l'impact concret de nos actions 
              sur le terrain au Gabon et en France.
            </p>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-20">
        <div className="section-container">
          <div className="max-w-4xl mx-auto space-y-8">
            {projects.map((project) => (
              <article
                key={project.id}
                className="bg-card rounded-2xl border border-border overflow-hidden card-hover"
              >
                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      project.color === "primary" ? "bg-primary" :
                      project.color === "gold" ? "bg-gold" : "bg-ocean"
                    }`}>
                      <project.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${
                        project.color === "primary" ? "text-primary" :
                        project.color === "gold" ? "text-gold" : "text-ocean"
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
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6">
              Vous souhaitez contribuer à nos prochains projets ?
            </p>
            <Button asChild className="bg-gradient-primary hover:opacity-90 gap-2">
              <Link to="/contact">
                Nous soutenir <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projets;
