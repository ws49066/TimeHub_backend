import type { IPermissionCreation } from "@/models/PermissionModel";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number | string;
                email: string;
                role: string;
            };
        }
    }
}

export {};
