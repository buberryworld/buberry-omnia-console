import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import cardSchemas, { Schema } from "../schemas/cardSchemas";
import { saveAs } from "file-saver";
import { create } from "ipfs-http-client";

const ipfsClient = create({ url: "https://ipfs.infura.io:5001/api/v0" });

const MetadataCreator: React.FC = () => {
  const [metadata, setMetadata] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [artworkType, setArtworkType] = useState("");
  const [edition, setEdition] = useState("");
  const [useCase, setUseCase] = useState("");
  const [specialTrait, setSpecialTrait] = useState("");
  const [cardType, setCardType] = useState<string>("");
  const [fields, setFields] = useState<Schema["fields"]>([]);
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [plots, setPlots] = useState<number | null>(null);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  const handleCardTypeChange = (type: string) => {
    setCardType(type);

    const schema = cardSchemas[type];
    if (schema) {
      setFields(schema.fields);
      setFieldValues({});
    } else {
      console.error(`No schema found for card type: ${type}`);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const addAttribute = () => {
    setAttributes((prev) => [...prev, { trait_type: "", value: "" }]);
  };

  const updateAttribute = (index: number, key: string, value: string) => {
    setAttributes((prev) =>
      prev.map((attr, i) =>
        i === index ? { ...attr, [key]: value } : attr
      )
    );
  };

  const removeAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const generateMetadata = () => {
    if (!name || !description || !imageUrl || !cardType) {
      alert("Please fill in all required fields.");
      return;
    }

    const currentDate = new Date().toISOString();
    const metadataJson = {
      version: "1.0.0",
      date: currentDate,
      name,
      creator: "Buberry Worldwide",
      description,
      image: imageUrl,
      type: "image/png",
      files: [
        {
          uri: imageUrl,
          is_default_file: true,
          type: "image/png",
        },
      ],
      properties: {
        "Artwork Type": artworkType,
        "Edition": edition,
        "Use Case": useCase,
        "Special Trait": specialTrait,
        ...(cardType === "Land" && plots !== null && { Plots: plots }),
        ...fieldValues,
        "Created By": "Buberry Worldwide",
      },
      attributes: attributes.map((attr) => ({
        trait_type: attr.trait_type,
        value: attr.value,
      })),
    };

    setMetadata(metadataJson);
  };

  const saveMetadataAsJson = () => {
    if (!metadata) {
      alert("Generate metadata before saving.");
      return;
    }
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" });
    saveAs(blob, `${metadata.name.replace(/ /g, "_").toLowerCase()}.json`);
  };

  const uploadToIPFS = async () => {
    if (!metadata) {
      alert("Generate metadata before uploading.");
      return;
    }
    try {
      const result = await ipfsClient.add(JSON.stringify(metadata));
      setIpfsHash(result.path);
      alert(`Metadata uploaded to IPFS. Hash: ${result.path}`);
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      alert("Failed to upload metadata to IPFS.");
    }
  };

  const copyToClipboard = () => {
    if (!metadata) {
      alert("Generate metadata before copying.");
      return;
    }
    navigator.clipboard.writeText(JSON.stringify(metadata, null, 2))
      .then(() => alert("Metadata copied to clipboard!"))
      .catch((err) => alert("Failed to copy metadata: " + err));
  };

  const clearAll = () => {
    setName("");
    setDescription("");
    setImageUrl("");
    setArtworkType("");
    setEdition("");
    setUseCase("");
    setSpecialTrait("");
    setCardType("");
    setFields([]);
    setFieldValues({});
    setPlots(null);
    setMetadata(null);
    setIpfsHash(null);
    setAttributes([]);
  };

  return (
    <Box
      sx={{
        position: "relative",
        padding: "20px",
        color: "00aa00",
        border: "0px solid #00AA00",
        borderRadius: "8px",
      }}
    >
      <Button
        variant="outlined"
        color="error"
        onClick={clearAll}
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
      >
        Clear
      </Button>

      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Metadata Creation Tool
      </Typography>

      {/* Input Fields */}
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        variant="standard"
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        variant="standard"
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        fullWidth
        variant="standard"
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Artwork Type"
        value={artworkType}
        onChange={(e) => setArtworkType(e.target.value)}
        fullWidth
        variant="standard"
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Edition"
        value={edition}
        onChange={(e) => setEdition(e.target.value)}
        fullWidth
        variant="standard"
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Use Case"
        value={useCase}
        onChange={(e) => setUseCase(e.target.value)}
        fullWidth
        variant="standard"
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="Special Trait"
        value={specialTrait}
        onChange={(e) => setSpecialTrait(e.target.value)}
        fullWidth
        variant="standard"
        sx={{ marginBottom: "16px" }}
      />
      <FormControl fullWidth sx={{ marginBottom: "16px" }}>
        <InputLabel>Card Type</InputLabel>
        <Select value={cardType} onChange={(e) => handleCardTypeChange(e.target.value)}>
          {Object.keys(cardSchemas).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Dynamic Fields */}
      {fields.map((field) => (
        <Box key={field.key} sx={{ marginBottom: "16px" }}>
          {field.type === "select" && (
            <FormControl fullWidth>
              <InputLabel>{field.label}</InputLabel>
              <Select
                value={fieldValues[field.key] || ""}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
              >
                {field.options?.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {field.type === "number" && (
            <TextField
              label={field.label}
              type="number"
              value={fieldValues[field.key] || ""}
              onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
              fullWidth
            />
          )}
        </Box>
      ))}

      {/* Land-Specific Field */}
      {cardType === "Land" && (
        <TextField
          label="Number of Plots"
          type="number"
          value={plots || ""}
          onChange={(e) => setPlots(Number(e.target.value))}
          fullWidth
          sx={{ marginBottom: "16px" }}
        />
      )}

      {/* Add Attribute Section */}
      <Button onClick={addAttribute} sx={{ marginBottom: "16px" }}>
        Add Attribute
      </Button>
      {attributes.map((attr, index) => (
        <Box key={index} display="flex" gap={2} mb={2}>
          <TextField
            label="Trait Type"
            value={attr.trait_type}
            onChange={(e) => updateAttribute(index, "trait_type", e.target.value)}
          />
          <TextField
            label="Value"
            value={attr.value}
            onChange={(e) => updateAttribute(index, "value", e.target.value)}
          />
          <Button variant="contained" color="error" onClick={() => removeAttribute(index)}>
            Remove
          </Button>
        </Box>
      ))}

      {/* Metadata Buttons */}
      <Box display="flex" flexDirection="row" gap={2} mb={3}>
        <Button variant="contained" onClick={generateMetadata}>
          Generate Metadata
        </Button>
        <Button variant="outlined" onClick={saveMetadataAsJson}>
          Save as JSON
        </Button>
        <Button variant="outlined" onClick={uploadToIPFS}>
          Upload to IPFS
        </Button>
        {metadata && (
          <Button variant="outlined" onClick={copyToClipboard}>
            Copy to Clipboard
          </Button>
        )}
      </Box>

      {/* Metadata Preview */}
      {metadata && (
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h6">Metadata Preview</Typography>
          <pre>{JSON.stringify(metadata, null, 2)}</pre>
        </Box>
      )}

      {/* IPFS Link */}
      {ipfsHash && (
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h6">IPFS Link</Typography>
          <Typography>
            <a
              href={`https://ipfs.io/ipfs/${ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on IPFS
            </a>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MetadataCreator;
