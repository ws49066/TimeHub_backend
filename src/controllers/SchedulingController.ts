import { Client } from "@/models";
import { Room } from "@/models/RoomModel";
import { Scheduling } from "@/models/SchedulingModel";
import { createLog } from "@/utils/createLog";
import { getPermission } from "@/utils/createPermission";
import { generateSlots } from "@/utils/generateTimesSlots";
import { Request, Response } from "express";


const actions = {
    confirmed: "Scheduling confirmation",
    canceled: "Scheduling cancellation"
}

const validStatus = ['in_review', 'confirmed']

async function getAllScheduling(userId: string, role: string) {
    const isAdmin = role === "admin"
    const whereClause = isAdmin ? {} : { clientId: userId };

    const allScheduling = await Scheduling.findAll({
        where: whereClause,
        include: [
            {
                model: Room,
                as: "room",
                attributes: ["id", "room"]
            },
            {
                model: Client,
                as: "client",
                attributes: ["id", "nome", "sobrenome"]
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    return allScheduling
}

export class SchedulingController {
    static async createScheduling(req: Request, res: Response) {

        try {
            const clientId = Number(req.user?.userId)
            const { roomId, date, hour } = req.body

            const permissions = await getPermission(String(clientId))

            console.log("permissions", permissions)

            if (permissions && !permissions.create_appointment) {
                return res.status(403).json({
                    message: 'You do not have permission to perform this action'
                })
            }

            const room = await Room.findByPk(roomId)

            if (!room) {
                return res.status(404).json({
                    message: `Room not found`,
                    status: 404
                })
            }

            if (hour < room.start_time || hour >= room.end_time) {
                return res.status(400).json({
                    message: 'Time outside the allowed interval of the room'
                })
            }

            const minutes = Number(hour.split(':')[1])

            if (minutes % room.hour_block !== 0) {
                return res.status(400).json({
                    message: `Invalid time, room block is ${room.hour_block} minutes`
                })
            }

            const conflict = await Scheduling.findOne({
                where: {
                    roomId,
                    date,
                    hour,
                    status: validStatus
                }
            })

            if (conflict) {
                return res.status(409).json({
                    message: 'Time unavailable',
                    status: 409
                })
            }

            const scheduling = await Scheduling.create({
                clientId,
                roomId,
                date,
                hour
            })


            await createLog({
                clientId,
                action: 'Scheduling creation',
                module: 'Scheduling'
            })

            return res.status(201).json({
                message: 'Scheduling successfully completed',
                status: 201,
                data: scheduling
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Error creating scheduling'
            })
        }
    }


    static async listScheduling(req: Request, res: Response) {  
        try {
            const userId = req.user?.userId
            const role = req.user?.role
            const allScheduling = await getAllScheduling(String(userId!), role!)

            return res.status(200).json({
                message: "All schedulings",
                status: 200,
                data: {
                    allScheduling,
                    total: allScheduling.length
                }

            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Error collecting all schedulings',
            })
        }
    }

    static async updateScheduling(req: Request, res: Response) {
        try {
            const { id, status } = req.body
            const userId = req.user?.userId
            const role = req.user?.role
            const isAdmin = role === "admin"

            const schedulingFound = await Scheduling.findOne({
                where: {
                    id,
                    status: validStatus,
                }
            })


            if (!schedulingFound) {
                return res.status(404).json({
                    message: `Scheduling not found or canceled`,
                })
            }

            if (!isAdmin && (status === "confirmed" || schedulingFound.clientId !== Number(userId))) {
                return res.status(404).json({
                    message: `You do not have permission to update the status of this scheduling`,
                })
            }


            await schedulingFound.update({
                status
            })

            const action = status === "confirmed" ? actions.confirmed : actions.canceled

            await createLog({
                clientId: Number(schedulingFound.clientId),
                action,
                module: 'Scheduling',
            })

            return res.status(200).json({
                message: `Scheduling status updated successfully`,
                status: 200,
                data: {
                    schedulingFound
                }
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Error updating scheduling status',
                error: error,
                status: 500
            })
        }
    }


    static async availability(req: Request, res: Response) {
        const { roomId, date } = req.body

        if (!roomId || !date) {
            return res.status(400).json({
                message: 'Room and date are required'
            })
        }

        try {
            const room = await Room.findByPk(Number(roomId))

            if (!room) {
                return res.status(404).json({
                    message: 'Room not found'
                })
            }

            // 🔹 gerar horários possíveis
            const slots = generateSlots(
                room.start_time,
                room.end_time,
                room.hour_block
            )

            // 🔹 buscar horários já ocupados
            const schedulings = await Scheduling.findAll({
                where: {
                    roomId,
                    date,
                    status: validStatus
                }
            })

            const alreadySchudulingTimes = schedulings.map(a => a.hour)

            const availableSlots = slots.filter(
                slot => !alreadySchudulingTimes.includes(slot)
            )

            return res.status(200).json({
                message: "Available times for the room",
                status: 200,
                data: {
                    roomId,
                    room: room.room,
                    date,
                    availableSlots
                }
            })

        } catch (error) {
            return res.status(500).json({
                message: 'Error listing available times for the room',
                error,
                status: 500
            })
        }



    }

}