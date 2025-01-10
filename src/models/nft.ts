import { DataTypes } from "sequelize";
import sequelize from "./index";

const NFT = sequelize.define("NFT", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tokenId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    memo: {
        type: DataTypes.STRING,
    },
    supplyType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    metadataUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    localJsonPath: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    localImagePath: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

export default NFT;
