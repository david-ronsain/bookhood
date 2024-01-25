import { CreateUserDTO } from '../../../../src/app/application/dto/user.dto'
import { validateSync } from 'class-validator'

describe('Testing the UserDTO', () => {
	const dto = new CreateUserDTO()
	const validationRules = {
		forbidUnknownValues: true,
		stopAtFirstError: true,
	}

	it('should rejects every field', () => {
		expect(validateSync(dto, validationRules).length).toBe(3)

		dto.firstName = ''

		expect(validateSync(dto, validationRules).length).toBe(3)
	})

	it('should rejects lastName and email', () => {
		dto.firstName = 'first'

		expect(validateSync(dto, validationRules).length).toBe(2)

		dto.lastName = ''

		expect(validateSync(dto, validationRules).length).toBe(2)
	})

	it('should rejects email', () => {
		dto.lastName = 'last'

		expect(validateSync(dto, validationRules).length).toBe(1)

		dto.email = ''

		expect(validateSync(dto, validationRules).length).toBe(1)

		dto.email = 'test'

		expect(validateSync(dto, validationRules).length).toBe(1)
	})

	it('should validate the DTO', () => {
		dto.email = 'first.last@name.test'

		expect(validateSync(dto, validationRules).length).toBe(0)
	})
})
