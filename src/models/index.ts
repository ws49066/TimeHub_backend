import { Client } from "./ClientModel";
import { Log } from "./LogModel";


Client.hasMany(Log, { foreignKey: 'clientId', as: "logs"})
Log.belongsTo(Client, { foreignKey: 'clientId', as: "client"})

