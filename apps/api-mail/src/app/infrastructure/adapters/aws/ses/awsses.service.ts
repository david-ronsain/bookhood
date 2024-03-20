import { Inject, Injectable } from '@nestjs/common'
import { InjectAwsService } from 'nest-aws-sdk'
import { AWSError, SES } from 'aws-sdk'
import { BookRequestMailDTO, ICreateUserDTO } from '@bookhood/shared'
import { IMailer } from '../../../../domain/ports/mailer.interface'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import * as fs from 'fs/promises'
import * as path from 'path'
import { compile } from 'handlebars'
import mjml2html from 'mjml'
import { PromiseResult } from 'aws-sdk/lib/request'
import envConfig from '../../../../../config/env.config'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { AuthSendLinkDTO, RequestInfosDTO } from '@bookhood/shared-api'

@Injectable()
export class SESManagerService implements IMailer {
	constructor(
		@InjectAwsService(SES) private readonly ses: SES,
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly i18n: I18nService,
	) {}

	async requestCreated(infos: BookRequestMailDTO): Promise<void> {
		const template = 'request/created.mjml'
		const link = `${envConfig().front.protocol}://${
			envConfig().front.host
		}:${envConfig().front.port}/account`

		const content = await this.parseTemplate(
			template,
			this.i18n.t('mails.request.created.subject', {
				lang: I18nContext.current()?.lang,
			}),
			{
				link,
				text: {
					text1: this.i18n.t('mails.request.created.text1', {
						args: { firstName: infos.recipientFirstName },
						lang: I18nContext.current()?.lang,
					}),
					text2: this.i18n.t('mails.request.created.text2', {
						args: {
							firstName: infos.emitterFirstName,
							book: infos.book,
						},
						lang: I18nContext.current()?.lang,
					}),
					text3: this.i18n.t('mails.request.created.text3', {
						lang: I18nContext.current()?.lang,
					}),
					cta: this.i18n.t('mails.request.created.cta', {
						lang: I18nContext.current()?.lang,
					}),
				},
			},
		)

		if (!content.length) {
			this.logger.error(`template not found - ${template}`)
			throw new Error(
				this.i18n.t('mails.templateNotFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		this.sendEmail(
			envConfig().settings.mailFrom,
			[this.mailTo(infos.email)],
			this.i18n.t('mails.request.created.subject', {
				lang: I18nContext.current()?.lang,
			}),
			content,
		)
	}

	async requestAccepted(infos: RequestInfosDTO): Promise<void> {
		const template = 'request/accepted.mjml'

		const content = await this.parseTemplate(
			template,
			this.i18n.t('mails.request.accepted.subject', {
				lang: I18nContext.current()?.lang,
			}),
			{
				text: {
					text1: this.i18n.t('mails.request.accepted.text1', {
						args: { firstName: infos.emitter.firstName },
						lang: I18nContext.current()?.lang,
					}),
					text2: this.i18n.t('mails.request.accepted.text2', {
						args: {
							firstName: infos.owner.firstName,
							book: infos.book.title,
						},
						lang: I18nContext.current()?.lang,
					}),
					text3: this.i18n.t('mails.request.accepted.text3', {
						lang: I18nContext.current()?.lang,
					}),
				},
			},
		)

		if (!content.length) {
			this.logger.error(`template not found - ${template}`)
			throw new Error(
				this.i18n.t('mails.templateNotFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		this.sendEmail(
			envConfig().settings.mailFrom,
			[this.mailTo(infos.emitter.email)],
			this.i18n.t('mails.request.accepted.subject', {
				args: {
					firstName: infos.owner.firstName,
					book: infos.book.title,
				},
				lang: I18nContext.current()?.lang,
			}),
			content,
		)
	}

	async requestRefused(infos: RequestInfosDTO): Promise<void> {
		const template = 'request/refused.mjml'

		const content = await this.parseTemplate(
			template,
			this.i18n.t('mails.request.refused.subject', {
				lang: I18nContext.current()?.lang,
			}),
			{
				text: {
					text1: this.i18n.t('mails.request.refused.text1', {
						args: { firstName: infos.emitter.firstName },
						lang: I18nContext.current()?.lang,
					}),
					text2: this.i18n.t('mails.request.refused.text2', {
						args: {
							firstName: infos.owner.firstName,
							book: infos.book.title,
						},
						lang: I18nContext.current()?.lang,
					}),
					text3: this.i18n.t('mails.request.refused.text3', {
						lang: I18nContext.current()?.lang,
					}),
				},
			},
		)

		if (!content.length) {
			this.logger.error(`template not found - ${template}`)
			throw new Error(
				this.i18n.t('mails.templateNotFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		this.sendEmail(
			envConfig().settings.mailFrom,
			[this.mailTo(infos.emitter.email)],
			this.i18n.t('mails.request.refused.subject', {
				args: {
					firstName: infos.owner.firstName,
					book: infos.book.title,
				},
				lang: I18nContext.current()?.lang,
			}),
			content,
		)
	}

	async requestNeverReceived(infos: RequestInfosDTO): Promise<void> {
		const template = 'request/neverReceived.mjml'

		const content = await this.parseTemplate(
			template,
			this.i18n.t('mails.request.neverReceived.subject', {
				lang: I18nContext.current()?.lang,
			}),
			{
				text: {
					text1: this.i18n.t('mails.request.neverReceived.text1', {
						args: { firstName: infos.owner.firstName },
						lang: I18nContext.current()?.lang,
					}),
					text2: this.i18n.t('mails.request.neverReceived.text2', {
						args: {
							firstName: infos.emitter.firstName,
							book: infos.book.title,
						},
						lang: I18nContext.current()?.lang,
					}),
					text3: this.i18n.t('mails.request.neverReceived.text3', {
						lang: I18nContext.current()?.lang,
					}),
				},
			},
		)

		if (!content.length) {
			this.logger.error(`template not found - ${template}`)
			throw new Error(
				this.i18n.t('mails.templateNotFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		this.sendEmail(
			envConfig().settings.mailFrom,
			[this.mailTo(infos.owner.email)],
			this.i18n.t('mails.request.neverReceived.subject', {
				args: {
					firstName: infos.emitter.firstName,
					book: infos.book.title,
				},
				lang: I18nContext.current()?.lang,
			}),
			content,
		)
	}

	async requestReturnedWithIssue(infos: RequestInfosDTO): Promise<void> {
		const template = 'request/returnedWithIssue.mjml'

		const content = await this.parseTemplate(
			template,
			this.i18n.t('mails.request.returnedWithIssue.subject', {
				lang: I18nContext.current()?.lang,
			}),
			{
				text: {
					text1: this.i18n.t(
						'mails.request.returnedWithIssue.text1',
						{
							args: { firstName: infos.emitter.firstName },
							lang: I18nContext.current()?.lang,
						},
					),
					text2: this.i18n.t(
						'mails.request.returnedWithIssue.text2',
						{
							args: {
								firstName: infos.owner.firstName,
								book: infos.book.title,
							},
							lang: I18nContext.current()?.lang,
						},
					),
					text3: this.i18n.t(
						'mails.request.returnedWithIssue.text3',
						{ lang: I18nContext.current()?.lang },
					),
				},
			},
		)

		if (!content.length) {
			this.logger.error(`template not found - ${template}`)
			throw new Error(
				this.i18n.t('mails.templateNotFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		this.sendEmail(
			envConfig().settings.mailFrom,
			[this.mailTo(infos.emitter.email)],
			this.i18n.t('mails.request.returnedWithIssue.subject', {
				args: {
					book: infos.book.title,
				},
				lang: I18nContext.current()?.lang,
			}),
			content,
		)
	}

	async userRegistered(user: ICreateUserDTO): Promise<void> {
		const template = 'user/registered.mjml'
		const link = `${envConfig().front.protocol}://${
			envConfig().front.host
		}:${envConfig().front.port}/signin/${user.session.token}`

		const content = await this.parseTemplate(
			template,
			this.i18n.t('mails.user.registered.subject', {
				lang: I18nContext.current()?.lang,
			}),
			{
				firstName: user.firstName,
				text: {
					text1: this.i18n.t('mails.user.registered.text1', {
						args: { firstName: user.firstName },
						lang: I18nContext.current()?.lang,
					}),
					text2: this.i18n.t('mails.auth.signin.text2', {
						args: { link },
						lang: I18nContext.current()?.lang,
					}),
					text3: this.i18n.t('mails.user.registered.text2', {
						lang: I18nContext.current()?.lang,
					}),
				},
			},
		)

		if (!content.length) {
			this.logger.error(`template not found - ${template}`)
			throw new Error(
				this.i18n.t('mails.templateNotFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		this.sendEmail(
			envConfig().settings.mailFrom,
			[this.mailTo(user.email)],
			this.i18n.t('mails.user.registered.subject', {
				lang: I18nContext.current()?.lang,
			}),
			content,
		)
	}

	async authSendLink(user: AuthSendLinkDTO): Promise<void> {
		const template = 'auth/send-link.mjml'
		const link = `${envConfig().front.protocol}://${
			envConfig().front.host
		}:${envConfig().front.port}/signin/${user.session.token}`

		const content = await this.parseTemplate(
			template,
			this.i18n.t('mails.auth.signin.subject', {
				lang: I18nContext.current()?.lang,
			}),
			{
				text: {
					text1: this.i18n.t('mails.auth.signin.text1', {
						args: { firstName: user.firstName },
						lang: I18nContext.current()?.lang,
					}),
					text2: this.i18n.t('mails.auth.signin.text2', {
						args: { link },
						lang: I18nContext.current()?.lang,
					}),
				},
			},
		)

		if (!content.length) {
			this.logger.error(`template not found - ${template}`)
			throw new Error(
				this.i18n.t('mails.templateNotFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		this.sendEmail(
			envConfig().settings.mailFrom,
			[this.mailTo(user.email)],
			this.i18n.t('mails.auth.signin.subject', {
				lang: I18nContext.current()?.lang,
			}),
			content,
		)
	}

	sendEmail(
		from: string,
		to: string[],
		subject: string,
		body: string,
		cc: string[] = [],
		bcc: string[] = [],
	): Promise<unknown> {
		return this.ses
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
						`Mail sent - ${subject} - ${response.MessageId}`,
					)
				},
			)
			.catch((err) => {
				this.logger.error(err)
			})
	}

	private async parseTemplate(
		templatePath: string,
		title: string,
		data: object,
	): Promise<string> {
		const file = path.join(
			__dirname,
			'/app/application/mails/',
			templatePath,
		)
		const layoutFile = path.join(
			__dirname,
			'/app/application/mails/layout/',
			'layout.mjml',
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
						websiteName: this.i18n.t('mails.websiteName', {
							lang: I18nContext.current()?.lang,
						}),
						websitePhrase: this.i18n.t('mails.websitePhrase', {
							lang: I18nContext.current()?.lang,
						}),
						copyright: this.i18n.t('mails.copyright', {
							lang: I18nContext.current()?.lang,
						}),
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
