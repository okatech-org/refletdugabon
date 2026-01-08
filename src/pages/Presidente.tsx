import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Presidente = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Message de la Direction
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Le Mot de la{" "}
              <span className="text-gradient-primary">Présidente</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-3xl border border-border p-8 sm:p-12 relative">
              <Quote className="absolute top-8 left-8 w-16 h-16 text-primary/10" />
              
              <div className="relative space-y-6 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  <strong className="text-foreground">Chers amis, partenaires et soutiens de Reflet du Gabon,</strong>
                </p>
                
                <p>
                  C'est avec une immense fierté et un profond engagement que je m'adresse à vous aujourd'hui. 
                  Reflet du Gabon est né d'une conviction profonde : celle que chaque jeune, chaque femme, 
                  dispose en elle des ressources nécessaires pour transformer sa vie et celle de sa communauté.
                </p>
                
                <p>
                  Notre association est le pont entre deux terres qui me sont chères : la Normandie, 
                  où nous avons établi notre siège, et le Gabon, où bat le cœur de nos actions. 
                  À travers notre coopérative agricole de Nkoltang, notre restaurant "Les Délices du Gabon" 
                  et notre groupe culturel, nous tissons les fils d'une solidarité concrète et durable.
                </p>
                
                <p>
                  L'agriculture n'est pas qu'un métier pour nous : c'est un vecteur d'émancipation. 
                  Former les femmes aux techniques agricoles durables, c'est leur donner les clés de 
                  leur autonomie économique. C'est lutter efficacement contre la faim, la malnutrition 
                  et la pauvreté qui touchent encore trop de familles en zone rurale.
                </p>
                
                <p>
                  Je tiens à remercier chaleureusement tous nos partenaires, notamment l'ONG IDRC AFRICA 
                  pour son don généreux de matériel agricole, ainsi que tous les bénévoles et soutiens 
                  qui rendent notre action possible au quotidien.
                </p>
                
                <p>
                  Ensemble, façonnons un Gabon durable, un Gabon où l'avenir sourit à chaque enfant, 
                  où chaque femme peut s'épanouir dans la dignité, où la culture et les traditions 
                  rayonnent au-delà des frontières.
                </p>
                
                <p className="text-lg">
                  <strong className="text-foreground">
                    Avec toute ma gratitude et mon engagement,
                  </strong>
                </p>
                
                <div className="pt-4">
                  <p className="text-foreground font-semibold text-lg">Annie Pichon</p>
                  <p className="text-primary">Présidente de Reflet du Gabon</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-6">
                Vous souhaitez nous rejoindre dans cette aventure ?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-gradient-primary hover:opacity-90 gap-2">
                  <Link to="/contact">
                    Nous contacter <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/moyens">Découvrir nos actions</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Presidente;
