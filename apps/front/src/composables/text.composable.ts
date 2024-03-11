export function useText() {
	const shorten = (text: string, nbChars: number): string => {
		return text.length <= nbChars
			? text
			: text.substring(0, nbChars - 3) + '...'
	}

	return { shorten }
}
