import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'
import { connect } from 'ngrok'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)
  const port = process.env.PORT || 3000
  const appEnv = process.env.APP_ENV
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.set('trust proxy', true)
  app.enableCors()
  app.use(helmet())
  app.use(cookieParser())
  await app.listen(port)
  if (appEnv === 'development') {
    await connect({
      addr: port,
      region: 'au',
      subdomain: configService.get('NGROK_SUBDOMAIN'),
      authtoken: configService.get('NGROK_AUTH_TOKEN')
    })
      .then(console.log)
      .catch(console.log)
  }
}
bootstrap()
