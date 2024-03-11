import { RequestStatus, LibraryStatus } from '@bookhood/shared'

export function useStatusColor() {
	const request = (status: RequestStatus): string => {
		if (status === RequestStatus.PENDING_VALIDATION)
			return 'purple-lighten-3'
		else if (status === RequestStatus.ACCEPTED_PENDING_DELIVERY)
			return 'pink-lighten-3'
		else if (status === RequestStatus.REFUSED) return 'indigo-lighten-3'
		else if (status === RequestStatus.RECEIVED) return 'blue-lighten-3'
		else if (status === RequestStatus.NEVER_RECEIVED)
			return 'cyan-lighten-3'
		else if (status === RequestStatus.RETURN_PENDING)
			return 'teal-lighten-3'
		else if (status === RequestStatus.RETURN_ACCEPTED)
			return 'green-lighten-3'
		else if (status === RequestStatus.RETURNED_WITH_ISSUE)
			return 'red-lighten-3'
		else if (status === RequestStatus.ISSUE_FIXED) return 'amber-lighten-3'
	}

	const library = (status: LibraryStatus): string => {
		if (status === LibraryStatus.TO_GIVE) return 'purple-lighten-3'
		else if (status === LibraryStatus.TO_LEND) return 'red-lighten-3'
	}

	return { request, library }
}
