export interface Field {
  key: string;
  label: string;
  type: "select" | "number" | "text" | "group" | "select-multiple";
  options?: string[];
  range?: { min: number; max: number };
  fields?: Field[];
}


export interface Schema {
  type: string;
  fields: Field[];
}

// Define individual schemas
const landCardSchema: Schema = {
  type: "Land",
  fields: [
    { key: "biome", label: "Biome", type: "select", options: ["Temperate", "Desert", "Tropical"] },
    { key: "fertility", label: "Fertility (1-10)", type: "number", range: { min: 1, max: 10 } },
    { key: "water_availability", label: "Water Availability", type: "select", options: ["Low", "Medium", "Abundant"] },
    { key: "degradation", label: "Degradation (1-10)", type: "number", range: { min: 1, max: 10 } },
    {
      key: "capacity",
      label: "Capacity",
      type: "group",
      fields: [
        { key: "plots", label: "Number of Plots", type: "number", range: { min: 1, max: 100 } }, // Dynamically added field
        { key: "plant_types_allowed", label: "Plant Types Allowed", type: "select", options: ["Trees", "Shrubs"] }
      ]
    }
  ]
};

const treeCardSchema: Schema = {
  type: "Tree",
  fields: [
    { key: "stage", label: "Growth Stage", type: "select", options: ["Sapling", "Small Tree", "Fruit-Bearing"] },
    { key: "water_consumption", label: "Water Consumption", type: "number", range: { min: 1, max: 10 } },
    { key: "carbon_sequestration", label: "Carbon Sequestration Points", type: "number", range: { min: 0, max: 100 } },
    { key: "yield", label: "Yield (Fruit Tokens)", type: "number", range: { min: 0, max: 100 } }
  ]
};

const peopleCardSchema: Schema = {
  type: "People",
  fields: [
    { key: "role", label: "Role", type: "select", options: ["Farmer", "Scientist", "Forester"] },
    { key: "special_ability", label: "Special Ability", type: "text" },
    { key: "efficiency_bonus", label: "Efficiency Bonus", type: "number", range: { min: 1, max: 100 } },
    { key: "preferred_biome", label: "Preferred Biome", type: "select", options: ["Temperate", "Desert", "Rainforest"] }
  ]
};

// Aggregate all schemas into one object
const cardSchemas: Record<string, Schema> = {
  Land: landCardSchema,
  Tree: treeCardSchema,
  People: peopleCardSchema
};

export default cardSchemas;
