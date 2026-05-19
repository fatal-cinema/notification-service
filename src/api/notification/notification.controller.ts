import type { OtpRequestedEvent } from '@fatal-cinema/contracts'
import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, type RmqContext } from '@nestjs/microservices'

import { RmqService } from '@core/rmq/rmq.service'

import { NotificationService } from './notification.service'

@Controller()
export class NotificationController {
	constructor(
		private readonly notificationService: NotificationService,
		private readonly RmqService: RmqService
	) {}

	@EventPattern('auth.otp.requested')
	async otpRequested(@Payload() data: OtpRequestedEvent, @Ctx() ctx: RmqContext) {
		try {
			console.log(`OTP event received: `, data)

			await this.notificationService.sendOtp(data)

			this.RmqService.ack(ctx)
		} catch (error) {
			console.log(`OTP processing error: `, error.message ?? error)

			this.RmqService.nack(ctx)
		}
	}
}
