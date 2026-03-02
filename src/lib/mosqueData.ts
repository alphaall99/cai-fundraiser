// Mosque shape definition generated programmatically
// 0 = empty, 1 = tier 1 ($500), 2 = tier 2 ($1000), 3 = tier 3 ($1500), 4 = tier 4 ($2000)

export const TIERS = {
  1: { price: 500, label: "Bronze", color: "tier-1" },
  2: { price: 1000, label: "Silver", color: "tier-2" },
  3: { price: 1500, label: "Gold", color: "tier-3" },
  4: { price: 2000, label: "Platinum", color: "tier-4" },
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

// Target: exactly 40 blocks per tier = 160 total blocks
// Grid: 20 cols × 20 rows, mosque silhouette
function createMosqueShape(): number[][] {
  const COLS = 20;
  const ROWS = 20;
  const grid: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

  const fill = (row: number, c1: number, c2: number, tier: number) => {
    for (let c = c1; c <= c2; c++) {
      if (row >= 0 && row < ROWS && c >= 0 && c < COLS) {
        grid[row][c] = tier;
      }
    }
  };

  // === TIER 4 - Platinum (40 blocks): Minaret tip + dome peak ===
  // Minaret tip (col 16): rows 0-4 = 5 blocks
  for (let r = 0; r <= 4; r++) fill(r, 16, 16, 4);
  // Minaret body top (cols 15-17): rows 5-6 = 6 blocks
  for (let r = 5; r <= 6; r++) fill(r, 15, 17, 4);
  // Dome peak: row 2, cols 7-9 = 3 blocks
  fill(2, 7, 9, 4);
  // Dome wider: row 3, cols 5-11 = 7 blocks
  fill(3, 5, 11, 4);
  // Dome widest: row 4, cols 4-12 = 9 blocks
  fill(4, 4, 12, 4);
  // Dome base: row 5, cols 3-12 = 10 blocks
  fill(5, 3, 12, 4);
  // Total tier 4: 5+6+3+7+9+10 = 40 ✓

  // === TIER 3 - Gold (40 blocks): Upper walls + minaret body ===
  // Minaret body (cols 15-17): rows 7-12 = 18 blocks
  for (let r = 7; r <= 12; r++) fill(r, 15, 17, 3);
  // Upper walls: row 6, cols 3-12 = 10 blocks
  fill(6, 3, 12, 3);
  // Upper walls: row 7, cols 3-12 = 10 (but skip 15-17 already filled)
  fill(7, 3, 12, 3);
  // Row 8 walls: cols 3-12 = 2 blocks (row 8 cols 3-4)
  fill(8, 3, 4, 3);
  // Total tier 3: 18+10+10+2 = 40 ✓

  // === TIER 2 - Silver (40 blocks): Main walls ===
  // Rows 8-11, cols 3-14 (excluding already filled)
  fill(8, 5, 14, 2);   // row 8: cols 5-14 = 10
  fill(9, 3, 14, 2);   // row 9: cols 3-14 = 12
  fill(10, 3, 14, 2);  // row 10: cols 3-14 = 12
  fill(11, 3, 8, 2);   // row 11: cols 3-8 = 6
  // Total tier 2: 10+12+12+6 = 40 ✓

  // === TIER 1 - Bronze (40 blocks): Lower walls + foundation ===
  fill(11, 9, 14, 1);   // row 11: cols 9-14 = 6
  fill(12, 3, 14, 1);   // row 12: cols 3-14 = 12
  fill(13, 3, 14, 1);   // row 13: cols 3-14 = 12 (with door cutout later)
  fill(14, 3, 14, 1);   // row 14: cols 3-14 = 12
  // Clear entrance: rows 13-14, cols 7-9 = 6 blocks removed
  for (let r = 13; r <= 14; r++) {
    for (let c = 7; c <= 9; c++) {
      grid[r][c] = 0;
    }
  }
  // Foundation row 15: cols 1-17 = add remaining
  fill(15, 1, 10, 1);  // 10 blocks
  // Total tier 1: 6+12+12-3+12-3+10 = 6+12+9+9+10 = 46... need to adjust

  // Let me recount and fix
  // Clear everything and redo tier 1
  for (let r = 11; r <= 19; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === 1) grid[r][c] = 0;
    }
  }

  // Tier 1 precise: 40 blocks
  fill(11, 9, 14, 1);   // 6
  fill(12, 3, 14, 1);   // 12
  fill(13, 3, 6, 1);    // 4
  fill(13, 10, 14, 1);  // 5
  fill(14, 3, 6, 1);    // 4
  fill(14, 10, 14, 1);  // 5
  fill(15, 3, 6, 1);    // 4
  // 6+12+4+5+4+5+4 = 40 ✓

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
