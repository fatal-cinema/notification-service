import type { EmailChangedEvent, OtpRequestedEvent, PhoneChangedEvent } from '@fatal-cinema/contracts'
import { Controller, Logger } from '@nestjs/common'
import { Ctx, EventPattern, Payload, type RmqContext } from '@nestjs/microservices'

import { RmqService } from '@core/rmq/rmq.service'

import { NotificationService } from './notification.service'

@Controller()
export class NotificationController {
	private readonly logger = new Logger(NotificationController.name)

	constructor(
		private readonly notificationService: NotificationService,
		private readonly RmqService: RmqService
	) {}

	@EventPattern('auth.otp.requested')
	async otpRequested(@Payload() data: OtpRequestedEvent, @Ctx() ctx: RmqContext) {
		try {
			this.logger.log(`OTP event received: ${data}`)

			await this.notificationService.sendOtp(data)

			this.RmqService.ack(ctx)
		} catch (error) {
			this.logger.error(`OTP processing error: ${error.message ?? error}`)

			this.RmqService.nack(ctx)
		}
	}

	@EventPattern('account.phone.changed')
	async phoneChanged(@Payload() data: PhoneChangedEvent, @Ctx() ctx: RmqContext) {
		try {
			await this.notificationService.sendPhoneChange(data)

			this.RmqService.ack(ctx)
		} catch (error) {
			this.logger.error(`Phone change processing error: ${error.message ?? error}`)

			this.RmqService.nack(ctx)
		}
	}

	@EventPattern('account.email.changed')
	async emailChanged(@Payload() data: EmailChangedEvent, @Ctx() ctx: RmqContext) {
		try {
			await this.notificationService.sendEmailChange(data)

			this.RmqService.ack(ctx)
		} catch (error) {
			this.logger.error(`Email change processing error: ${error.message ?? error}`)

			this.RmqService.nack(ctx)
		}
	}
}
