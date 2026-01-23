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
                message: 'Erro ao coletar todos os agendamentos',
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
                    message: 'Permissões não encontradas, Cliente não Cadastrado',
                    status: 404
                })
            }

            const permissions = await permissionFind.update(payload)

            return res.json({
                message: `Permissões do cliente atualizadas com sucesso`,
                data: permissions
            })

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro interno ao atualizar permissões do client',
                status: 500
            })
        }
    }
}