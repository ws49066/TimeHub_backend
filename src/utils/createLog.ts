import { Log,ILogCreation } from "@/models/LogModel";

export async function createLog({clientId,action, module }:ILogCreation) {
    await Log.create({
        clientId,
        action,
        module
    })
}