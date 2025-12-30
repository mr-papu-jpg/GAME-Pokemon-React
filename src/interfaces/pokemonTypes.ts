export type Pokemon = {
  id: number;
  name: string;
  sprites: { front_default: string; back_default: string };
  stats: { base_stat: number; stat: { name: string } }[];
  types: { type: { name: string } }[];
  currentStage: number;
  currentHp?: number;
}

export type Inventory = {
  pokeballs: { sencilla: number; normal: number; maestra: number };
  potions: {
    healing: { sencilla: number; normal: number; avanzada: number };
    damage: { sencilla: number; normal: number; avanzada: number };
    defense: { sencilla: number; normal: number; avanzada: number };
  };
}

export type User = {
  name: string;
  pokemonTeam: any[];
  experience: number;
  level: number;
  currentStage: number;
  gold: number;
  inventory: Inventory;
}
