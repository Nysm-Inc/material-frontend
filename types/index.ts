import { PhiIron, PhiOil, PhiSeed, PhiSoil } from "~/public";

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
  | "forge_soilAndSeed_2_wood"
  | "craft_soilAndSeed_2_wood"
  | "craft_ironAndWood_2_ironSword"
  | "forge_iron_2_steel"
  | "craft_iron_2_steel"
  | "forge_oil_2_plastic"
  | "craft_oil_2_plastic"
  | "craft_plasticAndSteel_2_computer"
  | "craft_computer_2_electronicsStore";

export type ElapsedForgeTime = {
  soilAndWood: number;
  iron: number;
  oil: number;
};

export type Recipe = {
  name: string;
  recipe: string;
  note: string;
  method: CraftMethod;
  condition: (dailyMaterials: number[], craftMaterials: number[], elapsedForgeTime: ElapsedForgeTime) => boolean;
};

export const recipes: Recipe[] = [
  {
    name: "Brick",
    recipe: "4 Soil",
    note: "",
    method: "craft_soil_2_brick",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedForgeTime: ElapsedForgeTime): boolean => {
      return dailyMaterials[0] >= 4;
    },
  },
  {
    name: "BrickHouse",
    recipe: "4 Brick",
    note: "",
    method: "craft_brick_2_brickHouse",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedForgeTime: ElapsedForgeTime): boolean => {
      return craftMaterials[0] >= 4;
    },
  },
  {
    name: "Wood",
    recipe: "1 Soil + 1 Seed",
    note: "100s",
    method: "forge_soilAndSeed_2_wood",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedForgeTime: ElapsedForgeTime): boolean => {
      return dailyMaterials[0] >= 1 && dailyMaterials[2] >= 1 && elapsedForgeTime.soilAndWood <= 0;
    },
  },
  {
    name: "Wood",
    recipe: "1 Soil + 1 Seed",
    note: "",
    method: "craft_soilAndSeed_2_wood",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedForgeTime: ElapsedForgeTime): boolean => {
      return elapsedForgeTime.soilAndWood >= 100;
    },
  },
  {
    name: "IronSword",
    recipe: "1 Iron + 1 Wood",
    note: "",
    method: "craft_ironAndWood_2_ironSword",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedForgeTime: ElapsedForgeTime): boolean => {
      return dailyMaterials[3] >= 1 && craftMaterials[2] >= 1;
    },
  },
  {
    name: "Steel",
    recipe: "1 Iron",
    note: "100s",
    method: "forge_iron_2_steel",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedForgeTime: ElapsedForgeTime): boolean => {
      return dailyMaterials[3] >= 1 && elapsedForgeTime.iron <= 0;
    },
  },
  {
    name: "Steel",
    recipe: "1 Iron",
    note: "",
    method: "craft_iron_2_steel",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedForgeTime: ElapsedForgeTime): boolean => {
      return elapsedForgeTime.iron >= 100;
    },
  },
  {
    name: "Plastic",
    recipe: "1 Oil",
    note: "100s",
    method: "forge_oil_2_plastic",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedForgeTime: ElapsedForgeTime): boolean => {
      return dailyMaterials[1] >= 1 && elapsedForgeTime.oil <= 0;
    },
  },
  {
    name: "Plastic",
    recipe: "1 Oil",
    note: "",
    method: "craft_oil_2_plastic",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedForgeTime: ElapsedForgeTime): boolean => {
      return elapsedForgeTime.oil >= 100;
    },
  },
  {
    name: "Computer",
    recipe: "2 Plastic + 1 Steel",
    note: "",
    method: "craft_plasticAndSteel_2_computer",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedForgeTime: ElapsedForgeTime): boolean => {
      return craftMaterials[5] >= 2 && craftMaterials[4] >= 1;
    },
  },
  {
    name: "ElectronicsStore",
    recipe: "4 Computer",
    note: "",
    method: "craft_computer_2_electronicsStore",
    condition: (dailyMaterials: number[], craftMaterials: number[], elapsedForgeTime: ElapsedForgeTime): boolean => {
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

export const PhiImages: { daily: StaticImageData[]; craft: StaticImageData[] } = {
  daily: [PhiSoil, PhiOil, PhiSeed, PhiIron],
  craft: [],
};
