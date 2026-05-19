import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import configuration from '@config/configuration'
import { IS_DEV_ENV } from '@shared/utils'

import { MailModule } from './mail/mail.module'
import { RmqModule } from './rmq/rmq.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: !IS_DEV_ENV,
			load: [configuration],
			expandVariables: true,
		}),
		RmqModule,
		MailModule,
	],
})
export class CoreModule {}
