import { sequelize } from "../configs/database.js";
import { DataTypes, Model, Optional } from "sequelize";
import { ClientPermission } from "./PermissionModel.js";


interface IClient {
    id: number,
    nome: string,
    sobrenome: string,
    email: string,
    password: string,
    cep: string,
    endereco?: string,
    numero?: number,
    complemento?: string,
    bairro?: string,
    cidade?: string,
    estado?: string,
    role: "client"
}

interface IClientCreation extends Optional<
    IClient,
    "id" | "endereco" | "numero" | "complemento" | "bairro" | "cidade" | "estado" | "role"
> { }

export class Client extends Model<IClient, IClientCreation> implements IClient {
    declare id: number
    declare nome: string
    declare sobrenome: string
    declare email: string
    declare password: string
    declare cep: string
    declare endereco?: string
    declare numero?: number
    declare complemento?: string
    declare bairro?: string
    declare cidade?: string
    declare estado?: string
    declare role: "client"

    declare permissions?: ClientPermission

    declare readonly createdAt: Date
    declare readonly updatedAt: Date
}


Client.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
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

        cep: {
            type: DataTypes.STRING(8),
            allowNull: false,
        },

        endereco: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        numero: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        complemento: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        bairro: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        cidade: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        estado: {
            type: DataTypes.STRING(2),
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "client"
        },
    },
    {
        sequelize,
        tableName: 'clients',
        timestamps: true,
    }
)