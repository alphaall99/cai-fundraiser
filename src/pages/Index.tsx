import { useState, useEffect } from "react";
import { generateDemoBlocks, fetchDonationDataFromSheet } from "@/lib/mosqueData";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import MosqueGrid from "@/components/MosqueGrid";
import ProgressStats from "@/components/ProgressStats";
import TierLegend from "@/components/TierLegend";
import { Heart } from "lucide-react";

const Index = () => {
  const [blocks, setBlocks] = useState(() => generateDemoBlocks([]));
  const [refreshInSeconds, setRefreshInSeconds] = useState(30);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const rows = await fetchDonationDataFromSheet();
      if (!isMounted) return;
      setBlocks(generateDemoBlocks(rows));
    };

    // Initial load
    load();

    // Countdown + periodic refresh every 30s
    const intervalId = window.setInterval(() => {
      setRefreshInSeconds((prev) => {
        if (prev <= 1) {
          // Time to refresh and reset countdown
          void load();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection />

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-10">
        <ProgressStats blocks={blocks} />
      </section>

      {/* Mosque Grid Section */}
      <section id="community-center" className="container mx-auto px-4 py-10 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="font-display text-2xl font-bold text-foreground">
            Select a Block to Donate
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Click any block to contribute. Blocks fill with color as donations progress.
            Hover to see details.
          </p>
          <p className="text-xs text-muted-foreground">
            Updating in <span className="font-semibold">{refreshInSeconds}s</span>…
          </p>
        </div>

        <TierLegend />

        <MosqueGrid blocks={blocks} onBlocksChange={setBlocks} />
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Heart className="w-4 h-4 text-secondary" />
            <span>Made with love for the community</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Zad Al-Imane Community Center Building Fund. All donations are tax-deductible.
          </p>
          <p className="text-xs text-muted-foreground">
            Payments processed by Zeffy — 0% commission, 100% of your donation goes to the community center.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
