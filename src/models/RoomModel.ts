import { sequelize } from "../configs/database.js";
import { DataTypes, Model, Optional } from "sequelize";


interface IRoom {
    id: number,
    room: string,
    start_time: string,
    end_time: string,
    hour_block: number
}

interface IRoomCreation extends Optional<IRoom,"id"> { }

export class Room extends Model<IRoom, IRoomCreation> implements IRoom {
    declare id: number
    declare room: string
    declare start_time: string
    declare end_time: string
    declare hour_block: number

    declare readonly createdAt: Date
    declare readonly updatedAt: Date
}


Room.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        room: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        start_time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        end_time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hour_block: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[30, 60]]
            }
        }
    },
    {
        sequelize,
        tableName: 'rooms',
        timestamps: true,
    }
)