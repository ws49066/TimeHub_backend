import { ClientPermission, IPermissionCreation } from './../models/PermissionModel';


export async function createPermission({ clientId, access_system, create_appointment, view_logs }: IPermissionCreation) {
    await ClientPermission.create({
        clientId,
        access_system,
        create_appointment,
        view_logs
    })
}


export async function getPermission(clientId:string): Promise<IPermissionCreation | null> {
    
    const permission = await ClientPermission.findOne({
        where: {clientId}
    })

    return permission
}