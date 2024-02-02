export interface IBhBookArticleProps {
	book: IBhBook
}

export interface IBhBook {
	isbn?: string
	title: string
	authors: string[]
	categories: string[]
	description: string[]
	image?: string
	language: string
	subtitle: string
	publisher: string
	publishedDate: string
}
