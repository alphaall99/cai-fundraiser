// Mosque shape definition generated programmatically
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
  donated: number;
  donorName: string | null;
  donorLabel: string | null;
}

// Generate mosque shape: 48 cols × 46 rows
// Matches the reference building: steeple on left, A-frame roof, brick walls, entrance
function createMosqueShape(): number[][] {
  const COLS = 48;
  const ROWS = 46;
  const grid: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

  const fill = (row: number, c1: number, c2: number, tier: number) => {
    for (let c = c1; c <= c2; c++) {
      if (row >= 0 && row < ROWS && c >= 0 && c < COLS) {
        grid[row][c] = tier;
      }
    }
  };

  const clear = (row: number, c1: number, c2: number) => {
    for (let c = c1; c <= c2; c++) {
      if (row >= 0 && row < ROWS && c >= 0 && c < COLS) {
        grid[row][c] = 0;
      }
    }
  };

  // === STEEPLE TIP (tier 4 - Platinum) ===
  fill(0, 5, 5, 4);
  for (let r = 1; r <= 5; r++) fill(r, 4, 6, 4);
  for (let r = 6; r <= 7; r++) fill(r, 3, 7, 4);

  // === ROOF PEAK (tier 4) ===
  fill(8, 26, 26, 4);
  fill(9, 25, 27, 4);

  // === STEEPLE BODY (tier 3 - Gold) ===
  for (let r = 8; r <= 23; r++) fill(r, 3, 7, 3);

  // === MAIN A-FRAME ROOF (tier 3) ===
  for (let r = 10; r <= 23; r++) {
    const halfWidth = r - 8;
    fill(r, 26 - halfWidth, 26 + halfWidth, 3);
  }

  // === BRICK WALLS (tier 2 - Silver) ===
  for (let r = 24; r <= 35; r++) fill(r, 3, 43, 2);

  // === WINDOWS (clear openings in walls) ===
  for (let r = 27; r <= 30; r++) {
    clear(r, 16, 17);
    clear(r, 24, 25);
    clear(r, 33, 34);
  }

  // === FOUNDATION & BASE (tier 1 - Bronze) ===
  for (let r = 36; r <= 45; r++) fill(r, 0, 47, 1);

  // === ENTRANCE DOORWAY (clear) ===
  for (let r = 37; r <= 41; r++) clear(r, 22, 27);

  return grid;
}

export const MOSQUE_SHAPE = createMosqueShape();

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
