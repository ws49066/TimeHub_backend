import { ClientPermission, IPermissionCreation } from './../models/PermissionModel';


export async function createPermission({clientId,access_system, create_appointment, view_logs }:IPermissionCreation) {
    await ClientPermission.create({
        clientId,
        access_system,
        create_appointment,
        view_logs
    })
}