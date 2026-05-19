import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

import { TemplateService } from './template.service'

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly templateService: TemplateService
	) {}

	async sendOtp(email: string, code: string) {
		const html = await this.templateService.render('otp', { code })

		await this.mailerService.sendMail({
			to: email,
			subject: 'Ваш код подтверждения',
			html,
		})
	}
}
