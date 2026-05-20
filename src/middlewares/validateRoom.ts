import { Response, Request, NextFunction } from "express";


const hourBlockRegex = /^(30|60)$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const validadeRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { rooms } = req.body

    if (!Array.isArray(rooms) || rooms.length === 0) {
        return res.status(400).json({
            message: 'Rooms must be a non-empty array',
        })
    }

    const roomNames = rooms.map(s => s.room.trim().toLowerCase())

    const uniqueRooms = new Set(roomNames)

    if (roomNames.length !== uniqueRooms.size) {
        return res.status(400).json({
            message: 'There are duplicate rooms with the same name',
        })
    }


    for (const [index, itemRoom] of rooms.entries()) {
        const { room, start_time, end_time, hour_block } = itemRoom

        if (!room || !start_time || !end_time || !hour_block) {
            return res.status(400).json({
                message: `All fields are required (error in item ${index + 1})`,
            })
        }

        if (!hourBlockRegex.test(hour_block.toString())) {
            return res.status(400).json({
                message: `Invalid hour block in room ${room}. Must be 30 or 60`,
            });
        }

        if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
            return res.status(400).json({
                message: `Invalid time format in room ${room}. Must be in HH:MM format`,
            });
        }

        if (start_time >= end_time) {
            return res.status(400).json({
                message: `Start time must be earlier than end time in room ${room}`,
            })
        }
    }


    next()

}

export {
    validadeRoom
}