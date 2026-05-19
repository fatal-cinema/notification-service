import { ConfigService } from '@nestjs/config'

import type { SmsOptions } from '@shared/interfaces'

export function getExolveConfig(configService: ConfigService): SmsOptions {
	return {
		apiKey: configService.getOrThrow<string>('exolve.apiKey'),
		sender: configService.getOrThrow<string>('exolve.sender'),
	}
}
