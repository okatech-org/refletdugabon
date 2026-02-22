import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users, Leaf, Target, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent, getContent, isSectionVisible } from "@/hooks/useSiteContent";
import heroImage from "@/assets/hero-agriculture.jpg";
import farmerImage from "@/assets/farmer-woman.jpg";

const Cooperative = () => {
  const { data: content } = useSiteContent("cooperative");

  const stats = [
    { value: getContent(content, "stats", "stat1_value", "10"), label: getContent(content, "stats", "stat1_label", "Hectares Cultivés") },
    { value: getContent(content, "stats", "stat2_value", "200+"), label: getContent(content, "stats", "stat2_label", "Femmes Formées") },
    { value: getContent(content, "stats", "stat3_value", "30 km"), label: getContent(content, "stats", "stat3_label", "De Libreville") },
    { value: getContent(content, "stats", "stat4_value", "15+"), label: getContent(content, "stats", "stat4_label", "Cultures Différentes") },
  ];

  const activities = [
    { title: "Production Maraîchère", description: "Légumes, fruits et denrées alimentaires de qualité pour les marchés locaux.", icon: Leaf },
    { title: "Formation Agricole", description: "Techniques de préparation, semis, entretien et récolte transmises aux bénéficiaires.", icon: Users },
    { title: "Développement Durable", description: "Pratiques agroécologiques respectueuses de l'environnement et de la biodiversité.", icon: Target },
    { title: "Autonomisation", description: "Création d'emplois et revenus durables pour les jeunes et les femmes.", icon: Heart },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      {isSectionVisible(content, "hero") && (
        <section className="relative min-h-[60vh] flex items-center">
          <div className="absolute inset-0">
            <img
              src={getContent(content, "hero", "image", "") || heroImage}
              alt="Terres agricoles de Nkoltang"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
          </div>
          <div className="relative section-container py-20">
            <div className="max-w-2xl text-primary-foreground">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium">Nkoltang, Gabon</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                {getContent(content, "hero", "title", "Coopérative Agricole de Nkoltang")}
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                {getContent(content, "hero", "subtitle", "Agriculture durable pour l'autonomisation des femmes gabonaises.")}
              </p>
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 gap-2">
                <Link to="/contact">
                  Soutenir le projet <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {isSectionVisible(content, "stats") && (
        <section className="py-12 bg-primary">
          <div className="section-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center text-primary-foreground">
                  <p className="text-4xl font-bold mb-2">{stat.value}</p>
                  <p className="text-primary-foreground/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      {isSectionVisible(content, "about") && (
        <section className="py-20">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">
                  {getContent(content, "about", "title", "Transformer des Vies par l'Agriculture")}
                </h2>
                <div
                  className="text-muted-foreground leading-relaxed prose"
                  dangerouslySetInnerHTML={{
                    __html: getContent(content, "about", "description", "<p>Située à 30 km de Libreville dans la zone péri-urbaine de Nkoltang, notre coopérative agricole est le cœur de notre mission d'autonomisation. Nous formons les jeunes et les femmes aux techniques agricoles modernes et durables.</p><p>Grâce au partenariat avec l'ONG IDRC AFRICA qui nous a fourni du matériel agricole, nous développons une production maraîchère de qualité tout en luttant contre la faim, la malnutrition et la pauvreté en zone rurale.</p>"),
                  }}
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <img src={farmerImage} alt="Agricultrice au travail" className="w-full h-[400px] object-cover" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Activities */}
      {isSectionVisible(content, "activities") && (
        <section className="py-20 bg-muted/50">
          <div className="section-container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {getContent(content, "activities", "title", "Nos Activités")}
              </h2>
              <p className="text-muted-foreground">
                {getContent(content, "activities", "description", "De la formation à la production, nous couvrons toute la chaîne de valeur agricole.")}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.map((activity) => (
                <div key={activity.title} className="bg-card p-6 rounded-2xl border border-border card-hover">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                    <activity.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{activity.title}</h3>
                  <p className="text-muted-foreground text-sm">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {isSectionVisible(content, "cta") && (
        <section className="py-20">
          <div className="section-container">
            <div className="bg-gradient-primary rounded-3xl p-12 text-center text-primary-foreground">
              <h2 className="text-3xl font-bold mb-4">
                {getContent(content, "cta", "title", "Soutenez Notre Coopérative")}
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                {getContent(content, "cta", "description", "Votre soutien permet de former plus de femmes, d'acquérir du matériel agricole et de développer nos activités pour un impact encore plus grand.")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <Link to="/contact">Faire un don</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/contact">Devenir partenaire</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Cooperative;
