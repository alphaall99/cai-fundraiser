import { motion } from "framer-motion";
import { BlockData, TIERS } from "@/lib/mosqueData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DonationBlockProps {
  block: BlockData;
  onClick: (block: BlockData) => void;
  index: number;
}

const tierColors: Record<number, { bg: string; fill: string; border: string }> = {
  1: { bg: "bg-tier-1-light", fill: "bg-tier-1", border: "border-tier-1/30" },
  2: { bg: "bg-tier-2-light", fill: "bg-tier-2", border: "border-tier-2/30" },
  3: { bg: "bg-tier-3-light", fill: "bg-tier-3", border: "border-tier-3/30" },
  4: { bg: "bg-tier-4-light", fill: "bg-tier-4", border: "border-tier-4/30" },
};

export default function DonationBlock({ block, onClick, index }: DonationBlockProps) {
  const tier = TIERS[block.tier];
  const progress = tier.price > 0 ? block.donated / tier.price : 0;
  const colors = tierColors[block.tier];
  const isFull = progress >= 1;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.001, duration: 0.2 }}
          onClick={() => onClick(block)}
          className={`relative w-full aspect-square rounded-[2px] border overflow-hidden transition-all duration-200 cursor-pointer
            ${isFull ? `${colors.fill} ${colors.border}` : `bg-block-empty ${colors.border} hover:bg-block-hover`}
            hover:shadow-soft hover:scale-110 hover:z-10
          `}
          aria-label={`Bloc ${tier.label} - ${tier.price} $ - ${Math.round(progress * 100)}% financé${block.donorLabel ? ` par ${block.donorLabel}` : ""}`}
        >
          {progress > 0 && !isFull && (
            <div
              className={`absolute bottom-0 left-0 right-0 ${colors.fill} opacity-70 transition-all duration-700`}
              style={{ height: `${Math.round(progress * 100)}%` }}
            />
          )}

          {block.donorLabel && isFull && (
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-primary-foreground leading-none">
              {block.donorLabel.charAt(0)}
            </span>
          )}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <p className="font-semibold">{tier.label} — {tier.price.toLocaleString()} $</p>
        <p className="text-muted-foreground">
          {block.donated > 0
            ? `${block.donated.toLocaleString()} $ donnés (${Math.round(progress * 100)} %)`
            : "Disponible pour un don"}
        </p>
        {block.donorLabel && <p className="text-primary font-medium">{block.donorLabel}</p>}
      </TooltipContent>
    </Tooltip>
  );
}
