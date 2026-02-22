import { Users, Leaf, Briefcase, Calendar } from "lucide-react";
import { useSiteContent, getContent } from "@/hooks/useSiteContent";

const defaultStats = [
  { icon: Users, defaultValue: "500+", defaultLabel: "Bénéficiaires Accompagnés", defaultDesc: "Jeunes et femmes formés" },
  { icon: Leaf, defaultValue: "10", defaultLabel: "Hectares Cultivés", defaultDesc: "À Nkoltang, Gabon" },
  { icon: Briefcase, defaultValue: "50+", defaultLabel: "Emplois Créés", defaultDesc: "Directs et indirects" },
  { icon: Calendar, defaultValue: "5+", defaultLabel: "Années d'Engagement", defaultDesc: "Depuis notre création" },
];

export const ImpactSection = () => {
  const { data: content } = useSiteContent("accueil");

  const title = getContent(content, "impact", "title", "Des Chiffres qui Parlent");
  const description = getContent(content, "impact", "description", "Chaque action compte. Découvrez l'impact concret de notre engagement pour les communautés du Gabon.");

  const stats = defaultStats.map((s, i) => ({
    icon: s.icon,
    value: getContent(content, "impact", `stat${i + 1}_value`, s.defaultValue),
    label: getContent(content, "impact", `stat${i + 1}_label`, s.defaultLabel),
    description: s.defaultDesc,
  }));

  return (
    <section className="py-24 bg-gradient-dark text-primary-foreground relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="section-container relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary text-sm font-medium mb-4">
            Notre Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-primary-foreground/70 text-lg">{description}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative group p-8 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 text-center card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <p className="text-4xl lg:text-5xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-primary-foreground font-medium mb-1">{stat.label}</p>
              <p className="text-primary-foreground/60 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
