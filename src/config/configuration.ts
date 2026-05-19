import { z } from 'zod'

import { validationSchema } from './schemas'

export default () => {
	const parsed = validationSchema.safeParse(process.env)

	if (!parsed.success) {
		console.error('Invalid environment variables', z.treeifyError(parsed.error))
		process.exit(1)
	}

	const env = parsed.data

	return {
		app: {
			nodeEnv: env.NODE_ENV,
		},
		rmq: {
			url: env.RMQ_URL,
			queue: env.RMQ_QUEUE,
		},
		smtp: {
			host: env.SMTP_HOST,
			port: env.SMTP_PORT,
			login: env.SMTP_LOGIN,
			password: env.SMTP_PASSWORD,
			from: env.SMTP_FROM,
			secure: env.SMTP_SECURE,
		},
	}
}
