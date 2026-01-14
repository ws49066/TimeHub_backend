import { Room } from '@/models/RoomModel'
import { Request, Response } from 'express'

export class RoomController {
    static async createRoom(req: Request, res: Response) {
        try {
            const { room, start_time, end_time, hour_block } = req.body

            const roomExists = await Room.findOne({ where: { room } })

            if (roomExists) {
                return res.status(409).json({
                    message: `Sala (${room}) já cadastrada`,
                })
            }

            await Room.create({
                room,
                start_time,
                end_time,
                hour_block
            })


            return res.status(201).json({
                message: `Sala (${room}) Cadastrada com Sucesso`,
                status: 201,
            })

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro interno ao cadastrar sala',
                status: 500
            })
        }
    }

    static async editRoom(req: Request, res: Response) {
        try {

            const { room, start_time, end_time, hour_block } = req.body


            const roomFind = await Room.findOne({ where: { room } })

            if (!roomFind) {
                return res.status(404).json({
                    message: `Sala (${room}) não encontrada`,
                })
            }

            await roomFind.update({
                room,
                start_time,
                end_time,
                hour_block
            })

            return res.json({
                message: `Dados da sala ${room} atualizada com sucesso`,
            })

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro interno ao cadastrar sala',
                status: 500
            })
        }
    }
}