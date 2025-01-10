"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
const Metadata = index_1.default.define("Metadata", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nftId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    data: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
});
exports.default = Metadata;
