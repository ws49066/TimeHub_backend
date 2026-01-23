import { Response, Request, NextFunction } from "express";


const hourBlockRegex = /^(30|60)$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const validadeRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { rooms } = req.body

    if (!Array.isArray(rooms) || rooms.length === 0) {
        return res.status(400).json({
            message: 'Salas deve ser um array não vazio',
        })
    }

    const roomNames = rooms.map(s => s.room.trim().toLowerCase())

    const uniqueRooms = new Set(roomNames)

    if (roomNames.length !== uniqueRooms.size) {
        return res.status(400).json({
            message: 'Existem salas duplicadas com o mesmo nome',
        })
    }


    for (const [index, itemRoom] of rooms.entries()) {
        const { room, start_time, end_time, hour_block } = itemRoom

        if (!room || !start_time || !end_time || !hour_block) {
            return res.status(400).json({
                message: `Todos os campos são obrigatórios (erro no item ${index + 1})`,
            })
        }

        if (!hourBlockRegex.test(hour_block.toString())) {
            return res.status(400).json({
                message: `Bloco de horas inválido na sala ${room} deve ser 30 ou 60`,
            });
        }

        if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
            return res.status(400).json({
                message: `Formato de horário inválido na sala ${room} devem estar no formato HH:MM`,
            });
        }

        if (start_time >= end_time) {
            return res.status(400).json({
                message: `Hora inicial deve ser menor que a hora final na sala ${room}`,
            })
        }
    }


    next()

}

export {
    validadeRoom
}