import { DTOWithAuth } from './common.dto'

export interface GetProfileMQDTO extends DTOWithAuth {
	userId: string
}
