import helmet from 'helmet'
import { connect } from 'ngrok'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'
import Honeybadger from '@honeybadger-io/js'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { HONEYBADGER_API_KEY } from 'src/common/constants'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { HoneybadgerExceptionsFilter } from 'src/common/filters/honeybadger-exceptions.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  Honeybadger.configure({ apiKey: HONEYBADGER_API_KEY, environment: process.env.APP_ENV, reportData: true })
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
      configService.get('MARKETING_URL') as string,
      configService.get('AFFILIATE_URL') as string
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
