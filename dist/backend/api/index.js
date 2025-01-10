"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nft_1 = __importDefault(require("../src/models/nft"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// API to save NFT information
app.post("/api/save-nft", async (req, res) => {
    const { tokenId, name, symbol, memo, supplyType, metadataUrl, localJsonPath, localImagePath } = req.body;
    try {
        const newNFT = await nft_1.default.create({
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
    }
    catch (error) {
        console.error("Error saving NFT:", error);
        res.status(500).json({ error: "Failed to save NFT to the database." });
    }
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});
