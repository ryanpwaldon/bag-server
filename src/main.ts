import { HoneybadgerExceptionsFilter } from 'src/common/filters/honeybadger-exceptions.filter'
import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'
import { connect } from 'ngrok'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new HoneybadgerExceptionsFilter(httpAdapter))
  const configService = app.get(ConfigService)
  const port = process.env.PORT || 3000
  const appEnv = process.env.APP_ENV
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.set('trust proxy', true)
  app.enableCors({
    credentials: true,
    origin: [
      configService.get('ADMIN_URL') as string,
      configService.get('PLUGIN_URL') as string,
      configService.get('MARKETING_URL') as string
    ]
  })
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
