import { Response, Request, NextFunction } from "express";


const hourRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const validadeFields = async (req: Request, res: Response, next: NextFunction) => {

    const { roomId, date, hour } = req.body

    if (!roomId || !date || !hour) {
        return res.status(400).json({
            message: 'Required fields not provided'
        })
    }


    if (!hourRegex.test(hour)) {
        return res.status(400).json({
            message: 'Invalid time format (HH:mm)'
        })
    }


    if (!dateRegex.test(date)) {
        return res.status(400).json({
            message: 'Invalid date format. Use YYYY-MM-DD format'
        });
    }

    const selectedDateTime = new Date(date + "T" + hour);

    const today = new Date()

    if (selectedDateTime < today) {
        return res.status(400).json({
            message: 'Cannot schedule for past dates and times'
        })
    }

    next()
}

const validadeFieldStatus = async (req: Request, res: Response, next: NextFunction) => {

    const { status, id } = req.body

    if (!status || !id) {
        return res.status(400).json({
            message: 'Required fields not provided'
        })
    }

    const validStatus = ["confirmed", "canceled"]

    if (!validStatus.includes(status)) {
        return res.status(400).json({
            error: `Invalid status. Must be: ${validStatus.join(" or ")}.`
        });
    }

    next()
}

export {
    validadeFields,
    validadeFieldStatus
}