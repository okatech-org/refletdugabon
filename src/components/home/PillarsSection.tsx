import { Link } from "react-router-dom";
import { Sprout, UtensilsCrossed, Music, ArrowRight } from "lucide-react";
import { useSiteContent, getContent } from "@/hooks/useSiteContent";
import farmerImage from "@/assets/farmer-woman.jpg";
import restaurantImage from "@/assets/restaurant.jpg";
import culturalImage from "@/assets/cultural-dance.jpg";

const pillarDefaults = [
  {
    icon: Sprout,
    titleKey: "pillar1_title",
    subtitleKey: "pillar1_subtitle",
    descriptionKey: "pillar1_description",
    imageKey: "pillar1_image",
    defaultTitle: "Coopérative Agricole",
    defaultSubtitle: "Nkoltang, Gabon",
    defaultDescription: "Formation et accompagnement des jeunes et des femmes dans l'agriculture durable. Lutte contre la faim et la pauvreté en zone rurale.",
    defaultImage: farmerImage,
    href: "/cooperative",
    color: "primary",
  },
  {
    icon: UtensilsCrossed,
    titleKey: "pillar2_title",
    subtitleKey: "pillar2_subtitle",
    descriptionKey: "pillar2_description",
    imageKey: "pillar2_image",
    defaultTitle: "Les Délices du Gabon",
    defaultSubtitle: "Restaurant Associatif",
    defaultDescription: "Gastronomie africaine authentique en Normandie. Finaliste du prix 'Cuistos Engagés' pour notre approche écoresponsable.",
    defaultImage: restaurantImage,
    href: "/restaurant",
    color: "gold",
  },
  {
    icon: Music,
    titleKey: "pillar3_title",
    subtitleKey: "pillar3_subtitle",
    descriptionKey: "pillar3_description",
    imageKey: "pillar3_image",
    defaultTitle: "Groupe Culturel",
    defaultSubtitle: "Ambassadeurs Culturels",
    defaultDescription: "Valorisation de la culture gabonaise à travers les danses traditionnelles, la musique et les animations culturelles.",
    defaultImage: culturalImage,
    href: "/culture",
    color: "ocean",
  },
];

export const PillarsSection = () => {
  const { data: content } = useSiteContent("accueil");

  return (
    <section className="py-24 bg-muted/50 african-pattern">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {getContent(content, "pillars", "badge", "Nos 3 Piliers")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {getContent(content, "pillars", "title", "Les Moyens de Notre Action")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {getContent(content, "pillars", "description", "Trois initiatives complémentaires pour construire un avenir durable et solidaire entre la France et le Gabon.")}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillarDefaults.map((pillar, index) => {
            const title = getContent(content, "pillars", pillar.titleKey, pillar.defaultTitle);
            const subtitle = getContent(content, "pillars", pillar.subtitleKey, pillar.defaultSubtitle);
            const description = getContent(content, "pillars", pillar.descriptionKey, pillar.defaultDescription);
            const image = getContent(content, "pillars", pillar.imageKey, "") || pillar.defaultImage;

            return (
              <Link
                key={pillar.titleKey}
                to={pillar.href}
                className="group relative bg-card rounded-2xl overflow-hidden card-hover border border-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  {/* Icon Badge */}
                  <div className={`absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center ${
                    pillar.color === "primary" ? "bg-primary" : 
                    pillar.color === "gold" ? "bg-gold" : "bg-ocean"
                  }`}>
                    <pillar.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <p className={`text-sm font-medium mb-1 ${
                      pillar.color === "primary" ? "text-primary" : 
                      pillar.color === "gold" ? "text-gold" : "text-ocean"
                    }`}>
                      {subtitle}
                    </p>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {description}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm pt-2">
                    <span>En savoir plus</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
