import { Router, Request as Req, Response as Res } from "express"

const routes = Router()

routes.get("/", (req: Req, res: Res) => {
    res.status(200).json({
        message: "test"
    })
})

export default routes