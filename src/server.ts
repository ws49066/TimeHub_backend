import 'dotenv/config'
import { startApp } from './app'

const PORT = Number(process.env.PORT) || 3001

async function bootstrap() {
  try {
    const app = await startApp()

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start app:', error)
    process.exit(1)
  }
}

bootstrap()