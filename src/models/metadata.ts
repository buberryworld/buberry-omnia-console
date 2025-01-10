import { DataTypes } from "sequelize";
import sequelize from "./index";

const Metadata = sequelize.define("Metadata", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nftId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false,
    },
});

export default Metadata;
