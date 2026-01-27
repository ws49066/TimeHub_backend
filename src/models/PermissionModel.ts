import { sequelize } from "../configs/database.js";
import { DataTypes, Model, Optional } from "sequelize";
import { Client } from "./ClientModel.js";


export interface IPermission {
    id: number,
    create_appointment: boolean,
    view_logs: boolean,
    access_system: boolean,
    clientId: number
}

export interface IPermissionCreation extends Optional<IPermission, "id" | "create_appointment" | "view_logs" | "access_system" | "clientId"> { }

export class ClientPermission extends Model<IPermission, IPermissionCreation> implements IPermission {
    declare id: number
    declare clientId: number;
    declare create_appointment: boolean
    declare view_logs: boolean
    declare access_system: boolean

    declare readonly createdAt: Date
    declare readonly updatedAt: Date
}


ClientPermission.init(
    {
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
        create_appointment: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        view_logs: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        access_system: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    },
    {
        sequelize,
        tableName: 'clients_permission',
        timestamps: true,
    }
)