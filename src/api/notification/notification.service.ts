import type { OtpRequestedEvent } from '@fatal-cinema/contracts'
import { Injectable } from '@nestjs/common'

import { MailService } from '@core/mail/mail.service'

@Injectable()
export class NotificationService {
	constructor(private readonly mailService: MailService) {}

	async sendOtp(data: OtpRequestedEvent) {
		const { identifier, type, code } = data

		if (type === 'email') {
			await this.mailService.sendOtp(identifier, code)
		} else {
			console.log(`SMS code: `, code)
		}
	}
}
