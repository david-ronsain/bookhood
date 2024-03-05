import { NotFoundException } from '@nestjs/common'

export class BookNotFoundException extends NotFoundException {
	constructor(message: string) {
		super(message)
	}
}
