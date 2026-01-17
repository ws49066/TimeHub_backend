import { Response, Request, NextFunction } from "express";


const hourRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const validadeFields = async (req: Request, res: Response, next: NextFunction) => {

    const { roomId, date, hour } = req.body

    if (!roomId || !date || !hour) {
        return res.status(400).json({
            message: 'Campos obrigatórios não informados'
        })
    }


    if (!hourRegex.test(hour)) {
        return res.status(400).json({
            message: 'Horário inválido (HH:mm)'
        })
    }


    if (!dateRegex.test(date)) {
        return res.status(400).json({
            message: 'Data inválida. Use o formato YYYY-MM-DD'
        });
    }

    const selectedDateTime = new Date(date + "T" + hour);

    const today = new Date()

    if (selectedDateTime < today) {
        return res.status(400).json({
            message: 'Não é possível agendar para datas e horários passados'
        })
    }

    next()
}

const validadeFieldStatus = async (req: Request, res: Response, next: NextFunction) => {

    const { status, id } = req.body

    if (!status || !id) {
        return res.status(400).json({
            message: 'Campos obrigatórios não informados'
        })
    }

    const validStatus = ["confirmed", "canceled"]

    if (!validStatus.includes(status)) {
        return res.status(400).json({
            error: `Status inválido. Deve ser: ${validStatus.join(" ou ")}.`
        });
    }

    next()
}

export {
    validadeFields,
    validadeFieldStatus
}