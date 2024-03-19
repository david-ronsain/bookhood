import { DTOWithAuth } from './common.dto'

export interface GetProfileMQDTO extends DTOWithAuth {
	userId: string
}

export interface ProfileStatsMQDTO extends DTOWithAuth {
	userId: string
}

export interface GetProfileByTokenMQDTO extends DTOWithAuth {
	token: string
}

export interface CreateUserMQDTO extends DTOWithAuth {
	firstName: string

	lastName: string

	email: string
}
