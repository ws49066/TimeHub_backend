import { ClientPermission, IPermission } from '@/models/PermissionModel'
import { Request, Response } from 'express'

export class PermissionController {


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

            await permissionFind.update(payload)

            return res.json({
                message: `Permissões do cliente atualizadas com sucesso`,
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