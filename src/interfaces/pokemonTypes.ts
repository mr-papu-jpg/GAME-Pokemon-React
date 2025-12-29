export type Pokemon = {
  id: number;
  name: string;
  sprites: { front_default: string; back_default: string };
  stats: { base_stat: number; stat: { name: string } }[];
  types: { type: { name: string } }[];
  currentStage: number;
}

export type User = {
  name: string;
  level: number;
  experience: number;
  pokemonTeam: Pokemon[];
}

