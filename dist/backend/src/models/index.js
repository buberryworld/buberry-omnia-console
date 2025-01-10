"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = exports.NFT = void 0;
const sequelize_1 = require("sequelize");
const nft_1 = __importDefault(require("./nft"));
exports.NFT = nft_1.default;
const metadata_1 = __importDefault(require("./metadata"));
exports.Metadata = metadata_1.default;
const syncDatabase = async () => {
    await sequelize.sync({ alter: true }); // Use { force: true } for resetting tables
    console.log("Database synced successfully.");
};
syncDatabase();
const sequelize = new sequelize_1.Sequelize({
    dialect: "sqlite",
    storage: process.env.SQLITE_DB_PATH || "./db/database.sqlite",
});
exports.default = sequelize;
