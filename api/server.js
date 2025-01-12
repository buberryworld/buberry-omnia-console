const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3001;
const filePath = "./nft_records.json";
const stateFilePath = "./app_state.json"; // New file for app state

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Ensure files exist
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}
if (!fs.existsSync(stateFilePath)) {
  fs.writeFileSync(stateFilePath, JSON.stringify({}));
}

// Get all NFT records
app.get("/api/nft-records", (req, res) => {
  const data = fs.readFileSync(filePath, "utf8");
  res.json(JSON.parse(data));
});

// Save NFT records
app.post("/api/nft-records", (req, res) => {
  const newRecord = req.body;
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  data.push(newRecord);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.status(201).send("NFT record saved.");
});

// Get app state
app.get("/api/state", (req, res) => {
  const data = fs.readFileSync(stateFilePath, "utf8");
  res.json(JSON.parse(data));
});

// Save app state
app.post("/api/state", (req, res) => {
  const newState = req.body;
  fs.writeFileSync(stateFilePath, JSON.stringify(newState, null, 2));
  res.status(201).send("App state saved.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
