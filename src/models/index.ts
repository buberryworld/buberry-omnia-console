import { Sequelize } from "sequelize";
import NFT from "./nft";
import Metadata from "./metadata";

const syncDatabase = async () => {
    await sequelize.sync({ alter: true }); // Use { force: true } for resetting tables
    console.log("Database synced successfully.");
};

syncDatabase();

export { NFT, Metadata };


const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.SQLITE_DB_PATH || "./db/database.sqlite",
});

export default sequelize;
