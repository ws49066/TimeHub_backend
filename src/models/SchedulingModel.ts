import { DataTypes, Model, Optional } from "sequelize";
import { Client } from "./ClientModel";
import { Room } from "./RoomModel";
import { sequelize } from "@/configs/database";


interface IScheduling {
    id: number
    clientId: number
    roomId: number
    date: string
    hour: string
    status: 'in_review' | 'confirmed' | 'canceled'
}

interface ISchedulingCreation extends Optional<IScheduling, 'id' | 'status'> { }


export class Scheduling extends Model<IScheduling, ISchedulingCreation> implements IScheduling {
    declare id: number
    declare clientId: number
    declare roomId: number
    declare date: string
    declare hour: string
    declare status: 'in_review' | 'confirmed' | 'canceled'

    declare readonly createdAt: Date
    declare readonly updatedAt: Date
}

Scheduling.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Client, key: 'id' }
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Room, key: 'id' }
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        hour: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('in_review', 'confirmado', 'cancelado'),
            defaultValue: 'in_review'
        }
    },
    {
        sequelize,
        tableName: 'scheduling',
        timestamps: true
    }
)