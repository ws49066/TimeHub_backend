import { sequelize } from "../configs/database.js";
import { DataTypes, Model, Optional } from "sequelize";
import { Client } from "./ClientModel.js";

interface ILog {
    id: number,
    clientId: number,
    action: string,
    module: string,
    createdAt?: Date
    updatedAt?: Date
}

export interface ILogCreation extends Optional<ILog, "id" | "createdAt" | "updatedAt"> { }

export class Log extends Model<ILog, ILogCreation> implements ILog {
    declare id: number
    declare clientId: number;
    declare action: string;
    declare module: string;
    declare readonly createdAt: Date
    declare readonly updatedAt: Date
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
        timestamps: true,
        createdAt: true,
        updatedAt: false
    }
)