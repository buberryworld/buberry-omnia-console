import express from "express";
import NFT from "../src/models/nft";


const app = express();
app.use(express.json());

// API to save NFT information
app.post("/api/save-nft", async (req, res) => {
    const { tokenId, name, symbol, memo, supplyType, metadataUrl, localJsonPath, localImagePath } = req.body;

    try {
        const newNFT = await NFT.create({
            tokenId,
            name,
            symbol,
            memo,
            supplyType,
            metadataUrl,
            localJsonPath,
            localImagePath,
        });

        res.status(201).json({ message: "NFT saved successfully!", nft: newNFT });
    } catch (error) {
        console.error("Error saving NFT:", error);
        res.status(500).json({ error: "Failed to save NFT to the database." });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});
