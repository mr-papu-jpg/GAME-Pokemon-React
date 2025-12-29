export type Pokemon = {
  id: number;
  name: string;
  sprites: { front_default: string; back_default: string }; // Añadimos back para el jugador
  stats: { base_stat: number; stat: { name: string } }[]; // Para HP y Ataque
  types: { type: { name: string } }[];
}

export type User = {
  name: string;
  level: number;
  experience: number;
  pokemonTeam: Pokemon[];
}

