import { useState, useMemo } from "react";
import { BlockData, MOSQUE_SHAPE, TIERS, TierKey } from "@/lib/mosqueData";
import DonationBlock from "./DonationBlock";
import DonationModal from "./DonationModal";

interface MosqueGridProps {
  blocks: BlockData[];
  onBlocksChange: (blocks: BlockData[]) => void;
}

export default function MosqueGrid({ blocks, onBlocksChange }: MosqueGridProps) {
  const [selectedBlock, setSelectedBlock] = useState<BlockData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const blockMap = useMemo(() => {
    const map = new Map<string, BlockData>();
    blocks.forEach((b) => map.set(b.id, b));
    return map;
  }, [blocks]);

  const cols = MOSQUE_SHAPE[0].length;
  const rows = MOSQUE_SHAPE.length;

  // Deterministic, bottom-left → top-right ordering per tier
  const tierOrder = useMemo(() => {
    const order: Record<TierKey, string[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
    };

    for (let r = rows - 1; r >= 0; r--) {
      for (let c = 0; c < cols; c++) {
        const tier = MOSQUE_SHAPE[r][c] as TierKey | 0;
        if (!tier) continue;
        const id = `block-${r}-${c}`;
        order[tier].push(id);
      }
    }

    return order;
  }, [rows, cols]);

  // For each tier, only the next incomplete block in sequence is interactable
  const activeBlockIds = useMemo(() => {
    const ids = new Set<string>();

    (Object.keys(TIERS) as unknown as TierKey[]).forEach((tierKey) => {
      const sequence = tierOrder[tierKey] || [];
      const nextAvailableId = sequence.find((id) => {
        const b = blockMap.get(id);
        if (!b) return false;
        const tier = TIERS[b.tier];
        return b.donated < tier.price;
      });

      if (nextAvailableId) {
        ids.add(nextAvailableId);
      }
    });

    return ids;
  }, [blockMap, tierOrder]);

  const handleBlockClick = (block: BlockData) => {
    const tier = TIERS[block.tier];
    if (block.donated >= tier.price) return; // fully funded
    setSelectedBlock(block);
    setModalOpen(true);
  };

  const handleDonate = (blockId: string, amount: number, name: string, label: string) => {
    const updated = blocks.map((b) => {
      if (b.id === blockId) {
        const newDonated = Math.min(b.donated + amount, TIERS[b.tier].price);
        return {
          ...b,
          donated: newDonated,
          donorName: name,
          donorLabel: label,
        };
      }
      return b;
    });
    onBlocksChange(updated);
  };

  // Sort blocks per tier: reserved (donated) first, then active, then locked
  const sortedTierBlocks = useMemo(() => {
    const result: { tierKey: TierKey; blocks: { block: BlockData; isLocked: boolean; isActive: boolean }[] }[] = [];

    (Object.keys(TIERS) as unknown as TierKey[]).forEach((tierKey) => {
      const tierNum = Number(tierKey) as TierKey;
      const sequence = tierOrder[tierNum] || [];
      const sorted: { block: BlockData; isLocked: boolean; isActive: boolean }[] = [];

      const reserved: typeof sorted = [];
      const active: typeof sorted = [];
      const locked: typeof sorted = [];

      sequence.forEach((id) => {
        const block = blockMap.get(id);
        if (!block) return;
        const tier = TIERS[block.tier];
        const isFull = block.donated >= tier.price;
        const isActive = activeBlockIds.has(block.id);
        const isLocked = !isActive && block.donated < tier.price;

        if (isFull || (block.donated > 0 && !isActive)) {
          reserved.push({ block, isLocked: false, isActive: false });
        } else if (isActive) {
          active.push({ block, isLocked: false, isActive: true });
        } else {
          locked.push({ block, isLocked: true, isActive: false });
        }
      });

      sorted.push(...reserved, ...active, ...locked);
      result.push({ tierKey: tierNum, blocks: sorted });
    });

    return result;
  }, [blockMap, tierOrder, activeBlockIds]);

  return (
    <>
      <div className="w-full flex justify-center">
        <div
          className="relative w-full max-w-4xl rounded-3xl border shadow-lg overflow-hidden px-4 sm:px-8 pt-8 pb-10 sm:pb-12 bg-slate-900"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(15,23,42,0.92), rgba(15,23,42,0.7), rgba(15,23,42,0.3)), url('/ecole.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 space-y-6">
            {sortedTierBlocks.map(({ tierKey, blocks: tierBlocks }) => (
              <div key={tierKey}>
                <h3 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wider">
                  {TIERS[tierKey].label} — ${TIERS[tierKey].price.toLocaleString()}
                </h3>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {tierBlocks.map(({ block, isLocked, isActive }, idx) => (
                    <DonationBlock
                      key={block.id}
                      block={block}
                      onClick={handleBlockClick}
                      locked={isLocked}
                      active={isActive}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DonationModal
        block={selectedBlock}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onDonate={handleDonate}
      />
    </>
  );
}
