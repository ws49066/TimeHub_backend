import { Response, Request, NextFunction } from "express";


const hourBlockRegex = /^(30|60)$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const validadeRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { room, start_time, end_time, hour_block } = req.body
    
    const userRole = req.user?.role

    if (userRole !== "admin") {
        return res.status(403).json(
            {
                message: "Você não tem permissão para criar Sala, Entre em contato com o Administrador",
                status: 403
            }
        );
    }


    if (!room || !start_time || !end_time || !hour_block) {
        return res.status(400).json({
            message: 'Campos obrigatórios não informados',
        })
    }


    if (!hourBlockRegex.test(hour_block.toString())) {
        return res.status(400).json({
            message: 'Bloco de Horas deve ser 30 ou 60',
        });
    }

    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
        return res.status(400).json({
            message: 'Hora inicial e Hora final devem estar no formato HH:MM',
        });
    }



    next()

}

export {
    validadeRoom
}