import { sequelize } from "../configs/database.js";
import { DataTypes, Model, Optional } from "sequelize";


interface IAdmin {
    id: number,
    nome: string,
    sobrenome: string,
    email: string,
    password: string,
    role: "admin",
}

interface IAdminCreation extends Optional<
    IAdmin,
    "id" | "role"
> { }

export class Admin extends Model<IAdmin, IAdminCreation> implements IAdmin {
    declare id: number
    declare nome: string
    declare sobrenome: string
    declare email: string
    declare password: string
    declare role: "admin"

    declare readonly createdAt: Date
    declare readonly updatedAt: Date
}


Admin.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        sobrenome: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        role: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "admin"
        },
    },
    {
        sequelize,
        tableName: 'users_admin',
        timestamps: true,
    }
)