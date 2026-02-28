export enum Phase {
  MENDELIAN_SIMPLICITY = 1,
  FRAGILE_MENDELIAN = 2,
  MULTI_GENE = 3,
  FULLY_POLYGENIC = 4,
  SELECTION_DRIFT = 5,
}

export interface Organism {
  id: string;
  genotype: number[]; // Array of 0 or 1 (alleles)
  phenotype: number;  // Calculated value based on phase
}

export interface PopulationStats {
  mean: number;
  variance: number;
  size: number;
  generation: number;
}

export interface GameState {
  phase: Phase;
  population: Organism[];
  generation: number;
  mutationRate: number;
  selectionStrength: number;
  targetPhenotype: number | null;
  populationSize: number;
}
