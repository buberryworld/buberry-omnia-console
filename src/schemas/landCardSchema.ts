const landCardSchema = {
  type: "Land",
  fields: [
    { key: "biome", label: "Biome", type: "select", options: ["Temperate", "Desert", "Tropical", "Arctic"] },
    { key: "fertility", label: "Fertility (1-10)", type: "number", range: { min: 1, max: 10 } },
    { key: "water_availability", label: "Water Availability", type: "select", options: ["Low", "Medium", "Abundant"] },
    { key: "degradation", label: "Degradation (1-10)", type: "number", range: { min: 1, max: 10 } },
    {
      key: "resource_potential",
      label: "Resource Potential",
      type: "group",
      fields: [
        { key: "soil_quality", label: "Soil Quality (1-10)", type: "number", range: { min: 1, max: 10 } },
        { key: "climate_stability", label: "Climate Stability (1-10)", type: "number", range: { min: 1, max: 10 } }
      ]
    }
  ]
};

export default landCardSchema;
