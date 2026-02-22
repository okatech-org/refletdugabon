import { Link } from "react-router-dom";
import { ArrowRight, Target, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent, getContent } from "@/hooks/useSiteContent";
import farmerImage from "@/assets/farmer-woman.jpg";

const defaultValues = [
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
  const { data: content } = useSiteContent("accueil");

  const badge = getContent(content, "mission", "badge", "Qui Sommes-Nous");
  const title = getContent(content, "mission", "title", "Une Association au Service du");
  const titleHighlight = getContent(content, "mission", "title_highlight", "Développement Durable");
  const description = getContent(
    content,
    "mission",
    "description",
    "Reflet du Gabon est une association loi 1901 basée en Normandie, France. Nous agissons pour l'autonomisation des jeunes et des femmes, principalement par l'agriculture, le développement durable, l'écotourisme et des activités économiques et culturelles entre la France et le Gabon."
  );
  const image = getContent(content, "mission", "image", "") || farmerImage;
  const floatingValue = getContent(content, "mission", "floating_value", "30 km");
  const floatingText = getContent(content, "mission", "floating_text", "De Libreville, notre site agricole de Nkoltang transforme des vies.");

  return (
    <section className="py-24">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={image}
                alt="Femme agricultrice au Gabon"
                className="w-full h-[500px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
            </div>

            <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-2xl shadow-elevated max-w-xs border border-border">
              <p className="text-3xl font-bold text-primary mb-2">{floatingValue}</p>
              <p className="text-muted-foreground text-sm">{floatingText}</p>
            </div>

            <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
          </div>

          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                {badge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                {title}{" "}
                <span className="text-gradient-primary">{titleHighlight}</span>
              </h2>
              <div
                className="text-muted-foreground text-lg leading-relaxed prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>

            <div className="space-y-4">
              {defaultValues.map((value) => (
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
