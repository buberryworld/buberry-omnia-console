import fs from "fs";
import path from "path";

const stateFilePath = path.join(process.cwd(), "state.json");

// Ensure the file exists
if (!fs.existsSync(stateFilePath)) {
  fs.writeFileSync(stateFilePath, JSON.stringify({ tokens: [], landStakings: [] }, null, 2));
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Fetch state
    const data = fs.readFileSync(stateFilePath, "utf8");
    res.status(200).json(JSON.parse(data));
  } else if (req.method === "POST") {
    // Save state
    const newState = req.body;
    fs.writeFileSync(stateFilePath, JSON.stringify(newState, null, 2));
    res.status(201).json({ message: "State saved successfully." });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
