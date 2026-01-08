import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-agriculture.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden african-pattern">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Terres agricoles au Gabon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      {/* Content */}
      <div className="relative section-container py-20">
        <div className="max-w-3xl space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-sm font-medium">Association Loi 1901</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight animate-fade-in-up stagger-1">
            Façonnons ensemble un{" "}
            <span className="text-gradient-primary">Gabon durable</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-xl leading-relaxed animate-fade-in-up stagger-2">
            Une association engagée dans l'autonomisation des jeunes et des femmes 
            par l'agriculture, la culture et le développement économique solidaire.
          </p>

          {/* CTA Buttons */}
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

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-8 pt-8 animate-fade-in-up stagger-4">
            <div>
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-primary-foreground/60 text-sm">Bénéficiaires</p>
            </div>
            <div className="w-px bg-primary-foreground/20" />
            <div>
              <p className="text-3xl font-bold text-accent">5+</p>
              <p className="text-primary-foreground/60 text-sm">Années d'action</p>
            </div>
            <div className="w-px bg-primary-foreground/20" />
            <div>
              <p className="text-3xl font-bold text-primary">2</p>
              <p className="text-primary-foreground/60 text-sm">Pays d'action</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
        </div>
      </div>
    </section>
  );
};
