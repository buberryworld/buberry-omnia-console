import React, { useEffect, useState } from "react";
import {
  Client,
  AccountBalanceQuery,
  AccountId,
  TokenBurnTransaction,
  TokenId,
  PrivateKey,
} from "@hashgraph/sdk";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { appConfig } from "../config";

const BurnTokenTool: React.FC = () => {
  const { walletInterface, accountId } = useWalletInterface();
  const [availableTokens, setAvailableTokens] = useState<any[]>([]);
  const [burnAmount, setBurnAmount] = useState<{ [key: string]: number }>({});
  const [serialNumbers, setSerialNumbers] = useState<{ [key: string]: number[] }>({});

  useEffect(() => {
    if (!accountId) return;

    const fetchTokenBalances = async () => {
      try {
        const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
        const tokens = await mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(
          AccountId.fromString(accountId)
        );
        setAvailableTokens(tokens);
      } catch (error) {
        console.error("Error fetching token balances:", error);
      }
    };

    fetchTokenBalances();
  }, [accountId]);

  const handleBurnToken = async (tokenId: string) => {
    if (!accountId) {
      console.error("Account ID is missing.");
      return;
    }

    try {
      const client = Client.forTestnet();
      client.setOperator(accountId, process.env.REACT_APP_MY_PRIVATE_KEY!);

      // Add the supply key
      const supplyKey = PrivateKey.fromString(process.env.REACT_APP_MY_SUPPLY_KEY!);

      const tokenInfo = availableTokens.find((token: any) => token.token_id === tokenId);
      if (!tokenInfo) {
        console.error("Token not found in available tokens.");
        return;
      }

      const transaction = new TokenBurnTransaction().setTokenId(TokenId.fromString(tokenId));

      if (tokenInfo.info.type === "NON_FUNGIBLE_UNIQUE") {
        // For NFTs, specify serial numbers
        const serialsToBurn = serialNumbers[tokenId] || [];
        if (serialsToBurn.length === 0) {
          alert("Please provide serial numbers for the NFT burn.");
          return;
        }
        transaction.setSerials(serialsToBurn);
      } else {
        // For fungible tokens, specify the amount
        const amountToBurn = burnAmount[tokenId] || 0;
        if (amountToBurn <= 0) {
          alert("Please provide a valid amount to burn.");
          return;
        }
        transaction.setAmount(amountToBurn);
      }

      transaction.freezeWith(client);

      // Sign with the supply key
      const signedTransaction = await transaction.sign(supplyKey);

      const response = await signedTransaction.execute(client);
      const receipt = await response.getReceipt(client);

      if (receipt.status.toString() === "SUCCESS") {
        alert(`Successfully burned token ${tokenId}.`);
        // Refresh token balances
        const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
        const tokens = await mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(
          AccountId.fromString(accountId)
        );
        setAvailableTokens(tokens);
      }
    } catch (error) {
      console.error("Error burning token:", error);
      alert("Failed to burn token. Please try again.");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Burn Tokens
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token Name</TableCell>
              <TableCell>Token ID</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Burn Amount</TableCell>
              <TableCell>Serial Numbers (NFTs)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {availableTokens.map((token: any) => (
              <TableRow key={token.token_id}>
                <TableCell>{token.info.name}</TableCell>
                <TableCell>{token.token_id}</TableCell>
                <TableCell>
                  {token.balance / Math.pow(10, Number(token.info.decimals))}
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={burnAmount[token.token_id] || ""}
                    onChange={(e) =>
                      setBurnAmount({
                        ...burnAmount,
                        [token.token_id]: Number(e.target.value),
                      })
                    }
                    disabled={token.info.type === "NON_FUNGIBLE_UNIQUE"}
                  />
                </TableCell>
                <TableCell>
                  {token.info.type === "NON_FUNGIBLE_UNIQUE" && (
                    <TextField
                      placeholder="e.g., 1,2,3"
                      size="small"
                      onChange={(e) =>
                        setSerialNumbers({
                          ...serialNumbers,
                          [token.token_id]: e.target.value
                            .split(",")
                            .map((num) => parseInt(num.trim())),
                        })
                      }
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleBurnToken(token.token_id)}
                  >
                    Burn
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BurnTokenTool;
