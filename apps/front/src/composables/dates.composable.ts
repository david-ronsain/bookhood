export const displayKeyboardDates = (
	date: any,
	startDate: string,
	endDate: string,
): string => {
	return (
		date.format(startDate, 'keyboardDate') +
		' - ' +
		date.format(endDate, 'keyboardDate')
	)
}