import { readFileSync } from 'node:fs'
import path from 'node:path'
import { Injectable } from '@nestjs/common'
import * as Handlebars from 'handlebars'

@Injectable()
export class TemplateService {
	private cache = new Map<string, Handlebars.TemplateDelegate>()

	async render(templateName: string, context?: Record<string, string | number>) {
		if (!this.cache.has(templateName)) {
			const templatePath = path.join(process.cwd(), 'src/core/mail/templates', `${templateName}.hbs`)

			const file = readFileSync(templatePath, 'utf-8')

			this.cache.set(templateName, Handlebars.compile(file))
		}

		const template = this.cache.get(templateName)!

		return template(context)
	}
}
