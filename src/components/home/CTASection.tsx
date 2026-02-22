import { Link } from "react-router-dom";
import { Heart, HandHeart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent, getContent } from "@/hooks/useSiteContent";

const actions = [
  {
    icon: Heart,
    title: "Faire un Don",
    description: "Soutenez nos projets agricoles et culturels au Gabon.",
  },
  {
    icon: HandHeart,
    title: "Devenir Bénévole",
    description: "Rejoignez notre équipe et partagez vos compétences.",
  },
  {
    icon: Users,
    title: "Devenir Partenaire",
    description: "Entreprises, associations : construisons ensemble.",
  },
];

export const CTASection = () => {
  const { data: content } = useSiteContent("accueil");

  const title = getContent(content, "cta", "title", "Rejoignez Notre Mouvement");
  const description = getContent(content, "cta", "description", "Ensemble, nous pouvons transformer des vies et construire un avenir meilleur pour les jeunes et les femmes du Gabon. Chaque geste compte.");

  return (
    <section className="py-24 bg-muted/50">
      <div className="section-container">
        <div className="relative bg-gradient-primary rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-primary-foreground space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">{description}</p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <Link to="/contact">Nous Contacter</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/moyens">En Savoir Plus</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {actions.map((action) => (
                <div
                  key={action.title}
                  className="flex items-center gap-4 p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                    <action.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">{action.title}</h3>
                    <p className="text-primary-foreground/70 text-sm">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
