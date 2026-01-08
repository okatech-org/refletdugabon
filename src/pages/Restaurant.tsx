import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Award, Utensils, Leaf, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import restaurantImage from "@/assets/restaurant.jpg";

const features = [
  { icon: Utensils, title: "Cuisine Authentique", description: "Recettes traditionnelles gabonaises et africaines" },
  { icon: Leaf, title: "Écoresponsable", description: "Produits locaux et gestion durable" },
  { icon: Heart, title: "Solidaire", description: "Les bénéfices soutiennent nos projets au Gabon" },
  { icon: Award, title: "Primé", description: "Finaliste Cuistos Engagés 2022" },
];

const Restaurant = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <img src={restaurantImage} alt="Restaurant Les Délices du Gabon" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative section-container py-20">
          <div className="max-w-2xl text-primary-foreground">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold mb-4">
              <Award className="w-4 h-4" />
              Finaliste Cuistos Engagés 2022
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Les Délices du Gabon
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Gastronomie africaine authentique en Normandie, France.
            </p>
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90">
              <Link to="/contact">Réserver une table</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/50">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Un Voyage Culinaire au Cœur de l'Afrique
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Notre restaurant associatif vous invite à découvrir les saveurs authentiques du Gabon 
              et de l'Afrique. Chaque plat raconte une histoire, celle de nos traditions culinaires 
              transmises de génération en génération.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Reconnu pour notre approche écoresponsable, nous avons été finalistes du prix 
              "Les Cuistos Engagés" organisé par MIIMOSA à Paris en juin 2022. Les bénéfices 
              du restaurant soutiennent directement nos projets d'autonomisation au Gabon.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-muted/50">
        <div className="section-container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border text-center">
              <MapPin className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Adresse</h3>
              <p className="text-muted-foreground">Verneuil-sur-Avre, Normandie, France</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border text-center">
              <Phone className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Réservation</h3>
              <a href="tel:+33681657870" className="text-muted-foreground hover:text-primary">
                +33 6 81 65 78 70
              </a>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border text-center">
              <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Horaires</h3>
              <p className="text-muted-foreground">Sur réservation</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Restaurant;
