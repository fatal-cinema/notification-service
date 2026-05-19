import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { MailModule } from '@core/mail/mail.module'
import { SmsModule } from '@core/sms/sms.module'
import { getExolveConfig } from '@config/factories'

import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

@Module({
	imports: [
		MailModule,
		SmsModule.registerAsync({
			useFactory: getExolveConfig,
			inject: [ConfigService],
		}),
	],
	controllers: [NotificationController],
	providers: [NotificationService],
})
export class NotificationModule {}
