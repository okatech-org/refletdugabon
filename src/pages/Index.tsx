import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { ImpactSection } from "@/components/home/ImpactSection";
import { CTASection } from "@/components/home/CTASection";
import { useSiteContent, isSectionVisible } from "@/hooks/useSiteContent";

const Index = () => {
  const { data: content } = useSiteContent("accueil");

  return (
    <Layout>
      {isSectionVisible(content, "hero") && <HeroSection />}
      {isSectionVisible(content, "mission") && <MissionSection />}
      {isSectionVisible(content, "pillars") && <PillarsSection />}
      {isSectionVisible(content, "impact") && <ImpactSection />}
      {isSectionVisible(content, "cta") && <CTASection />}
    </Layout>
  );
};

export default Index;
