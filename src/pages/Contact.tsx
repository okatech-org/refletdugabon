import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent, getContent, isSectionVisible } from "@/hooks/useSiteContent";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis").max(100, "100 caractères maximum"),
  lastName: z.string().trim().min(1, "Le nom est requis").max(100, "100 caractères maximum"),
  email: z.string().trim().email("Adresse email invalide").max(255, "255 caractères maximum"),
  phone: z.string().trim().max(30, "30 caractères maximum").optional().or(z.literal("")),
  subject: z.string().trim().min(1, "Le sujet est requis").max(200, "200 caractères maximum"),
  message: z.string().trim().min(1, "Le message est requis").max(5000, "5000 caractères maximum"),
  consent: z.literal(true, { errorMap: () => ({ message: "Vous devez accepter" }) }),
});

const defaultContactInfo = [
  { icon: MapPin, title: "Adresse", contentKey: "address", defaultValue: "Verneuil-sur-Avre, Normandie, France", linkPrefix: null },
  { icon: Phone, title: "Téléphone", contentKey: "phone", defaultValue: "+33 6 81 65 78 70", linkPrefix: "tel:" },
  { icon: Mail, title: "Email", contentKey: "email", defaultValue: "assorefletdugabon@yahoo.com", linkPrefix: "mailto:" },
];

const subjects = [
  "Information générale",
  "Soutenir l'association (don, partenariat)",
  "Demande de prestation culturelle",
  "Réservation restaurant",
  "Bénévolat",
  "Presse et médias",
  "Autre",
];

const Contact = () => {
  const { toast } = useToast();
  const { data: content } = useSiteContent("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consent: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const validated = result.data;
      const { error } = await supabase.from("contact_messages").insert({
        name: validated.lastName,
        first_name: validated.firstName,
        email: validated.email,
        phone: validated.phone || null,
        subject: validated.subject,
        message: validated.message,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Contact
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              {getContent(content, "hero", "title", "Parlons de Votre")}{" "}
              <span className="text-gradient-primary">
                {getContent(content, "hero", "title_highlight", "Engagement")}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {getContent(content, "hero", "description", "Une question, une idée de partenariat ou envie de nous rejoindre ? Notre équipe est à votre écoute.")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Informations de Contact
                </h2>
                <p className="text-muted-foreground">
                  N'hésitez pas à nous contacter par le moyen qui vous convient le mieux.
                </p>
              </div>

              <div className="space-y-6">
                {defaultContactInfo.map((info) => {
                  const value = getContent(content, "info", info.contentKey, info.defaultValue);
                  const link = info.linkPrefix ? `${info.linkPrefix}${value.replace(/\s/g, "")}` : null;
                  return (
                    <div key={info.title} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{info.title}</p>
                        {link ? (
                          <a href={link} className="text-muted-foreground hover:text-primary transition-colors">
                            {value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Google Maps */}
              <div className="rounded-2xl overflow-hidden border border-border h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20923.97768426675!2d0.9134076!3d48.7396694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e40d1c93c7d8fb%3A0x40c14484fb94d00!2s27130%20Verneuil%20d&#39;Avre%20et%20d&#39;Iton!5e0!3m2!1sfr!2sfr!4v1704890000000!5m2!1sfr!2sfr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Verneuil-sur-Avre"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Merci pour votre message !
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Nous avons bien reçu votre demande et vous répondrons très bientôt.
                    </p>
                    <Button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          firstName: "",
                          lastName: "",
                          email: "",
                          phone: "",
                          subject: "",
                          message: "",
                          consent: false,
                        });
                      }}
                      variant="outline"
                    >
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Prénom *
                        </label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          maxLength={100}
                          placeholder="Votre prénom"
                        />
                        {formErrors.firstName && <p className="text-destructive text-xs mt-1">{formErrors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nom *
                        </label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          maxLength={100}
                          placeholder="Votre nom"
                        />
                        {formErrors.lastName && <p className="text-destructive text-xs mt-1">{formErrors.lastName}</p>}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          maxLength={255}
                          placeholder="votre@email.com"
                        />
                        {formErrors.email && <p className="text-destructive text-xs mt-1">{formErrors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Téléphone
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          maxLength={30}
                          placeholder="+33 6 00 00 00 00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Sujet *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Sélectionnez un sujet</option>
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                      {formErrors.subject && <p className="text-destructive text-xs mt-1">{formErrors.subject}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        maxLength={5000}
                        placeholder="Votre message..."
                        rows={6}
                      />
                      {formErrors.message && <p className="text-destructive text-xs mt-1">{formErrors.message}</p>}
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        required
                        className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      />
                      <label htmlFor="consent" className="text-sm text-muted-foreground">
                        J'accepte que mes données soient utilisées pour traiter ma demande 
                        conformément à la politique de confidentialité. *
                      </label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-primary hover:opacity-90 gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
