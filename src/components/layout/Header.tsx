import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useVisiblePages } from "@/hooks/usePageSettings";
import logoRefletGabon from "@/assets/logo-reflet-gabon-transparent.png";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: visiblePages } = useVisiblePages();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  const navigation = visiblePages?.map((p) => ({ name: p.nav_label, href: p.href })) || [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="section-container flex items-center justify-between py-4">
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
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin">
                  <User className="w-4 h-4 mr-2" />
                  {user.email?.split("@")[0]}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/login">
                <LogIn className="w-4 h-4 mr-2" />
                Se connecter
              </Link>
            </Button>
          )}
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
              {user ? (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <User className="w-4 h-4 mr-2" />
                      {user.email?.split("@")[0]}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Se connecter
                  </Link>
                </Button>
              )}
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
