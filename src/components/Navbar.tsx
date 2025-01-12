import React, { useState, useEffect } from "react";
import { AppBar, Button, Toolbar, Typography, Box, Menu, MenuItem } from "@mui/material";
import { NavLink, Link } from "react-router-dom";
import HBARLogo from "../assets/omnia_ascii_logo.png";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { WalletSelectionDialog } from "./WalletSelectionDialog";

const treasuryAccountId = "0.0.5303815"; // Replace with your treasury account ID

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
    } else {
      setOpen(true);
    }
  };

  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId]);

  return (
    <AppBar position="relative" sx={{ backgroundColor: "#000000", padding: "4px" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src={HBARLogo} alt="Logo" className="hbarLogoImg" style={{ height: "50px" }} />
        </Box>

        {/* Centered Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px 16px",
            borderRadius: "8px",
            margin: "auto",
            maxWidth: "80%",
          }}
        >
          <NavLink to="/" style={navLinkStyles}>
            Home
          </NavLink>
          <NavLink to="/about" style={navLinkStyles}>
            About
          </NavLink>
          <NavLink to="/balance" style={navLinkStyles}>
            Token Management
          </NavLink>
          <NavLink to="/nfts" style={navLinkStyles}>
            Card Vault
          </NavLink>
          <NavLink to="/staking" style={navLinkStyles}>
            Staking Panel
          </NavLink>
          
        </Box>

        {/* Wallet Connect Button */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#00FF00",
              color: "#000",
              "&:hover": { backgroundColor: "#00CC00" },
            }}
            onClick={handleConnect}
          >
            {accountId ? `Connected: ${accountId}` : "Connect Wallet"}
          </Button>

          {/* Dropdown Menu for Treasury Account */}
          {accountId === treasuryAccountId && (
            <>
              <Button
                variant="outlined"
                sx={{
                  marginLeft: "16px",
                  backgroundColor: "#FFFFFF",
                  color: "#000",
                }}
                onClick={handleDropdownOpen}
              >
                Treasury Menu
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleDropdownClose}
              >
                <MenuItem component={Link} to="/metadata-creator">
                  Metadata Creator
                </MenuItem>
                <MenuItem component={Link} to="/nft-creator">
                  NFT Creator
                </MenuItem>
                <MenuItem component={Link} to="/minting-tool">
                  Minting Tool
                </MenuItem>
                <MenuItem component={Link} to="/burning-tool">
                  Token Burning Tool
                </MenuItem>
                
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>

      <WalletSelectionDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} />
    </AppBar>
  );
}

// Custom styles for navigation links
const navLinkStyles = {
  margin: "0 18px",
  textDecoration: "none",
  color: "#00FF00",
  fontFamily: "Courier New, monospace",
  "&.active": {
    textDecoration: "underline",
    color: "#00CC00",
  },
};
