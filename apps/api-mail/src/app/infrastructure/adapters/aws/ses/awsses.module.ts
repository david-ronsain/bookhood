import { Module } from '@nestjs/common'
import { SESManagerService } from './awsses.service'

@Module({
	imports: [],
	providers: [SESManagerService],
	exports: [SESManagerService],
})
export class SESManagerModule {}
