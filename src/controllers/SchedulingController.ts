import { Request, Response } from "express";

export class SchedulingController{
    static async createScheduling(req:Request, res: Response){
        res.status(201).json({
            message: "Agendamento Realizado com Sucesso",
            status: 201
        })
    }

    static async listScheduling(req:Request, res: Response){
        res.status(200).json({
            message: "Success",
            status: 200
        })
    }

    static async updateScheduling(req:Request, res: Response){
        res.status(200).json({
            message: "Status do Agendamento Alterado",
            status: 200
        })
    }
    
}