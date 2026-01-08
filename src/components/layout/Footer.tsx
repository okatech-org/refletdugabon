import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Heart } from "lucide-react";
import logoRefletGabonFooter from "@/assets/logo-reflet-gabon-documents.png";

const quickLinks = [
  { name: "Accueil", href: "/" },
  { name: "Nos Moyens", href: "/moyens" },
  { name: "Projets Récents", href: "/projets" },
  { name: "Notre Restaurant", href: "/restaurant" },
  { name: "Groupe Culturel", href: "/culture" },
  { name: "Coopérative Agricole", href: "/cooperative" },
];

const legalLinks = [
  { name: "Mentions Légales", href: "/mentions-legales" },
  { name: "Politique de Confidentialité", href: "/confidentialite" },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="block">
              <img 
                src={logoRefletGabonFooter} 
                alt="Reflet du Gabon - Association" 
                className="h-40 w-auto object-contain"
              />
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Engagés pour l'autonomisation des jeunes et des femmes par l'agriculture durable, 
              la culture et le développement économique solidaire.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Liens Rapides</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80 text-sm">
                  Verneuil-sur-Avre<br />
                  Normandie, France
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+33681657870"
                  className="text-primary-foreground/80 hover:text-primary transition-colors text-sm"
                >
                  +33 6 81 65 78 70
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:assorefletdugabon@yahoo.com"
                  className="text-primary-foreground/80 hover:text-primary transition-colors text-sm break-all"
                >
                  assorefletdugabon@yahoo.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Restez Informé</h4>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Inscrivez-vous pour recevoir nos actualités et projets.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="section-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
            © 2024 Reflet du Gabon. Fait avec <Heart className="w-4 h-4 text-destructive" /> pour le Gabon.
          </p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-primary-foreground/60 hover:text-primary transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
