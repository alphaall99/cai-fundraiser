import { useState } from "react";
import { generateDemoBlocks } from "@/lib/mosqueData";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import MosqueGrid from "@/components/MosqueGrid";
import ProgressStats from "@/components/ProgressStats";
import TierLegend from "@/components/TierLegend";
import { Heart } from "lucide-react";

const Index = () => {
  const [blocks, setBlocks] = useState(() => generateDemoBlocks());

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection />

      {/* Section statistiques */}
      <section className="container mx-auto px-4 py-10">
        <ProgressStats blocks={blocks} />
      </section>

      {/* Section grille du centre */}
      <section id="mosque" className="container mx-auto px-4 py-10 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="font-display text-2xl font-bold text-foreground">
            Sélectionnez un bloc pour donner
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Cliquez sur un bloc pour contribuer. Les blocs se remplissent de couleur
            à mesure que les dons progressent. Survolez pour voir les détails.
          </p>
        </div>

        <TierLegend />

        <MosqueGrid blocks={blocks} onBlocksChange={setBlocks} />
      </section>

      {/* Pied de page */}
      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Heart className="w-4 h-4 text-secondary" />
            <span>Fait avec amour pour la communauté</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Centre Communautaire Zad Al-Imane. Tous les dons sont déductibles d'impôts.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
