"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
const NFT = index_1.default.define("NFT", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tokenId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    symbol: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    memo: {
        type: sequelize_1.DataTypes.STRING,
    },
    supplyType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    metadataUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    localJsonPath: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    localImagePath: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.default = NFT;
