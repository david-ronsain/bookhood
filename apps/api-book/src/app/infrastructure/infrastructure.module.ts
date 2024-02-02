import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import BookSchema from './adapters/repository/schemas/book.schema'
import { ApplicationModule } from '../application/application.module'
import envConfig from '../../config/env.config'
import LibrarySchema from './adapters/repository/schemas/library.schema'

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
		MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
		MongooseModule.forFeature([{ name: 'Library', schema: LibrarySchema }]),
	],
})
export class InfrastructureModule {}
