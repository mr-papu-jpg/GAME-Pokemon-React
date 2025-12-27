export interface User {
  username: string;
  level: number;
  id: string;
}

export interface Pokemon {
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
