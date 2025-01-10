import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { saveAs } from "file-saver";
import {
  Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  PrivateKey,
} from "@hashgraph/sdk";

const NFTCreationTool: React.FC = () => {
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenMemo, setTokenMemo] = useState<string>("");
  const [supplyType, setSupplyType] = useState<string>("Infinite");
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nftRecords, setNftRecords] = useState<any[]>([]);

  const API_URL = "http://localhost:3001/api/nft-records";

  // Fetch NFT records from server on load
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(API_URL);
        setNftRecords(response.data);
      } catch (error) {
        console.error("Error fetching NFT records:", error);
      }
    };
    fetchRecords();
  }, []);

  const createNFT = async () => {
    setIsLoading(true);
    setTokenId(null);

    try {
      const client = Client.forTestnet();
      client.setOperator(
        process.env.REACT_APP_MY_ACCOUNT_ID!,
        process.env.REACT_APP_MY_PRIVATE_KEY!
      );

      const supplyKey = PrivateKey.fromString(process.env.REACT_APP_MY_SUPPLY_KEY!);

      const transaction = new TokenCreateTransaction()
        .setTokenName(tokenName)
        .setTokenSymbol(tokenSymbol)
        .setTokenMemo(tokenMemo)
        .setDecimals(0)
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(
          supplyType === "Infinite"
            ? TokenSupplyType.Infinite
            : TokenSupplyType.Finite
        )
        .setInitialSupply(0)
        .setTreasuryAccountId(process.env.REACT_APP_MY_ACCOUNT_ID!)
        .setSupplyKey(supplyKey)
        .freezeWith(client);

      const signedTransaction = await transaction.sign(supplyKey);
      const response = await signedTransaction.execute(client);
      const receipt = await response.getReceipt(client);

      const newTokenId = receipt.tokenId?.toString() || "Unknown";
      setTokenId(newTokenId);

      // Save to state and server
      const newRecord = {
        tokenId: newTokenId,
        tokenName,
        tokenSymbol,
        tokenMemo,
        supplyType,
        creationDate: new Date().toISOString(),
      };

      setNftRecords((prevRecords) => [...prevRecords, newRecord]);

      // Save to server
      await axios.post(API_URL, newRecord);

      alert(`Token created successfully! Token ID: ${newTokenId}`);
    } catch (error) {
      console.error("Error creating NFT:", error);
      alert("Failed to create NFT. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveToJson = () => {
    const blob = new Blob([JSON.stringify(nftRecords, null, 2)], { type: "application/json" });
    saveAs(blob, "nft_records.json");
  };

  const saveToCsv = () => {
    const csvHeader = "Token ID,Token Name,Token Symbol,Token Memo,Supply Type,Creation Date\n";
    const csvRows = nftRecords
      .map((record) =>
        [
          record.tokenId,
          record.tokenName,
          record.tokenSymbol,
          record.tokenMemo,
          record.supplyType,
          record.creationDate,
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    saveAs(blob, "nft_records.csv");
  };

  return (
    <Box sx={{ padding: "20px", fontFamily: "Courier New, monospace", color: "#00FF00" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        NFT Creation Tool
      </Typography>
      <Divider sx={{ marginBottom: "20px" }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <TextField
          label="Token Name"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Token Symbol"
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
          fullWidth
        />
        <TextField
          label="Token Memo"
          value={tokenMemo}
          onChange={(e) => setTokenMemo(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Supply Type</InputLabel>
          <Select
            value={supplyType}
            onChange={(e) => setSupplyType(e.target.value)}
          >
            <MenuItem value="Infinite">Infinite</MenuItem>
            <MenuItem value="Finite">Finite</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: "8px", marginTop: "20px" }}>
          <Button
            variant="contained"
            onClick={createNFT}
            disabled={isLoading}
            sx={{ backgroundColor: "#00FF00", color: "#000", "&:hover": { backgroundColor: "#00CC00" } }}
          >
            {isLoading ? "Creating..." : "Create NFT"}
          </Button>
          <Button variant="outlined" onClick={saveToJson}>
            Save JSON
          </Button>
          <Button variant="outlined" onClick={saveToCsv}>
            Save CSV
          </Button>
        </Box>
      </Box>

      {tokenId && (
        <Box
          sx={{
            marginTop: "20px",
            padding: "16px",
            border: "1px solid #00FF00",
            borderRadius: "8px",
            backgroundColor: "#101010",
          }}
        >
          <Typography variant="h5">Created Token</Typography>
          <Typography>Token ID: {tokenId}</Typography>
        </Box>
      )}

      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="h5">NFT Records</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Token ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Memo</TableCell>
                <TableCell>Supply Type</TableCell>
                <TableCell>Creation Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nftRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.tokenId}</TableCell>
                  <TableCell>{record.tokenName}</TableCell>
                  <TableCell>{record.tokenSymbol}</TableCell>
                  <TableCell>{record.tokenMemo}</TableCell>
                  <TableCell>{record.supplyType}</TableCell>
                  <TableCell>{record.creationDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default NFTCreationTool;
