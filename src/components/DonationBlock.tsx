import { motion } from "framer-motion";
import { BlockData, TIERS } from "@/lib/mosqueData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DonationBlockProps {
  block: BlockData;
  onClick: (block: BlockData) => void;
  index: number;
  locked?: boolean;
}

const tierColors: Record<number, { bg: string; fill: string; border: string }> = {
  1: { bg: "bg-tier-1-light", fill: "bg-tier-1", border: "border-tier-1/30" },
  2: { bg: "bg-tier-2-light", fill: "bg-tier-2", border: "border-tier-2/30" },
  3: { bg: "bg-tier-3-light", fill: "bg-tier-3", border: "border-tier-3/30" },
  4: { bg: "bg-tier-4-light", fill: "bg-tier-4", border: "border-tier-4/30" },
};

export default function DonationBlock({ block, onClick, index, locked = false }: DonationBlockProps) {
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
          transition={{ delay: index * 0.003, duration: 0.2 }}
          onClick={() => {
            if (locked || isFull) return;
            onClick(block);
          }}
          disabled={locked || isFull}
          className={`relative w-full aspect-[5/3] rounded-sm border overflow-hidden transition-all duration-200
            ${
              locked || isFull
                ? `bg-block-empty ${colors.border} cursor-not-allowed opacity-60`
                : `${colors.bg} ${colors.border}hover:bg-block-hover cursor-pointer hover:shadow-soft hover:scale-105 hover:z-10`
            }
          `}
          aria-label={`${tier.label} block - $${tier.price} - ${Math.round(progress * 100)}% funded${block.donorLabel ? ` by ${block.donorLabel}` : ""}`}
        >
          {/* Progress fill from bottom */}
          {progress > 0 && !isFull && (
            <div
              className={`absolute bottom-0 left-0 right-0 ${colors.fill} opacity-70 transition-all duration-700`}
              style={{ height: `${Math.round(progress * 100)}%` }}
            />
          )}

          {isFull && (
            <div
              className={`absolute bottom-0 left-0 right-0 ${colors.fill} opacity-70 transition-all duration-700 border-2 border-green-300`}
              style={{ height: `100%` }}
            />
          )}

          {/* Donor name - always visible when set */}
          {block.donorLabel && (
            <span
              className={`absolute inset-0 flex items-center justify-center text-[9px] sm:text-[11px] md:text-[12px] font-semibold leading-tight text-center px-1 sm:px-1.5 truncate
              ${isFull ? "text-white" : "text-white/90"} drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]`}
            >
              {block.donorLabel.length > 14 ? block.donorLabel.slice(0, 14) : block.donorLabel}
            </span>
          )}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <p className="font-semibold">{tier.label} — ${tier.price.toLocaleString()}</p>
        <p className="text-muted-foreground">
          {block.donated > 0 && !locked && `$${block.donated.toLocaleString()} donated (${Math.round(progress * 100)}%)`}
          {block.donated === 0 && !locked && "Available for donation"}
          {block.donated === 0 && locked && "Not yet available for donation"}
          {block.donated > 0 && locked && `$${block.donated.toLocaleString()} donated (${Math.round(progress * 100)}%)`}
        </p>
        {block.donorLabel && <p className="text-primary font-medium">{block.donorLabel}</p>}
      </TooltipContent>
    </Tooltip>)}
