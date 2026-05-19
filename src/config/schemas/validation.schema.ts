import { z } from 'zod'

export enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test',
}

export const validationSchema = z.object({
	NODE_ENV: z.enum(Environment).default(Environment.Development),

	RMQ_URL: z.string().nonempty(),
	RMQ_QUEUE: z.string().nonempty(),

	SMTP_HOST: z.string().nonempty(),
	SMTP_PORT: z.coerce.number(),
	SMTP_LOGIN: z.string().nonempty(),
	SMTP_PASSWORD: z.string().nonempty(),
	SMTP_FROM: z.email().nonempty(),
	SMTP_SECURE: z.string().transform(v => v === 'true'),

	EXOLVE_API_KEY: z.string().nonempty(),
	EXOLVE_SENDER: z.string().nonempty(),
})
