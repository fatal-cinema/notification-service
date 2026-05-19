import type { OtpRequestedEvent } from '@fatal-cinema/contracts'
import { Injectable } from '@nestjs/common'

import { MailService } from '@core/mail/mail.service'
import { SmsService } from '@core/sms/sms.service'

@Injectable()
export class NotificationService {
	constructor(
		private readonly mailService: MailService,
		private readonly smsService: SmsService
	) {}

	async sendOtp(data: OtpRequestedEvent) {
		const { identifier, type, code } = data

		if (type === 'email') {
			await this.mailService.sendOtp(identifier, code)
		} else {
			await this.smsService.sendOtp(identifier, code)
		}
	}
}
