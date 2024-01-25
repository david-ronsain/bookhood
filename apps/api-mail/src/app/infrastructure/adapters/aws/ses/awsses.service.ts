import { Inject, Injectable } from '@nestjs/common'
import { InjectAwsService } from 'nest-aws-sdk'
import { AWSError, SES } from 'aws-sdk'
import { ICreateUserDTO } from '@bookhood/shared'
import { IMailer } from '../../../../domain/ports/mailer.interface'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import * as fs from 'fs/promises'
import * as path from 'path'
import { compile } from 'handlebars'
import mjml2html from 'mjml'
import { PromiseResult } from 'aws-sdk/lib/request'
import envConfig from '../../../../../config/env.config'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class SESManagerService implements IMailer {
	constructor(
		@InjectAwsService(SES) private readonly ses: SES,
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly i18n: I18nService
	) {}

	async userRegistered(user: ICreateUserDTO): Promise<void> {
		const template = 'user/registered.mjml'
		const content = await this.parseTemplate(
			template,
			this.i18n.t('mails.user.registered.subject'),
			{
				firstName: user.firstName,
				text: {
					text1: this.i18n.t('mails.user.registered.text1', {
						args: { firstName: user.firstName },
					}),
					text2: this.i18n.t('mails.user.registered.text2'),
				},
			}
		)

		if (!content.length) {
			this.logger.error(`template not found - ${template}`)
			throw new Error('template not found')
		}

		this.sendEmail(
			envConfig().settings.mailFrom,
			[this.mailTo(user.email)],
			this.i18n.t('mails.user.registered.subject'),
			content
		)
	}

	sendEmail(
		from: string,
		to: string[],
		subject: string,
		body: string,
		cc: string[] = [],
		bcc: string[] = []
	): void {
		this.ses
			.sendEmail({
				Destination: {
					ToAddresses: to,
					BccAddresses: bcc,
					CcAddresses: cc,
				},
				Message: {
					Body: {
						Html: {
							Charset: 'UTF-8',
							Data: body,
						},
					},
					Subject: {
						Charset: 'UTF-8',
						Data: subject,
					},
				},
				Source: from,
			})
			.promise()
			.then(
				(response: PromiseResult<SES.SendEmailResponse, AWSError>) => {
					this.logger.info(
						`Mail sent - ${subject} - ${response.MessageId}`
					)
				}
			)
			.catch((err) => {
				console.log(err)
			})
	}

	private async parseTemplate(
		templatePath: string,
		title: string,
		data: object
	): Promise<string> {
		const file = path.join(
			__dirname,
			'/app/application/mails/',
			templatePath
		)
		const layoutFile = path.join(
			__dirname,
			'/app/application/mails/layout/',
			'layout.mjml'
		)

		let html = ''

		await fs
			.readFile(layoutFile, {
				encoding: 'utf8',
			})
			.then((content: string) => {
				html = content
				return fs.readFile(file, { encoding: 'utf8' })
			})
			.then((content: string) => {
				html = html.replace('{{ content }}', content)
				const template = compile(html)
				const mjml = template({
					...data,
					title,
					trads: {
						websiteName: 'Bookhood',
						websitePhrase:
							'Les livres ont aussi droit a une seconde chance',
						copyright: '@bookhood 2024',
					},
				})
				html = mjml2html(mjml).html
				return html
			})
			.catch((err) => {
				html = ''
				this.logger.error(`Mail error: ${JSON.stringify(err)}`)
			})

		return html
	}

	mailTo(email: string): string {
		return envConfig().settings.env === 'prod'
			? email
			: envConfig().settings.mailTo
	}
}
