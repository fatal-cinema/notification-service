import type { EmailChangedEvent, OtpRequestedEvent, PhoneChangedEvent } from '@fatal-cinema/contracts'
import { Controller, Logger } from '@nestjs/common'
import { Ctx, EventPattern, Payload, type RmqContext } from '@nestjs/microservices'
import { InjectMetric } from '@willsoto/nestjs-prometheus'
import type { Counter, Histogram } from 'prom-client'

import { RmqService } from '@core/rmq/rmq.service'
import { SERVICE_NAME } from '@shared/constants'

import { NotificationService } from './notification.service'

@Controller()
export class NotificationController {
	private readonly logger = new Logger(NotificationController.name)

	constructor(
		private readonly notificationService: NotificationService,
		private readonly RmqService: RmqService,

		@InjectMetric('rmq_event_processing_duration_seconds') private readonly processingDuration: Histogram<string>,
		@InjectMetric('rmq_events_total') private readonly eventsTotal: Counter<string>
	) {}

	@EventPattern('auth.otp.requested')
	async otpRequested(@Payload() data: OtpRequestedEvent, @Ctx() ctx: RmqContext) {
		const event = 'auth.otp.requested'

		const endTimer = this.processingDuration.startTimer({ service: SERVICE_NAME, event })

		try {
			this.logger.log(`OTP event received: ${data}`)

			await this.notificationService.sendOtp(data)

			this.eventsTotal.inc({ service: SERVICE_NAME, event, status: 'SUCCESS' })

			this.RmqService.ack(ctx, event)
		} catch (error) {
			this.eventsTotal.inc({ service: SERVICE_NAME, event, status: 'ERROR' })

			this.logger.error(`OTP processing error: ${error.message ?? error}`)

			this.RmqService.nack(ctx, event)

			throw error
		} finally {
			endTimer()
		}
	}

	@EventPattern('account.phone.changed')
	async phoneChanged(@Payload() data: PhoneChangedEvent, @Ctx() ctx: RmqContext) {
		const event = 'auth.otp.requested'

		const endTimer = this.processingDuration.startTimer({ service: SERVICE_NAME, event })

		try {
			await this.notificationService.sendPhoneChange(data)

			this.eventsTotal.inc({ service: SERVICE_NAME, event, status: 'SUCCESS' })

			this.RmqService.ack(ctx, event)
		} catch (error) {
			this.eventsTotal.inc({ service: SERVICE_NAME, event, status: 'ERROR' })

			this.logger.error(`Phone change processing error: ${error.message ?? error}`)

			this.RmqService.nack(ctx, event)
		} finally {
			endTimer()
		}
	}

	@EventPattern('account.email.changed')
	async emailChanged(@Payload() data: EmailChangedEvent, @Ctx() ctx: RmqContext) {
		const event = 'auth.otp.requested'

		const endTimer = this.processingDuration.startTimer({ service: SERVICE_NAME, event })

		try {
			await this.notificationService.sendEmailChange(data)

			this.eventsTotal.inc({ service: SERVICE_NAME, event, status: 'SUCCESS' })

			this.RmqService.ack(ctx, event)
		} catch (error) {
			this.eventsTotal.inc({ service: SERVICE_NAME, event, status: 'ERROR' })

			this.logger.error(`Email change processing error: ${error.message ?? error}`)

			this.RmqService.nack(ctx, event)
		} finally {
			endTimer()
		}
	}
}
