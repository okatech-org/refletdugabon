import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent, getContent } from "@/hooks/useSiteContent";
import heroImageDefault from "@/assets/hero-agriculture.jpg";

export const HeroSection = () => {
  const { data: content } = useSiteContent("accueil");

  const badge = getContent(content, "hero", "badge", "Association Loi 1901");
  const title = getContent(content, "hero", "title", "Façonnons ensemble un");
  const titleHighlight = getContent(content, "hero", "title_highlight", "Gabon durable");
  const subtitle = getContent(content, "hero", "subtitle", "Une association engagée dans l'autonomisation des jeunes et des femmes par l'agriculture, la culture et le développement économique solidaire.");
  const heroImage = getContent(content, "hero", "image", "") || heroImageDefault;
  const stat1Value = getContent(content, "hero", "stat1_value", "500+");
  const stat1Label = getContent(content, "hero", "stat1_label", "Bénéficiaires");
  const stat2Value = getContent(content, "hero", "stat2_value", "5+");
  const stat2Label = getContent(content, "hero", "stat2_label", "Années d'action");
  const stat3Value = getContent(content, "hero", "stat3_value", "2");
  const stat3Label = getContent(content, "hero", "stat3_label", "Pays d'action");

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden african-pattern">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Terres agricoles au Gabon"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
      </div>

      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative section-container py-20">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-sm font-medium">{badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight animate-fade-in-up stagger-1">
            {title}{" "}
            <span className="text-gradient-primary">{titleHighlight}</span>
          </h1>

          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-xl leading-relaxed animate-fade-in-up stagger-2">
            {subtitle}
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-3">
            <Button
              asChild
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground gap-2 px-8 animate-pulse-glow"
            >
              <Link to="/projets">
                Découvrir nos projets
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/50 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 gap-2 px-8"
            >
              <Link to="/contact">
                <Play className="w-5 h-5" fill="currentColor" />
                Nous soutenir
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-8 pt-8 animate-fade-in-up stagger-4">
            <div>
              <p className="text-3xl font-bold text-primary">{stat1Value}</p>
              <p className="text-primary-foreground/60 text-sm">{stat1Label}</p>
            </div>
            <div className="w-px bg-primary-foreground/20" />
            <div>
              <p className="text-3xl font-bold text-accent">{stat2Value}</p>
              <p className="text-primary-foreground/60 text-sm">{stat2Label}</p>
            </div>
            <div className="w-px bg-primary-foreground/20" />
            <div>
              <p className="text-3xl font-bold text-primary">{stat3Value}</p>
              <p className="text-primary-foreground/60 text-sm">{stat3Label}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
        </div>
      </div>
    </section>
  );
};
