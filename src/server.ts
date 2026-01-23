require('module-alias/register');

import 'dotenv/config'
import { startApp } from './app'

const PORT = process.env.PORT || 3001

startApp().then(app => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})
