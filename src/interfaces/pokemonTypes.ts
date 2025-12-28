export type Pokemon = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    }
  }[];
}

export type User = {
  name: string;
  level: number;
  pokemonTeam: Pokemon[];
}

