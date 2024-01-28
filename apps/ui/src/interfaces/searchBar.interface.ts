export interface IItem {
	value: string
	title: string
}

export interface ISearchingEventProps {
	text: string
	page: number
	type: 'inauthor' | 'intitle'
}

export interface BhSearchBarProps {
	isLoading?: boolean
	label?: string | undefined
	placeholder?: string | undefined
	authorLabel?: string | undefined
	bookLabel?: string | undefined
	noResultLabel?: string | undefined
}

export interface ISearchTypeItem {
	value: 'inauthor' | 'intitle'
	title: string
	icon: unknown
}
