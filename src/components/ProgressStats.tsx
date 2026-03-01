import { motion } from "framer-motion";
import { BlockData, TIERS, TierKey } from "@/lib/mosqueData";

interface ProgressStatsProps {
  blocks: BlockData[];
}

const tierStyles: Record<number, { gradient: string; label: string }> = {
  1: { gradient: "from-tier-1 to-emerald-light", label: "Bronze · $500" },
  2: { gradient: "from-tier-2 to-gold-light", label: "Silver · $1,000" },
  3: { gradient: "from-tier-3 to-purple-400", label: "Gold · $2,500" },
  4: { gradient: "from-tier-4 to-pink-400", label: "Platinum · $5,000" },
};

export default function ProgressStats({ blocks }: ProgressStatsProps) {
  const totalGoal = blocks.reduce((sum, b) => sum + TIERS[b.tier].price, 0);
  const totalDonated = blocks.reduce((sum, b) => sum + b.donated, 0);
  const overallProgress = totalGoal > 0 ? totalDonated / totalGoal : 0;

  // Per-tier stats
  const tierStats = ([1, 2, 3, 4] as TierKey[]).map((tier) => {
    const tierBlocks = blocks.filter((b) => b.tier === tier);
    const goal = tierBlocks.reduce((s, b) => s + TIERS[b.tier].price, 0);
    const donated = tierBlocks.reduce((s, b) => s + b.donated, 0);
    const filled = tierBlocks.filter((b) => b.donated >= TIERS[b.tier].price).length;
    return { tier, goal, donated, total: tierBlocks.length, filled };
  });

  return (
    <div className="space-y-6">
      {/* Overall progress */}
      <div className="text-center space-y-3">
        <h3 className="font-display text-2xl font-bold text-foreground">Campaign Progress</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-display font-bold text-gradient-gold">
            ${totalDonated.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-lg">
            / ${totalGoal.toLocaleString()}
          </span>
        </div>
        <div className="w-full max-w-md mx-auto h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress * 100}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <p className="text-sm text-muted-foreground">{Math.round(overallProgress * 100)}% of goal reached</p>
      </div>

      {/* Tier breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tierStats.map(({ tier, goal, donated, total, filled }) => {
          const style = tierStyles[tier];
          const progress = goal > 0 ? donated / goal : 0;
          return (
            <div
              key={tier}
              className="bg-card rounded-lg p-3 border border-border/50 shadow-soft text-center space-y-2"
            >
              <div className={`w-8 h-8 mx-auto rounded bg-gradient-to-br ${style.gradient}`} />
              <p className="text-xs font-semibold text-foreground">{style.label}</p>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${style.gradient} rounded-full transition-all duration-700`}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {filled}/{total} blocks filled
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
