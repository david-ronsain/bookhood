export const shortenText = (text: string, nbChars: number): string => {
	return text.length <= nbChars
		? text
		: text.substring(0, nbChars - 3) + '...'
}
