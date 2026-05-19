import { HttpModule } from '@nestjs/axios'
import { DynamicModule, Module } from '@nestjs/common'

import type { SmsAsyncOptions, SmsOptions } from '@shared/interfaces'

import { SMS_OPTIONS } from './constants'
import { SmsService } from './sms.service'

@Module({})
export class SmsModule {
	static register(options: SmsOptions): DynamicModule {
		return {
			module: SmsModule,
			imports: [HttpModule],
			providers: [SmsService, { provide: SMS_OPTIONS, useValue: options }],
			exports: [SmsService],
		}
	}

	static registerAsync(options: SmsAsyncOptions): DynamicModule {
		return {
			module: SmsModule,
			imports: [HttpModule, ...(options.imports ?? [])],
			providers: [SmsService, { provide: SMS_OPTIONS, inject: options.inject ?? [], useFactory: options.useFactory }],
			exports: [SmsService],
		}
	}
}
