import { useState, useMemo } from "react";
import { BlockData, MOSQUE_SHAPE, TIERS } from "@/lib/mosqueData";
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
      <div className="w-full max-w-5xl mx-auto">
        <div
          className="grid gap-[1px]"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {MOSQUE_SHAPE.flatMap((row, r) =>
            row.map((cell, c) => {
              if (cell === 0) {
                return <div key={`${r}-${c}`} className="aspect-square" />;
              }
              const block = blockMap.get(`block-${r}-${c}`);
              if (!block) return <div key={`${r}-${c}`} className="aspect-square" />;
              const idx = blockIndex++;
              return (
                <DonationBlock
                  key={block.id}
                  block={block}
                  onClick={handleBlockClick}
                  index={idx}
                />
              );
            })
          )}
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
