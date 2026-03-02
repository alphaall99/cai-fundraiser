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
// Grid: 16 cols × 16 rows, compact mosque with blocks aligned to bottom
function createMosqueShape(): number[][] {
  const COLS = 16;
  const ROWS = 16;
  const grid: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

  const fill = (row: number, c1: number, c2: number, tier: number) => {
    for (let c = c1; c <= c2; c++) {
      if (row >= 0 && row < ROWS && c >= 0 && c < COLS) {
        grid[row][c] = tier;
      }
    }
  };

  // === TIER 4 - Platinum (40 blocks): Dome + minaret tip ===
  // Minaret tip (col 13): rows 0-2 = 3
  for (let r = 0; r <= 2; r++) fill(r, 13, 13, 4);
  // Minaret upper (cols 12-14): rows 3-4 = 9
  for (let r = 3; r <= 5; r++) fill(r, 12, 14, 4);
  // Dome peak: row 3 cols 5-7 = 3
  fill(3, 5, 7, 4);
  // Dome mid: row 4 cols 3-9 = 7
  fill(4, 3, 9, 4);
  // Dome wide: row 5 cols 2-10 = 9
  fill(5, 2, 10, 4);
  // Dome base: row 6 cols 2-10 = 9
  fill(6, 2, 10, 4);
  // Total: 3+9+3+7+9+9 = 40 ✓

  // === TIER 3 - Gold (40 blocks): Upper walls + minaret body ===
  // Minaret body (cols 12-14): rows 6-11 = 18
  for (let r = 6; r <= 11; r++) fill(r, 12, 14, 3);
  // Upper wall row 7: cols 2-10 = 9
  fill(7, 2, 10, 3);
  // Upper wall row 8: cols 2-10 = 9
  fill(8, 2, 10, 3);
  // Row 9: cols 2-5 = 4
  fill(9, 2, 5, 3);
  // Total: 18+9+9+4 = 40 ✓

  // === TIER 2 - Silver (40 blocks): Main walls ===
  // Row 9: cols 6-10 = 5
  fill(9, 6, 10, 2);
  // Row 10: cols 1-11 = 11
  fill(10, 1, 11, 2);
  // Row 11: cols 1-11 = 11
  fill(11, 1, 11, 2);
  // Row 12: cols 1-11 = 11, but cut door cols 5-7 = 8
  fill(12, 1, 4, 2);
  fill(12, 8, 11, 2);
  // Row 13: cols 10-14 = 5 (side wall)
  fill(13, 10, 14, 2);
  // Total: 5+11+11+8+5 = 40 ✓

  // === TIER 1 - Bronze (40 blocks): Foundation ===
  // Row 12: cols 12-14 = 3
  fill(12, 12, 14, 1);
  // Row 13: cols 1-9 = 9 (with door cut cols 5-7 = 6)
  fill(13, 1, 4, 1);
  fill(13, 8, 9, 1);
  // Row 14: cols 0-15 = 16
  fill(14, 0, 15, 1);
  // Row 15: cols 0-15 = 16, cut middle 5-7 = 13
  fill(15, 0, 4, 1);
  fill(15, 8, 15, 1);
  // Total: 3+6+16+13 = 38... need 2 more
  // Add row 13 cols 5-7 door area back? No, keep door. Add cols 5,7 at row 15
  fill(15, 5, 6, 1); // +2
  // Total: 3+6+16+13+2 = 40 ✓

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
