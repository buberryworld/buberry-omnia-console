import React, { useEffect, useState } from "react";
import {
  Client,
  AccountBalanceQuery,
  AccountId,
  TokenId,
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
  Collapse,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SendIcon from "@mui/icons-material/Send";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { appConfig } from "../config";
import { styled } from "@mui/material/styles";

const BalancePage: React.FC = () => {
  const { walletInterface, accountId } = useWalletInterface();
  const [hbarBalance, setHbarBalance] = useState<number | null>(null);
  const [availableTokens, setAvailableTokens] = useState<any[]>([]);
  const [hiddenTokens, setHiddenTokens] = useState<string[]>([]);
  const [showHidden, setShowHidden] = useState(false);

  // Transfer state
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [recipientId, setRecipientId] = useState<string>("");

  // Token Association state
  const [tokenIdToAssociate, setTokenIdToAssociate] = useState<string>("");

  // Metadata modal state
  const [selectedTokenMetadata, setSelectedTokenMetadata] = useState<any | null>(null);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);

  // Info Modal state
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    if (!accountId) return;

    const fetchHbarBalance = async () => {
      try {
        const client = Client.forTestnet();
        const balance = await new AccountBalanceQuery()
          .setAccountId(AccountId.fromString(accountId))
          .execute(client);
        setHbarBalance(balance.hbars.toTinybars() / 1e8);
      } catch (error) {
        console.error("Error fetching HBAR balance:", error);
      }
    };

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

    fetchHbarBalance();
    fetchTokenBalances();
  }, [accountId]);

  const handleTokenAssociate = async () => {
    if (!walletInterface || !tokenIdToAssociate) {
      console.error("Wallet interface is not initialized or token ID is empty.");
      return;
    }

    try {
      await walletInterface.associateToken(TokenId.fromString(tokenIdToAssociate));
      alert(`Successfully associated token: ${tokenIdToAssociate}`);
      setTokenIdToAssociate("");
    } catch (error) {
      console.error("Error associating token:", error);
      alert("Error associating token. Please check the token ID and try again.");
    }
  };

  const handleTokenTransfer = async () => {
    if (!walletInterface) {
      console.error("Wallet interface is not initialized.");
      return;
    }

    if (!selectedTokenId || !recipientId || transferAmount <= 0) {
      console.error("Invalid transfer parameters.");
      return;
    }

    const selectedToken = availableTokens.find((token: any) => token.token_id === selectedTokenId);
    if (!selectedToken) {
      console.error("Token not found.");
      return;
    }

    try {
      const isNonFungible = selectedToken.info.type === "NON_FUNGIBLE_UNIQUE";

      if (isNonFungible) {
        await walletInterface.transferNonFungibleToken(
          AccountId.fromString(recipientId),
          TokenId.fromString(selectedTokenId),
          transferAmount // Use transferAmount to represent serial number for NFTs
        );
      } else {
        const decimals = Number(selectedToken.info.decimals);
        const amountWithDecimals = transferAmount * Math.pow(10, decimals);
        await walletInterface.transferFungibleToken(
          AccountId.fromString(recipientId),
          TokenId.fromString(selectedTokenId),
          amountWithDecimals
        );
      }

      alert(`Successfully transferred ${transferAmount} of token ${selectedTokenId} to ${recipientId}.`);
      refreshBalances();

      setSelectedTokenId(null);
      setTransferAmount(0);
      setRecipientId("");
    } catch (error) {
      console.error("Error transferring tokens:", error);
      alert("Error transferring tokens. Please check your input and try again.");
    }
  };

  const handleTokenClick = (tokenId: string) => {
    const selectedToken = availableTokens.find((token: any) => token.token_id === tokenId);
    if (selectedToken) {
      setSelectedTokenMetadata(selectedToken.info);
      setIsMetadataModalOpen(true);
    }
  };

  const refreshBalances = async () => {
    if (!accountId) return;

    try {
      const client = Client.forTestnet();
      const balance = await new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(accountId))
        .execute(client);
      setHbarBalance(balance.hbars.toTinybars() / 1e8);

      const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
      const tokens = await mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(
        AccountId.fromString(accountId)
      );
      setAvailableTokens(tokens);
    } catch (error) {
      console.error("Error refreshing balances:", error);
    }
  };

  const toggleTokenVisibility = (tokenId: string) => {
    setHiddenTokens((prev) =>
      prev.includes(tokenId) ? prev.filter((id) => id !== tokenId) : [...prev, tokenId]
    );
  };

  const toggleShowHidden = () => {
    setShowHidden((prev) => !prev);
  };

  const visibleTokens = availableTokens.filter(
    (token) => !hiddenTokens.includes(token.token_id)
  );

  const hiddenTokenList = availableTokens.filter(
    (token) => hiddenTokens.includes(token.token_id)
  );

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Token Management
      </Typography>

      <Typography variant="h6" mb={2}>
        HBAR Balance: {hbarBalance !== null ? `${hbarBalance} ℏ` : "Loading..."}
      </Typography>

      <Box textAlign="center" display="flex" justifyContent="center" alignItems="center" mb={2}>
        <Button variant="contained" onClick={refreshBalances}>
          Refresh Balances
        </Button>
      </Box>

      {/* Visible Tokens Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token Name</TableCell>
              <TableCell>Token ID</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleTokens.map((token: any) => (
              <TableRow key={token.token_id}>
                <TableCell>{token.info.name}</TableCell>
                <TableCell>{token.token_id}</TableCell>
                <TableCell>
                  {token.balance / Math.pow(10, Number(token.info.decimals))}
                </TableCell>
                <TableCell>
                  <Button variant="text" onClick={() => handleTokenClick(token.token_id)}>
                    View Metadata
                  </Button>
                  <Button variant="text" onClick={() => toggleTokenVisibility(token.token_id)}>
                    Hide
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Hidden Tokens Section */}
      <Box mt={4}>
        <Button
          variant="contained"
          onClick={toggleShowHidden}
          startIcon={showHidden ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {showHidden ? "Hide Hidden Tokens" : "Show Hidden Tokens"}
        </Button>
        <Collapse in={showHidden}>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Token Name</TableCell>
                  <TableCell>Token ID</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hiddenTokenList.map((token: any) => (
                  <TableRow key={token.token_id}>
                    <TableCell>{token.info.name}</TableCell>
                    <TableCell>{token.token_id}</TableCell>
                    <TableCell>
                      <Button variant="text" onClick={() => toggleTokenVisibility(token.token_id)}>
                        Unhide
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>

      {/* Associate Token Section */}
      <Box mt={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Typography variant="h6" mb={2}>
          Associate Token
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="Token ID"
            value={tokenIdToAssociate}
            onChange={(e) => setTokenIdToAssociate(e.target.value)}
            sx={{ width: "300px" }}
          />
          <Button variant="contained" onClick={handleTokenAssociate}>
            Associate
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsInfoModalOpen(true)}
            sx={{
              minWidth: "40px",
              padding: "5px",
            }}
          >
            ?
          </Button>
        </Box>
      </Box>

      {/* Transfer Tokens Section */}
      <Box mt={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Typography variant="h6" mb={2}>
          Transfer Tokens
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="Select Token"
            select
            value={selectedTokenId || ""}
            onChange={(e) => setSelectedTokenId(e.target.value)}
            sx={{ width: "200px" }}
          >
            {availableTokens.map((token: any) => (
              <MenuItem key={token.token_id} value={token.token_id}>
                {token.info.name} ({token.token_id})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Amount"
            type="number"
            value={transferAmount || ""}
            onChange={(e) => setTransferAmount(Number(e.target.value))}
            sx={{ width: "150px" }}
          />
          <TextField
            label="Recipient Account ID"
            value={recipientId || ""}
            onChange={(e) => setRecipientId(e.target.value)}
            sx={{ width: "250px" }}
          />
          <Button variant="contained" startIcon={<SendIcon />} onClick={handleTokenTransfer}>
            Transfer
          </Button>
        </Box>
      </Box>

      {/* Metadata Modal */}
      <Dialog
        open={isMetadataModalOpen}
        onClose={() => setIsMetadataModalOpen(false)}
      >
        <DialogTitle>Token Metadata</DialogTitle>
        <DialogContent>
          {selectedTokenMetadata ? (
            <Box>
              <Typography><strong>Name:</strong> {selectedTokenMetadata.name}</Typography>
              <Typography><strong>Symbol:</strong> {selectedTokenMetadata.symbol}</Typography>
              <Typography><strong>Decimals:</strong> {selectedTokenMetadata.decimals}</Typography>
              <Typography><strong>Type:</strong> {selectedTokenMetadata.type}</Typography>
              <Typography><strong>Metadata:</strong> {selectedTokenMetadata.metadata}</Typography>
            </Box>
          ) : (
            <Typography>Loading metadata...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMetadataModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BalancePage;
