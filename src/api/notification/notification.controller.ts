import type { OtpRequestedEvent } from '@fatal-cinema/contracts'
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
}
