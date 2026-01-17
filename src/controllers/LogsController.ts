import { Log } from '@/models'
import { getPermission } from '@/utils/createPermission'
import { Request, Response } from 'express'


export class LogController {
    static async allLogs(req: Request, res: Response) {

        try {
            const userId = req.user?.userId
            const isAdmin = req.user?.role === "admin"

            const permissions = await getPermission(String(userId))

            if (permissions && !permissions?.view_logs) {
                return res.status(403).json({
                    message: 'Você não tem permissao para executar essa ação'
                })
            }


            const whereClause = isAdmin ? {} : { clientId: userId };

            const logs = await Log.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']]
            })


            return res.status(200).json({
                message: "Success",
                status: 200,
                data: {
                    logs,
                    total: logs.length
                }

            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao listar logs',
            })
        }
    }

}