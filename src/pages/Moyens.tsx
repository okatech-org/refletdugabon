import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Sprout, UtensilsCrossed, Music, Users, Leaf, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import farmerImage from "@/assets/farmer-woman.jpg";
import restaurantImage from "@/assets/restaurant.jpg";
import culturalImage from "@/assets/cultural-dance.jpg";

const Moyens = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Nos Moyens d'Action
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Trois Piliers pour un{" "}
              <span className="text-gradient-primary">Impact Durable</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Découvrez les moyens concrets par lesquels notre association œuvre 
              pour l'autonomisation des communautés gabonaises.
            </p>
          </div>
        </div>
      </section>

      {/* Cooperative Section */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden">
              <img src={farmerImage} alt="Coopérative agricole" className="w-full h-[400px] object-cover" />
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                <Sprout className="w-4 h-4 inline mr-2" />
                Agriculture Durable
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Coopérative Agricole à Nkoltang
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Située à 30 km de Libreville, notre coopérative agricole forme les jeunes et les femmes 
                aux techniques agricoles durables : préparation des planches, pépinières, repiquage, 
                et bien plus encore.
              </p>
              <ul className="space-y-3">
                {["Formation aux techniques agricoles", "Production maraîchère durable", "Création d'emplois locaux", "Partenariat avec l'ONG IDRC AFRICA"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Leaf className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-gradient-primary hover:opacity-90 gap-2">
                <Link to="/cooperative">
                  Découvrir la coopérative <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Section */}
      <section className="py-20 bg-muted/50">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Restaurant "Les Délices du Gabon"
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Notre restaurant associatif en Normandie offre une expérience culinaire africaine authentique. 
                Finaliste du prix "Cuistos Engagés" à Paris en juin 2022, nous promouvons une approche écoresponsable.
              </p>
              <ul className="space-y-3">
                {["Gastronomie africaine authentique", "Approche écoresponsable", "Lieu de partage culturel", "Prix Cuistos Engagés 2022"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gold" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-gradient-primary hover:opacity-90 gap-2">
                <Link to="/restaurant">
                  Découvrir le restaurant <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2 relative rounded-2xl overflow-hidden">
              <img src={restaurantImage} alt="Restaurant Les Délices du Gabon" className="w-full h-[400px] object-cover" />
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gold text-gold-foreground text-sm font-medium">
                <UtensilsCrossed className="w-4 h-4 inline mr-2" />
                Écoresponsable
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Section */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden">
              <img src={culturalImage} alt="Groupe culturel" className="w-full h-[400px] object-cover" />
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-ocean text-ocean-foreground text-sm font-medium">
                <Music className="w-4 h-4 inline mr-2" />
                Culture Gabonaise
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Groupe Culturel
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Nos ambassadeurs culturels valorisent le patrimoine gabonais à travers des spectacles 
                de danses traditionnelles, des prestations musicales et des animations culturelles.
              </p>
              <ul className="space-y-3">
                {["Danses traditionnelles gabonaises", "Prestations musicales", "Ateliers culturels éducatifs", "Animations pour événements"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-ocean" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-gradient-primary hover:opacity-90 gap-2">
                <Link to="/culture">
                  Découvrir le groupe culturel <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Moyens;
