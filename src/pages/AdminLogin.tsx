import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, LogIn } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isResetPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/admin/login`,
        });
        if (error) throw error;
        toast({
          title: "Email envoyé !",
          description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
        });
        setIsResetPassword(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'administration.",
        });
        navigate("/admin");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="w-full max-w-md mx-4">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-elegant">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {isResetPassword 
                  ? "Réinitialiser le mot de passe" 
                  : "Administration"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isResetPassword
                  ? "Entrez votre email pour recevoir un lien de réinitialisation"
                  : "Connectez-vous pour gérer le site"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="admin@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              {!isResetPassword && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      placeholder="••••••••"
                      className="pl-10"
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    {isResetPassword ? "Envoyer le lien" : "Se connecter"}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsResetPassword(!isResetPassword)}
                className="text-sm text-muted-foreground hover:text-primary hover:underline"
              >
                {isResetPassword
                  ? "Retour à la connexion"
                  : "Mot de passe oublié ?"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminLogin;