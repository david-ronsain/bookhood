export enum MQConversationMessageType {
	HEALTH = 'conversation-health',
	CREATE_AND_GET = 'conversation-get-or-create',
	ADD_MESSAGE = 'conversation-add-message',
	FLAG_AS_SEEN = 'conversation-flag-seen',
}

export enum MQUerMessageType {
	GET_BY_TOKEN = 'user-get-by-token',
}

export enum MQBookMessageType {
	CREATE = 'book-add',
	SEARCH = 'book-search',
	GET = 'book-get',
	HEALTH = 'book-health',
}
