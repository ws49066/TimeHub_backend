import 'dotenv/config'

const authConfig = {
    jwt: {
        secret: process.env.JWT_SECRET || "default",
    }
}

export {
    authConfig
}