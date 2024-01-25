import { Module } from '@nestjs/common'
import { USECASES } from './usecases'
import { MailController } from './controllers/mail.controller'
import { SESManagerService } from '../infrastructure/adapters/aws/ses/awsses.service'
import { SESManagerModule } from '../infrastructure/adapters/aws/ses/awsses.module'

@Module({
	imports: [SESManagerModule],
	controllers: [MailController],
	providers: [
		...USECASES,
		{
			provide: 'Mailer',
			useClass: SESManagerService,
		},
	],
	exports: [...USECASES],
})
export class ApplicationModule {}
