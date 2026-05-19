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
		await this.send(email, 'otp', 'Ваш код подтверждения', { code })
	}

	async sendEmailChange(email: string, code: string) {
		await this.send(email, 'email-change', 'Подтверждение смены почты', { code })
	}

	private async send(email: string, templateName: string, subject: string, data: Record<string, string | number>) {
		const html = await this.templateService.render(templateName, data)

		await this.mailerService.sendMail({
			to: email,
			subject,
			html,
		})
	}
}
