import { TIERS, TierKey } from "@/lib/mosqueData";

const tierVisuals: Record<number, { gradient: string; description: string }> = {
  1: { gradient: "from-tier-1 to-amber-600", description: "Fondation et murs" },
  2: { gradient: "from-tier-2 to-gray-400", description: "Éléments structurels" },
  3: { gradient: "from-tier-3 to-yellow-400", description: "Dôme et minaret" },
  4: { gradient: "from-tier-4 to-gray-300", description: "Sommet du dôme" },
};

export default function TierLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
      {([1, 2, 3, 4] as TierKey[]).map((tier) => {
        const t = TIERS[tier];
        const v = tierVisuals[tier];
        return (
          <div key={tier} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-[2px] bg-gradient-to-br ${v.gradient}`} />
            <div>
              <span className="text-xs font-semibold text-foreground">{t.label}</span>
              <span className="text-xs text-muted-foreground ml-1">{t.price.toLocaleString()} $</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
