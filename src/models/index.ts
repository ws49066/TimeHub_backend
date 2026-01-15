import { Client } from "./ClientModel";
import { Log } from "./LogModel";
import { ClientPermission } from "./PermissionModel";

Client.hasMany(Log, { foreignKey: 'clientId', as: "logs"})
Log.belongsTo(Client, { foreignKey: 'clientId', as: "client"})


Client.hasOne(ClientPermission, {foreignKey: 'clientId',as: 'permissions'})
ClientPermission.belongsTo(Client, {foreignKey: 'clientId', as: 'client'})

export {
    Client,
    ClientPermission,
    Log
}