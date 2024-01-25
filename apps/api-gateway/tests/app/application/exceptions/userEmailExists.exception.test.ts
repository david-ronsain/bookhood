import { HttpStatus } from '@nestjs/common'
import { UserEmailExistException } from '../../../../src/app/application/exceptions/userEmailExists.exception'

describe('Testing the UserEmailExists Exception', () => {
	it('shoud return an aobject with the correct status and message', () => {
		const status = HttpStatus.CONFLICT
		const message = 'conflict error'
		const error = new UserEmailExistException(message)

		expect(error.message).toBe(message)
		expect(error.getStatus()).toBe(status)
	})
})
