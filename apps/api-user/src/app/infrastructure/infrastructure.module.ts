import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import UserSchema from './adapters/repository/schemas/user.schema'
import { ApplicationModule } from '../application/application.module'
import envConfig from '../../config/env.config'

@Module({
	imports: [
		ApplicationModule,
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: () => ({
				uri: `${envConfig().mongo.protocol}://${
					envConfig().mongo.user
				}${
					envConfig().mongo.host
				}:${envConfig().mongo.port.toString()}/${
					envConfig().mongo.database
				}`,
			}),
		}),
		MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
	],
})
export class InfrastructureModule {}
