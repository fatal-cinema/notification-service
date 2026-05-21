import { IS_DEV_ENV } from '@fatal-cinema/common'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import configuration from '@config/configuration'

import { MailModule } from './mail/mail.module'
import { RmqModule } from './rmq/rmq.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: !IS_DEV_ENV,
			envFilePath: [`.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`, '.env'],
			load: [configuration],
			expandVariables: true,
		}),
		RmqModule,
		MailModule,
	],
})
export class CoreModule {}
