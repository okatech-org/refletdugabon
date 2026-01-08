import { Link } from "react-router-dom";
import { ArrowRight, Target, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import farmerImage from "@/assets/farmer-woman.jpg";

const values = [
  {
    icon: Target,
    title: "Notre Mission",
    description: "Autonomiser les jeunes et les femmes par l'agriculture durable et des projets économiques solidaires.",
  },
  {
    icon: Heart,
    title: "Nos Valeurs",
    description: "Solidarité, respect de l'environnement, transmission des savoirs et promotion de la culture gabonaise.",
  },
  {
    icon: Globe,
    title: "Notre Vision",
    description: "Un Gabon où chaque jeune et chaque femme a accès aux ressources pour construire son avenir.",
  },
];

export const MissionSection = () => {
  return (
    <section className="py-24">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={farmerImage}
                alt="Femme agricultrice au Gabon"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-2xl shadow-elevated max-w-xs border border-border">
              <p className="text-3xl font-bold text-primary mb-2">30 km</p>
              <p className="text-muted-foreground text-sm">
                De Libreville, notre site agricole de Nkoltang transforme des vies.
              </p>
            </div>

            {/* Decorative */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Qui Sommes-Nous
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Une Association au Service du{" "}
                <span className="text-gradient-primary">Développement Durable</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Reflet du Gabon est une association loi 1901 basée en Normandie, France. 
                Nous agissons pour l'autonomisation des jeunes et des femmes, principalement 
                par l'agriculture, le développement durable, l'écotourisme et des activités 
                économiques et culturelles entre la France et le Gabon.
              </p>
            </div>

            {/* Values */}
            <div className="space-y-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="flex gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 gap-2">
              <Link to="/presidente">
                Lire le mot de la Présidente
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
