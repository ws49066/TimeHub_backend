import { sequelize } from "../configs/database.js";
import { DataTypes, Model, Optional } from "sequelize";
import { Client } from "./ClientModel.js";

interface ILog {
    id: number,
    clientId: number,
    action: string,
    module: string
}

export interface ILogCreation extends Optional<ILog, "id"> { }

export class Log extends Model<ILog, ILogCreation> implements ILog {
    declare id: number
    declare clientId: number;
    declare action: string;
    declare module: string;
}

Log.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    clientId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Client,
            key: "id"
        }
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    module: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
    {
        sequelize,
        tableName: 'logs',
        timestamps: false,
    }
)