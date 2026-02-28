import { Phase, Organism } from "./types";

/**
 * Calculates the phenotype based on the current game phase.
 * Phase 1: Mendelian (1 gene, 2 states)
 * Phase 2: Fragile (1 gene, 3 states - incomplete dominance)
 * Phase 3: Multi-gene (4 genes, additive)
 * Phase 4: Polygenic (20 genes, additive)
 * Phase 5: Robustness (20 genes, additive + thresholding/buffering)
 * Phase 6: Selection/Drift (20 genes, additive)
 */
export function calculatePhenotype(genotype: number[], phase: Phase): number {
  switch (phase) {
    case Phase.MENDELIAN_SIMPLICITY:
      // Only look at the first gene (2 alleles)
      // 0,0 -> 0; 0,1 or 1,0 or 1,1 -> 1 (Dominant)
      return (genotype[0] + genotype[1]) > 0 ? 1 : 0;

    case Phase.FRAGILE_MENDELIAN:
      // Incomplete dominance: 0,0 -> 0; 0,1 -> 0.5; 1,1 -> 1
      return (genotype[0] + genotype[1]) / 2;

    case Phase.MULTI_GENE:
      // 4 genes (8 alleles), additive
      const sum3 = genotype.slice(0, 8).reduce((a, b) => a + b, 0);
      return sum3 / 8;

    case Phase.FULLY_POLYGENIC:
    case Phase.SELECTION_DRIFT:
      // 20 genes (40 alleles), additive
      const sum4 = genotype.reduce((a, b) => a + b, 0);
      return sum4 / genotype.length;

    default:
      return 0;
  }
}

export function createInitialPopulation(size: number, numGenes: number, phase: Phase): Organism[] {
  return Array.from({ length: size }, (_, i) => {
    const genotype = Array.from({ length: numGenes * 2 }, () => Math.random() > 0.5 ? 1 : 0);
    return {
      id: Math.random().toString(36).substr(2, 9),
      genotype,
      phenotype: calculatePhenotype(genotype, phase),
    };
  });
}

export function reproduce(
  parentA: Organism,
  parentB: Organism,
  mutationRate: number,
  phase: Phase
): Organism {
  const numGenes = parentA.genotype.length / 2;
  const childGenotype: number[] = [];

  for (let i = 0; i < numGenes; i++) {
    // Inherit one allele from each parent for each gene
    const alleleA = parentA.genotype[i * 2 + (Math.random() > 0.5 ? 0 : 1)];
    const alleleB = parentB.genotype[i * 2 + (Math.random() > 0.5 ? 0 : 1)];

    let finalA = alleleA;
    let finalB = alleleB;

    // Mutation
    if (Math.random() < mutationRate) finalA = 1 - finalA;
    if (Math.random() < mutationRate) finalB = 1 - finalB;

    childGenotype.push(finalA, finalB);
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    genotype: childGenotype,
    phenotype: calculatePhenotype(childGenotype, phase),
  };
}
