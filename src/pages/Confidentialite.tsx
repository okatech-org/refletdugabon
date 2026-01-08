import { Layout } from "@/components/layout/Layout";

const Confidentialite = () => {
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
              Politique de Confidentialité
            </h1>

            <div className="prose prose-lg max-w-none space-y-8">
              {/* Introduction */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  1. Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  L'association Reflet du Gabon s'engage à protéger la vie privée des utilisateurs 
                  de son site internet. Cette politique de confidentialité explique comment nous 
                  collectons, utilisons et protégeons vos données personnelles conformément au 
                  Règlement Général sur la Protection des Données (RGPD).
                </p>
              </section>

              {/* Responsable du traitement */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  2. Responsable du traitement
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Le responsable du traitement des données est l'association Reflet du Gabon, 
                  située à Verneuil-sur-Avre, Normandie, France.
                </p>
                <p className="text-muted-foreground mt-2">
                  Contact : <a href="mailto:assorefletdugabon@yahoo.com" className="text-primary hover:underline">assorefletdugabon@yahoo.com</a>
                </p>
              </section>

              {/* Données collectées */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  3. Données collectées
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nous pouvons collecter les données suivantes :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone (optionnel)</li>
                  <li>Messages envoyés via le formulaire de contact</li>
                  <li>Données de navigation (cookies)</li>
                </ul>
              </section>

              {/* Finalités */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  4. Finalités du traitement
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Vos données sont collectées pour :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Répondre à vos demandes de contact</li>
                  <li>Vous informer de nos activités et événements</li>
                  <li>Gérer les adhésions et dons</li>
                  <li>Améliorer notre site et nos services</li>
                </ul>
              </section>

              {/* Base légale */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  5. Base légale
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Le traitement de vos données est fondé sur votre consentement explicite lors 
                  de la soumission de formulaires, ou sur l'exécution d'un contrat (adhésion, don).
                </p>
              </section>

              {/* Conservation */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  6. Durée de conservation
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Vos données sont conservées pendant une durée maximale de 3 ans après votre 
                  dernier contact avec l'association, sauf obligation légale de conservation plus longue.
                </p>
              </section>

              {/* Vos droits */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  7. Vos droits
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                  <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                  <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                  <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                  <li><strong>Droit de limitation :</strong> limiter le traitement de vos données</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Pour exercer vos droits, contactez-nous à : <a href="mailto:assorefletdugabon@yahoo.com" className="text-primary hover:underline">assorefletdugabon@yahoo.com</a>
                </p>
              </section>

              {/* Cookies */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  8. Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ce site utilise des cookies techniques nécessaires à son fonctionnement. 
                  Aucun cookie publicitaire ou de suivi n'est utilisé sans votre consentement explicite.
                </p>
              </section>

              {/* Sécurité */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  9. Sécurité des données
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
                  pour protéger vos données contre tout accès non autorisé, modification, 
                  divulgation ou destruction.
                </p>
              </section>

              {/* Réclamation */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  10. Réclamation
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire 
                  une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : 
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">www.cnil.fr</a>
                </p>
              </section>

              {/* Mise à jour */}
              <section className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  11. Mise à jour
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cette politique de confidentialité peut être mise à jour. La date de dernière 
                  mise à jour est indiquée ci-dessous.
                </p>
                <p className="text-muted-foreground mt-4">
                  <strong>Dernière mise à jour :</strong> Janvier 2024
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Confidentialite;