import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMailerConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow('smtp.host'),
			port: configService.getOrThrow('smtp.port'),
			auth: {
				user: configService.getOrThrow('smtp.login'),
				pass: configService.getOrThrow('smtp.password'),
			},
			secure: configService.getOrThrow('smtp.secure'),
		},
		defaults: {
			from: `FatalCinema ${configService.getOrThrow('smtp.from')}`,
		},
	}
}
