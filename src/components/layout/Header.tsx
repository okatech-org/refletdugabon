import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoRefletGabon from "@/assets/logo-reflet-gabon-transparent.png";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Nos Moyens", href: "/moyens" },
  { name: "Projets", href: "/projets" },
  { name: "Restaurant", href: "/restaurant" },
  { name: "Culture", href: "/culture" },
  { name: "Coopérative", href: "/cooperative" },
  { name: "Galerie", href: "/galerie" },
  { name: "Boutique", href: "/boutique" },
  { name: "Contact", href: "/contact" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="section-container flex items-center justify-between py-4">
        {/* Logo - Full logo on all screens */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={logoRefletGabon} 
            alt="Reflet du Gabon" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/login">
              <LogIn className="w-4 h-4 mr-2" />
              Se connecter
            </Link>
          </Button>
          <Button asChild className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-sm">
            <Link to="/contact">Nous Soutenir</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass border-t border-border animate-fade-in">
          <div className="section-container py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  location.pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Se connecter
                </Link>
              </Button>
              <Button asChild className="w-full bg-gradient-primary text-primary-foreground">
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Nous Soutenir
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
