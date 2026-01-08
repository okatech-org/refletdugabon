import { Layout } from "@/components/layout/Layout";

const MentionsLegales = () => {
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
              Mentions Légales
            </h1>

            <div className="prose prose-lg max-w-none space-y-8">
              {/* Éditeur du site */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  1. Éditeur du site
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Le présent site est édité par l'association <strong>Reflet du Gabon</strong>, 
                  association loi 1901.
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li><strong>Siège social :</strong> Verneuil-sur-Avre, Normandie, France</li>
                  <li><strong>Email :</strong> assorefletdugabon@yahoo.com</li>
                  <li><strong>Téléphone :</strong> +33 6 81 65 78 70</li>
                </ul>
              </section>

              {/* Directeur de publication */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  2. Directeur de publication
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  La directrice de publication est la Présidente de l'association Reflet du Gabon.
                </p>
              </section>

              {/* Hébergement */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  3. Hébergement
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ce site est hébergé par Lovable (Supabase Inc.).
                </p>
              </section>

              {/* Propriété intellectuelle */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  4. Propriété intellectuelle
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  L'ensemble du contenu de ce site (textes, images, logos, vidéos) est protégé 
                  par le droit d'auteur. Toute reproduction, même partielle, est interdite sans 
                  autorisation préalable de l'association Reflet du Gabon.
                </p>
              </section>

              {/* Responsabilité */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  5. Limitation de responsabilité
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  L'association Reflet du Gabon s'efforce d'assurer l'exactitude des informations 
                  diffusées sur ce site. Toutefois, elle ne peut garantir l'exactitude, la précision 
                  ou l'exhaustivité des informations mises à disposition. L'association décline 
                  toute responsabilité pour tout dommage résultant de l'utilisation de ce site.
                </p>
              </section>

              {/* Liens externes */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  6. Liens externes
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ce site peut contenir des liens vers des sites externes. L'association Reflet 
                  du Gabon n'exerce aucun contrôle sur ces sites et décline toute responsabilité 
                  quant à leur contenu.
                </p>
              </section>

              {/* Droit applicable */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  7. Droit applicable
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Les présentes mentions légales sont soumises au droit français. En cas de litige, 
                  les tribunaux français seront seuls compétents.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MentionsLegales;