import { Client } from "./ClientModel";
import { Log } from "./LogModel";
import { ClientPermission } from "./PermissionModel";
import { Room } from "./RoomModel";
import { Scheduling } from "./SchedulingModel";

// Logs
Client.hasMany(Log, { foreignKey: 'clientId', as: "logs" });
Log.belongsTo(Client, { foreignKey: 'clientId', as: "client" });

// Permissões
Client.hasOne(ClientPermission, { foreignKey: 'clientId', as: 'permissions' });
ClientPermission.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Agendamentos
Client.hasMany(Scheduling, { foreignKey: 'clientId', as: "schedulings" });
Scheduling.belongsTo(Client, { foreignKey: 'clientId', as: "client" });

// Salas e Agendamentos
Room.hasMany(Scheduling, { foreignKey: 'roomId', as: "schedulings" });
Scheduling.belongsTo(Room, { foreignKey: 'roomId', as: "room" });

export {
    Client,
    ClientPermission,
    Log,
    Room,
    Scheduling
}