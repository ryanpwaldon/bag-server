import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import httpsLocalhost from 'https-localhost'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const appEnv = process.env.APP_ENV
  const httpsOptions = appEnv === 'development' ? await httpsLocalhost().getCerts() : undefined
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { httpsOptions })
  app.set('trust proxy', true)
  app.enableCors()
  app.use(helmet())
  app.use(cookieParser())
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
