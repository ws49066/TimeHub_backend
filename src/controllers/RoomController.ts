import { sequelize } from '@/configs/database'
import { Room } from '@/models/RoomModel'
import { Request, Response } from 'express'


export class RoomController {
    static async allRooms(req: Request, res: Response) {
        try {
            const rooms = await Room.findAll({
                order: [['room', 'ASC']]
            })

            return res.status(200).json({
                message: "Rooms retrieved successfully",
                status: 200,
                data: {
                    rooms,
                    total: rooms.length
                }

            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Error listing rooms',
            })
        }
    }

    static async createRoom(req: Request, res: Response) {
        const { rooms } = req.body
        const transaction = await Room.sequelize!.transaction()

        try {

            const payload = rooms.map((room: any) => ({
                room: room.room.trim(),
                start_time: room.start_time,
                end_time: room.end_time,
                hour_block: room.hour_block,
            }))



            await Room.bulkCreate(payload, { transaction })
            await transaction.commit()


            return res.status(201).json({
                message: `Room(s) created successfully`,
                total: payload.length,
                status: 201,
            })

        } catch (error: any) {
            await transaction.rollback()

            if (error.name === 'SequelizeUniqueConstraintError') {
                const duplicatedValue = error.errors?.[0]?.value
                const duplicatedField = error.errors?.[0]?.path

                return res.status(409).json({
                    message: `Já existe uma sala cadastrada com o ${duplicatedField}: ${duplicatedValue}`,
                })
            }

            console.error(error)
            return res.status(500).json({
                message: 'Internal error when registering room',
                status: 500
            })
        }
    }

    static async editRoom(req: Request, res: Response) {
        const { rooms } = req.body
        const transaction = await Room.sequelize!.transaction()

        try {

            for (const item of rooms) {
                const roomFound = await Room.findOne({ where: { id:item.id }, transaction })

                if (!roomFound) {
                    await transaction.rollback()
                    return res.status(404).json({
                        message: `Room ID ${item.id} not found`,
                    })
                }

                await roomFound.update(
                    {
                        room: item.room.trim(),
                        start_time: item.start_time,
                        end_time: item.end_time,
                        hour_block: item.hour_block,
                    },
                    { transaction }
                )
            }

            await transaction.commit()


            return res.status(200).json({
                message: `Room(s) updated successfully`,
                status: 200
            })

        } catch (error: any) {
            console.error(error)

            await transaction.rollback()
            if (error.name === 'SequelizeUniqueConstraintError') {
                const duplicatedValue = error.errors?.[0]?.value
                const duplicatedField = error.errors?.[0]?.path

                return res.status(409).json({
                    message: `Já existe uma sala cadastrada com o ${duplicatedField}: ${duplicatedValue}`,
                })
            }

            return res.status(500).json({
                message: 'Error updating room(s)',
            })

        }
    }
}