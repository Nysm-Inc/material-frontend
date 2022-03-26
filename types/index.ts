export const dailyMaterialList = ["Soil", "Oil", "Seed", "Iron"];

export const craftMaterialList = [
  "Brick",
  "BrickHouse",
  "Wood",
  "IronSword",
  "Steel",
  "Plastic",
  "Computer",
  "ElectronicsStore",
];

export type CraftMethod =
  | "craft_soil_2_brick"
  | "craft_brick_2_brickHouse"
  | "stake_soilAndSeed_2_wood"
  | "craft_soilAndSeed_2_wood"
  | "craft_ironAndWood_2_ironSword"
  | "stake_iron_2_steel"
  | "craft_iron_2_steel"
  | "stake_oil_2_plastic"
  | "craft_oil_2_plastic"
  | "craft_plasticAndSteel_2_computer"
  | "craft_computer_2_electronicsStore";

export type ElapsedStakeTime = {
  soilAndWood: number;
  iron: number;
  oil: number;
};

export type Receipe = {
  name: string;
  receipe: string;
  type: "send" | "stake";
  note: string;
  method: CraftMethod;
  condition: (dailyMaterials: number[], craftMaterials: number[], elapsedStakeTime: ElapsedStakeTime) => boolean;
};

export const receipes: Receipe[] = [
  {
    name: "Brick",
    receipe: "4 Soil",
    type: "send",
    note: "",
    method: "craft_soil_2_brick",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedStakeTime: ElapsedStakeTime): boolean => {
      return dailyMaterials[0] >= 4;
    },
  },
  {
    name: "BrickHouse",
    receipe: "4 Brick",
    type: "send",
    note: "",
    method: "craft_brick_2_brickHouse",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedStakeTime: ElapsedStakeTime): boolean => {
      return craftMaterials[0] >= 4;
    },
  },
  {
    name: "Wood",
    receipe: "1 Soil + 1 Seed",
    type: "stake",
    note: "100s",
    method: "stake_soilAndSeed_2_wood",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedStakeTime: ElapsedStakeTime): boolean => {
      return dailyMaterials[0] >= 1 && dailyMaterials[2] >= 1 && elapsedStakeTime.soilAndWood <= 0;
    },
  },
  {
    name: "Wood",
    receipe: "1 Soil + 1 Seed",
    type: "send",
    note: "",
    method: "craft_soilAndSeed_2_wood",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedStakeTime: ElapsedStakeTime): boolean => {
      return elapsedStakeTime.soilAndWood >= 100;
    },
  },
  {
    name: "IronSword",
    receipe: "1 Iron + 1 Wood",
    type: "send",
    note: "",
    method: "craft_ironAndWood_2_ironSword",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedStakeTime: ElapsedStakeTime): boolean => {
      return dailyMaterials[3] >= 1 && craftMaterials[2] >= 1;
    },
  },
  {
    name: "Steel",
    receipe: "1 Iron",
    type: "stake",
    note: "100s",
    method: "stake_iron_2_steel",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedStakeTime: ElapsedStakeTime): boolean => {
      return dailyMaterials[3] >= 1 && elapsedStakeTime.iron <= 0;
    },
  },
  {
    name: "Steel",
    receipe: "1 Iron",
    type: "send",
    note: "",
    method: "craft_iron_2_steel",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedStakeTime: ElapsedStakeTime): boolean => {
      return elapsedStakeTime.iron >= 100;
    },
  },
  {
    name: "Plastic",
    receipe: "1 Oil",
    type: "stake",
    note: "100s",
    method: "stake_oil_2_plastic",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedStakeTime: ElapsedStakeTime): boolean => {
      return dailyMaterials[1] >= 1 && elapsedStakeTime.oil <= 0;
    },
  },
  {
    name: "Plastic",
    receipe: "1 Oil",
    type: "send",
    note: "",
    method: "craft_oil_2_plastic",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedStakeTime: ElapsedStakeTime): boolean => {
      return elapsedStakeTime.oil >= 100;
    },
  },
  {
    name: "Computer",
    receipe: "2 Plastic + 1 Steel",
    type: "send",
    note: "",
    method: "craft_plasticAndSteel_2_computer",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedStakeTime: ElapsedStakeTime): boolean => {
      return craftMaterials[5] >= 2 && craftMaterials[4] >= 1;
    },
  },
  {
    name: "ElectronicsStore",
    receipe: "4 Computer",
    type: "send",
    note: "",
    method: "craft_computer_2_electronicsStore",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedStakeTime: ElapsedStakeTime): boolean => {
      return craftMaterials[6] >= 4;
    },
  },
];

export type WrapType = "wrap" | "unwrap";
export type MaterialType = "daily" | "craft";
export type Cart = {
  [key in WrapType]: {
    [key in MaterialType]: number[];
  };
};
