const landCardSchema = {
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
          { key: "plots", label: "Plots", type: "number", range: { min: 1, max: 10 } },
          { key: "plant_types_allowed", label: "Plant Types Allowed", type: "select-multiple", options: ["Trees", "Shrubs"] }
        ]
      }
    ]
  };
  
  export default landCardSchema;
  