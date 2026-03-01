// Mosque shape definition as a 2D grid
// 0 = empty, 1 = tier 1 ($500), 2 = tier 2 ($1000), 3 = tier 3 ($2500), 4 = tier 4 ($5000)

export const TIERS = {
  1: { price: 500, label: "Bronze", color: "tier-1" },
  2: { price: 1000, label: "Silver", color: "tier-2" },
  3: { price: 2500, label: "Gold", color: "tier-3" },
  4: { price: 5000, label: "Platinum", color: "tier-4" },
} as const;

export type TierKey = keyof typeof TIERS;

export interface BlockData {
  id: string;
  row: number;
  col: number;
  tier: TierKey;
  donated: number; // amount donated so far
  donorName: string | null;
  donorLabel: string | null;
}

// Mosque shape: 24 cols x 20 rows
// The mosque has a dome, walls, door, and a minaret on the right
export const MOSQUE_SHAPE: number[][] = [
  // Row 0-2: Sky / dome top
  [0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0],
  // Row 3-4: Dome widening
  [0,0,0,0,0,0,0,4,4,4,4,4,4,4,0,0,0,0,0,0,0,3,0,0],
  [0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,3,0,0],
  // Row 5-6: Dome base / upper wall
  [0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,3,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,3,3,3,0],
  // Row 7-9: Upper walls
  [0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,3,3,3,0],
  [0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,3,3,3,0],
  [0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,3,3,3,0],
  // Row 10-12: Middle walls with arches
  [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,0],
  [0,0,2,2,2,0,0,2,2,2,0,0,2,2,2,0,0,2,2,0,2,2,2,0],
  [0,0,2,2,2,0,0,2,2,2,0,0,2,2,2,0,0,2,2,0,2,2,2,0],
  // Row 13-15: Lower walls
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  // Row 16-18: Base with door
  [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
  // Row 19: Foundation
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export function generateBlocks(): BlockData[] {
  const blocks: BlockData[] = [];
  MOSQUE_SHAPE.forEach((row, r) => {
    row.forEach((tier, c) => {
      if (tier > 0) {
        blocks.push({
          id: `block-${r}-${c}`,
          row: r,
          col: c,
          tier: tier as TierKey,
          donated: 0,
          donorName: null,
          donorLabel: null,
        });
      }
    });
  });
  return blocks;
}

// Generate some sample donated blocks for demo
export function generateDemoBlocks(): BlockData[] {
  const blocks = generateBlocks();
  // Fill some blocks randomly for demo
  const demoNames = ["Ahmed", "Fatima", "Omar", "Aisha", "Yusuf", "Khadija", "Ibrahim", "Maryam"];
  blocks.forEach((block, i) => {
    if (Math.random() < 0.25) {
      const tier = TIERS[block.tier];
      const progress = Math.random();
      block.donated = Math.round(tier.price * progress / 100) * 100;
      if (progress > 0.8) {
        block.donorName = demoNames[i % demoNames.length];
        block.donorLabel = `${demoNames[i % demoNames.length]}'s Family`;
      }
    }
  });
  return blocks;
}
