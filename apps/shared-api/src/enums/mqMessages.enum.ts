export enum MQConversationMessageType {
	HEALTH = 'conversation-health',
	CREATE_AND_GET = 'conversation-get-or-create',
	ADD_MESSAGE = 'conversation-add-message',
	FLAG_AS_SEEN = 'conversation-flag-seen',
}

export enum MQUserMessageType {
	CREATE = 'user-create',
	GET_BY_TOKEN = 'user-get-by-token',
	GET_ME = 'user-get-me',
	GET_PROFILE = 'user-get-profile',
	GET_ROLE_BY_TOKEN = 'user-get-role-by-token',
	HEALTH = 'user-health',
}

export enum MQBookMessageType {
	CREATE = 'book-add',
	SEARCH = 'book-search',
	GET = 'book-get',
	HEALTH = 'book-health',
}

export enum MQAuthMessageType {
	HEALTH = 'auth-health',
	SEND_LINK = 'auth-send-link',
	SIGNIN = 'auth-signin',
}

export enum MQMailMessageType {
	AUTH_SEND_LINK = 'mail-auth-send-link',
	REQUEST_CREATED = 'mail-request-created',
	USER_CREATED = 'mail-user-registered',
}

export enum MQLibraryMessageType {
	LIST = 'libraries-list',
	PATCH = 'library-patch',
}

export enum MQRequestMessageType {
	CREATE = 'request-create',
	GET = 'request-get',
	LIST = 'request-list',
	PATCH = 'request-patch',
}
