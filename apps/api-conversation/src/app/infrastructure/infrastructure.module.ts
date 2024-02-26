import { Module } from '@nestjs/common'
import { ApplicationModule } from '../application/application.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import envConfig from '../../config/env.config'
import ConversationSchema from './adapters/repository/schemas/conversation.schema'

@Module({
	imports: [
		ApplicationModule,
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: () => ({
				uri: `${envConfig().mongo.protocol}://${
					envConfig().mongo.user
						? envConfig().mongo.user +
							':' +
							envConfig().mongo.password +
							'@'
						: ''
				}${
					envConfig().mongo.host
				}:${envConfig().mongo.port.toString()}/${
					envConfig().mongo.database
				}`,
			}),
		}),
		MongooseModule.forFeature([
			{ name: 'Conversation', schema: ConversationSchema },
		]),
	],
})
export class InfrastructureModule {}
