import { Client } from "@/models";
import { Room } from "@/models/RoomModel";
import { Scheduling } from "@/models/SchedulingModel";
import { createLog } from "@/utils/createLog";
import { getPermission } from "@/utils/createPermission";
import { generateSlots } from "@/utils/generateTimesSlots";
import { Request, Response } from "express";


const actions = {
    confirmed: "Confirmação de agendamento",
    canceled: "Cancelamento de agendamento"
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
                attributes: ["id", "nome"]
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
                    message: 'Você não tem permissao para executar essa ação'
                })
            }

            const room = await Room.findByPk(roomId)

            if (!room) {
                return res.status(404).json({
                    message: `Sala não encontrada`,
                    status: 404
                })
            }

            if (hour < room.start_time || hour >= room.end_time) {
                return res.status(400).json({
                    message: 'Horário fora do intervalo permitido da sala'
                })
            }

            const minutes = Number(hour.split(':')[1])

            if (minutes % room.hour_block !== 0) {
                return res.status(400).json({
                    message: `Horário inválido, o bloco da sala é de ${room.hour_block} minutos`
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
                    message: 'Horário indisponivel',
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
                action: 'Criação de agendamento',
                module: 'Agendamento'
            })

            return res.status(201).json({
                message: 'Agendamento realizado com sucesso',
                status: 201,
                data: scheduling
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro ao criar agendamento'
            })
        }
    }


    static async listScheduling(req: Request, res: Response) {  
        try {
            const userId = req.user?.userId
            const role = req.user?.role
            const allScheduling = await getAllScheduling(String(userId!), role!)

            return res.status(200).json({
                message: "Todos os agendamentos",
                status: 200,
                data: {
                    allScheduling,
                    total: allScheduling.length
                }

            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao coletar todos os agendamentos',
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
                    message: `Agendamento não encontrada , ou Cancelado`,
                })
            }

            if (!isAdmin && (status === "confirmed" || schedulingFound.clientId !== Number(userId))) {
                return res.status(404).json({
                    message: `Você não tem permissão para atualizar o status desse agendamento`,
                })
            }


            await schedulingFound.update({
                status
            })

            const action = status === "confirmed" ? actions.confirmed : actions.canceled

            await createLog({
                clientId: Number(schedulingFound.clientId),
                action,
                module: 'Agendamento',
            })

            return res.status(200).json({
                message: `Status do agendamento atualizado com sucesso`,
                status: 200,
                data: {
                    schedulingFound
                }
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Erro ao atualizar status do agendamento',
                error: error,
                status: 500
            })
        }
    }


    static async availability(req: Request, res: Response) {
        const { roomId, date } = req.body

        if (!roomId || !date) {
            return res.status(400).json({
                message: 'Sala e data são obrigatórios'
            })
        }

        try {
            const room = await Room.findByPk(Number(roomId))

            if (!room) {
                return res.status(404).json({
                    message: 'Sala não encontrada'
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
                message: "Horarios disponiveis para a sala",
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
                message: 'Erro ao listar horarios disponiveis para a sala',
                error,
                status: 500
            })
        }



    }

}