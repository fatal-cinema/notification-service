import { HttpService } from '@nestjs/axios'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { catchError, firstValueFrom, retry, throwError, timeout, timer } from 'rxjs'

import type { SmsOptions } from '@shared/interfaces'

import { SMS_OPTIONS } from './constants'
import { SendSmsRequest, SendSmsResponse } from './interfaces'

@Injectable()
export class SmsService {
	private readonly logger = new Logger(SmsService.name)

	private readonly BASE_URL: string

	constructor(
		private readonly httpService: HttpService,
		@Inject(SMS_OPTIONS) private readonly options: SmsOptions
	) {
		this.BASE_URL = 'https://api.exolve.ru'
	}

	async sendOtp(phone: string, code: string) {
		return this.send({ destination: phone, text: `Ваш код подтверждения: ${code}` })
	}

	async send(data: SendSmsRequest): Promise<SendSmsResponse> {
		const payload: SendSmsRequest = {
			number: data.number ?? this.options.sender,
			destination: data.destination.replace('+', ''),
			text: data.text,
		}

		return this.request<SendSmsResponse>('POST', '/messaging/v1/SendSMS', payload)
	}

	private async request<T>(method: 'GET' | 'POST', path: string, body?: object): Promise<T> {
		const url = `${this.BASE_URL}${path}`
		let attempt = 0

		try {
			const request = this.httpService
				.request<T>({
					method,
					url,
					data: body,
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.options.apiKey}`,
					},
				})
				.pipe(
					timeout(7000),
					retry({
						count: 3,
						delay: (error, retryCount) => {
							const details = error.response?.data ?? error.message

							this.logger.warn(`Exolve API retry ${retryCount}/3 (${method} ${path}): ${JSON.stringify(details)}`)

							return timer(500)
						},
					}),
					catchError(error => {
						const details = error.response?.data ?? error.message ?? error

						this.logger.error(`Exolve API failed after 3 retries (${method} ${path}): ${JSON.stringify(details)}`)

						return throwError(() => error)
					})
				)

			const response = await firstValueFrom(request)

			return response.data
		} catch (error) {
			this.logger.error(`Request failed (${method} ${path}): ${error.message}`)

			throw error
		}
	}
}
