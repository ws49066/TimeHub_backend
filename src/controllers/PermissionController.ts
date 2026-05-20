import { Client } from '@/models';
import { ClientPermission, IPermission } from '@/models/PermissionModel'
import { Request, Response } from 'express'

async function getAllClient() {

    const allScheduling = await ClientPermission.findAll({

        include: [

            {
                model: Client,
                as: "client",
                attributes: [
                    "id",
                    "nome",
                    "sobrenome",
                    "endereco",
                    "numero",
                    "complemento",
                    "bairro",
                    "cidade",
                    "estado",
                    "createdAt",
                ]
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    return allScheduling
}


export class PermissionController {

    static async getUserPermission(req: Request, res: Response) {
        try {
            const AllClients = await getAllClient()

            return res.status(200).json({
                message: "Success",
                status: 200,
                data: AllClients,
                total: AllClients.length
            })

        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Error collecting all schedulings',
            })
        }
    }


    static async editUserPermission(req: Request, res: Response) {
        try {

            const { clientId }: IPermission = req.body
            const payload = req.body

            const permissionFind = await ClientPermission.findOne({ where: { clientId } })

            if (!permissionFind) {
                return res.status(404).json({
                    message: 'Permissions not found. Client not registered',
                    status: 404
                })
            }

            const permissions = await permissionFind.update(payload)

            return res.json({
                message: `Client permissions updated successfully`,
                data: permissions
            })

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Internal error updating client permissions',
                status: 500
            })
        }
    }
}