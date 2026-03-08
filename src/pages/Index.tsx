import { useState } from "react";
import { generateDemoBlocks } from "@/lib/mosqueData";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import MosqueGrid from "@/components/MosqueGrid";
import ProgressStats from "@/components/ProgressStats";
import TierLegend from "@/components/TierLegend";
import DonationSummary from "@/components/DonationSummary";
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

      {/* Section grille + résumé */}
      <section id="mosque" className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Colonne gauche : résumé des dons */}
          <aside className="w-full lg:w-80 shrink-0 order-2 lg:order-1">
            <div className="lg:sticky lg:top-4">
              <DonationSummary blocks={blocks} />
            </div>
          </aside>

          {/* Colonne droite : grille */}
          <div className="flex-1 space-y-6 order-1 lg:order-2">
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
          </div>
        </div>
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
