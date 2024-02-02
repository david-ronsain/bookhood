import { Module } from '@nestjs/common'
import { BOOK_USECASES } from './usecases'
import { DomainModule } from '../domain/domain.module'
import { MongooseModule } from '@nestjs/mongoose'
import {
	ClientProxyFactory,
	RmqOptions,
	Transport,
} from '@nestjs/microservices'
import envConfig from '../../config/env.config'
import { BookController } from './controllers/book.controller'
import BookSchema from '../infrastructure/adapters/repository/schemas/book.schema'
import BookRepositoryMongo from '../infrastructure/adapters/repository/book.repository.mongo'
import LibraryRepositoryMongo from '../infrastructure/adapters/repository/library.repository.mongo'
import LibrarySchema from '../infrastructure/adapters/repository/schemas/library.schema'

@Module({
	imports: [
		DomainModule,
		MongooseModule.forFeature([
			{
				name: 'Book',
				schema: BookSchema,
			},
			{
				name: 'Library',
				schema: LibrarySchema,
			},
		]),
	],
	controllers: [BookController],
	providers: [
		...BOOK_USECASES,
		{
			provide: 'BookRepository',
			useClass: BookRepositoryMongo,
		},
		{
			provide: 'LibraryRepository',
			useClass: LibraryRepositoryMongo,
		},
		{
			provide: 'RabbitUser',
			useFactory: () => {
				return ClientProxyFactory.create({
					transport: Transport.RMQ,
					options: {
						urls: [
							`${envConfig().rabbitmq.protocol || ''}://${
								envConfig().rabbitmq.user || ''
							}:${envConfig().rabbitmq.password || ''}@${
								envConfig().rabbitmq.host || ''
							}:${envConfig().rabbitmq.port || ''}/${
								envConfig().rabbitmq.vhost || ''
							}`,
						],
						queue: envConfig().rabbitmq.queues.user || '',
						queueOptions: {
							durable: true,
						},
					},
				} as RmqOptions)
			},
		},
	],
	exports: [...BOOK_USECASES],
})
export class ApplicationModule {}
