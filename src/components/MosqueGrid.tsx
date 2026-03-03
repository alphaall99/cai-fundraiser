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

  let blockIndex = 0;

  return (
    <>
      <div className="w-full flex justify-center">
        <div
          className="relative w-full max-w-none rounded-3xl border shadow-lg overflow-hidden px-2 sm:px-6 pt-8 pb-10 sm:pb-12 bg-slate-900"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(15,23,42,0.88), rgba(15,23,42,0.55), rgba(15,23,42,0.15)), url('/ecole.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Subtle ground glow behind the mosque */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-emerald-900/80 via-emerald-900/40 to-transparent"
            aria-hidden="true"
          />

          {/* Mosque blocks kept intact, centered within the scene */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[220px] sm:min-h-[260px] md:min-h-[320px]">
            <div
              className="grid gap-[3px] w-full mx-auto bg-black/10 backdrop-blur-[2px] rounded-xl p-1.5 sm:p-2"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }}
            >
              {MOSQUE_SHAPE.flatMap((row, r) =>
                row.map((cell, c) => {
                  if (cell === 0) {
                    return <div key={`${r}-${c}`} />;
                  }
                  const block = blockMap.get(`block-${r}-${c}`);
                  if (!block) return <div key={`${r}-${c}`} />;
              const isLocked =
                !activeBlockIds.has(block.id) &&
                block.donated < TIERS[block.tier].price;
                  const idx = blockIndex++;
                  return (
                    <DonationBlock
                      key={block.id}
                      block={block}
                      onClick={handleBlockClick}
                      locked={isLocked}
                      index={idx}
                    />
                  );
                })
              )}
            </div>
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
