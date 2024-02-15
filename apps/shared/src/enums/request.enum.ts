export enum RequestStatus {
	NONE = undefined,
	PENDING_VALIDATION = 'pending_validation',
	ACCEPTED_PENDING_DELIVERY = 'accepted_pending_delivery',
	REFUSED = 'refused',
	RECEIVED = 'received',
	NEVER_RECEIVED = 'never_received',
	RETURN_PENDING = 'return_pending',
	RETURN_ACCEPTED = 'return_accepted',
	RETURNED_WITH_ISSUE = 'returned_with_issue',
	ISSUE_FIXED = 'issue_fixed',
}
