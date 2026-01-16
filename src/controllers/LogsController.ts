import { Log } from '@/models'
import { Request, Response } from 'express'


export class LogController {
    static async allLogs(req: Request, res: Response) {
        const userId = req.user?.userId
        const role = req.user?.role

        try {

            let logs: Log[] = []
            
            if (role !== 'client') {
                logs = await Log.findAll({
                    order: [['createdAt', 'DESC']]
                })
            }else{
                logs = await Log.findAll({
                    where:{clientId:userId},
                   order: [['createdAt', 'DESC']]
                })
            }

            
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