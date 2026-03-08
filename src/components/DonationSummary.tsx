import { BlockData, TIERS, TierKey } from "@/lib/mosqueData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, CheckCircle } from "lucide-react";

interface DonationSummaryProps {
  blocks: BlockData[];
}

const tierStyles: Record<number, { gradient: string; label: string; text: string }> = {
  1: { gradient: "from-tier-1 to-amber-600", label: "Bronze", text: "text-tier-1" },
  2: { gradient: "from-tier-2 to-gray-400", label: "Argent", text: "text-tier-2" },
  3: { gradient: "from-tier-3 to-yellow-400", label: "Or", text: "text-tier-3" },
  4: { gradient: "from-tier-4 to-gray-300", label: "Platine", text: "text-tier-4" },
};

export default function DonationSummary({ blocks }: DonationSummaryProps) {
  const donatedBlocks = blocks
    .filter((b) => b.donated > 0)
    .sort((a, b) => b.donated - a.donated);

  const tierStats = ([1, 2, 3, 4] as TierKey[]).map((tier) => {
    const tierBlocks = blocks.filter((b) => b.tier === tier);
    const donated = tierBlocks.reduce((s, b) => s + b.donated, 0);
    const goal = tierBlocks.reduce((s, b) => s + TIERS[b.tier].price, 0);
    const filled = tierBlocks.filter((b) => b.donated >= TIERS[b.tier].price).length;
    const total = tierBlocks.length;
    return { tier, donated, goal, filled, total };
  });

  const totalDonated = blocks.reduce((s, b) => s + b.donated, 0);
  const totalGoal = blocks.reduce((s, b) => s + TIERS[b.tier].price, 0);

  return (
    <div className="bg-card border border-border/50 rounded-xl shadow-soft overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h3 className="font-display text-lg font-bold text-foreground">Résumé des dons</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {totalDonated.toLocaleString()} $ / {totalGoal.toLocaleString()} $ collectés
        </p>
      </div>

      {/* Tier breakdown */}
      <div className="p-4 space-y-3 border-b border-border/50">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Par catégorie</p>
        {tierStats.map(({ tier, donated, goal, filled, total }) => {
          const style = tierStyles[tier];
          const progress = goal > 0 ? (donated / goal) * 100 : 0;
          return (
            <div key={tier} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm bg-gradient-to-br ${style.gradient}`} />
                  <span className="text-xs font-semibold text-foreground">
                    {style.label} · {TIERS[tier].price.toLocaleString()} $
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {filled}/{total} blocs
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${style.gradient} rounded-full transition-all duration-700`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {donated.toLocaleString()} $ / {goal.toLocaleString()} $ ({Math.round(progress)} %)
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent donations list */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="p-4 pb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Derniers dons ({donatedBlocks.length})
          </p>
        </div>
        <ScrollArea className="flex-1 px-4 pb-4">
          <div className="space-y-2">
            {donatedBlocks.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-4 text-center">
                Aucun don pour le moment
              </p>
            ) : (
              donatedBlocks.map((block) => {
                const tier = TIERS[block.tier];
                const style = tierStyles[block.tier];
                const progress = tier.price > 0 ? (block.donated / tier.price) * 100 : 0;
                const isFull = block.donated >= tier.price;

                return (
                  <div
                    key={block.id}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center bg-gradient-to-br ${style.gradient} shrink-0`}>
                      {isFull ? (
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-white/80" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-foreground truncate">
                          {block.donorName || "Anonyme"}
                        </span>
                        <span className={`text-[10px] font-semibold shrink-0 ${style.text}`}>
                          {style.label}
                        </span>
                      </div>
                      {block.donorLabel && (
                        <p className="text-[10px] text-muted-foreground truncate">{block.donorLabel}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${style.gradient} rounded-full`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {block.donated.toLocaleString()} $
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
