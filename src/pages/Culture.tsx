import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Music, Users, Sparkles, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import culturalImage from "@/assets/cultural-dance.jpg";

const prestations = [
  {
    icon: Music,
    title: "Spectacles de Danse",
    description: "Danses traditionnelles gabonaises dans toute leur splendeur et authenticité.",
  },
  {
    icon: Sparkles,
    title: "Concerts & Musique",
    description: "Prestations musicales mêlant instruments traditionnels et rythmes africains.",
  },
  {
    icon: Users,
    title: "Ateliers Culturels",
    description: "Séances éducatives pour écoles et organisations sur la culture gabonaise.",
  },
  {
    icon: Calendar,
    title: "Événements Privés",
    description: "Animations pour mariages, fêtes d'entreprise et célébrations privées.",
  },
];

const Culture = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <img src={culturalImage} alt="Groupe culturel gabonais" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative section-container py-20">
          <div className="max-w-2xl text-primary-foreground">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocean/20 text-ocean mb-4">
              <Music className="w-4 h-4" />
              Ambassadeurs Culturels
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Groupe Culturel Gabonais
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Valorisation de la culture gabonaise à travers les arts traditionnels.
            </p>
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 gap-2">
              <Link to="/contact">
                Demander une prestation <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Notre Mission Culturelle
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Notre groupe culturel porte fièrement les couleurs du Gabon en France et au-delà. 
              À travers nos danses traditionnelles, notre musique et nos animations, nous 
              transmettons la richesse du patrimoine gabonais et sensibilisons le public 
              à notre culture ancestrale.
            </p>
          </div>
        </div>
      </section>

      {/* Prestations */}
      <section className="py-20 bg-muted/50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Nos Prestations</h2>
            <p className="text-muted-foreground">
              Une gamme complète de services culturels pour tous vos événements.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {prestations.map((prestation) => (
              <div key={prestation.title} className="bg-card p-6 rounded-2xl border border-border card-hover">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                  <prestation.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{prestation.title}</h3>
                <p className="text-muted-foreground text-sm">{prestation.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="section-container">
          <div className="bg-gradient-primary rounded-3xl p-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">Réservez Notre Groupe</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Vous organisez un événement ? Notre groupe culturel apportera une touche 
              d'authenticité africaine mémorable à votre célébration.
            </p>
            <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/contact">Demander un devis</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Culture;
