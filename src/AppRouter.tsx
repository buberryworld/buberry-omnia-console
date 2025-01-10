import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NFTDisplayPage from "./pages/NFTDisplayPage";
import BalancePage from "./pages/BalancePage";
import AboutPage from "./pages/AboutPage";
import MetadataCreator from './pages/MetadataCreator';
import NFTCreationTool from "./pages/NFTCreationTool";
import MintingTool from "./pages/MintingTool";



const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/nfts" element={<NFTDisplayPage />} />
      <Route path="/balance" element={<BalancePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/metadata-creator" element={<MetadataCreator />} />
      <Route path="/nft-creator" element={<NFTCreationTool />} />
      <Route path="/minting-tool" element={<MintingTool />} />

    </Routes>
  );
};

export default AppRouter;
