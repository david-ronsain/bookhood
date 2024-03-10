import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import outgoingRequestsDatepicker from '../../../src/components/requests/outgoingRequestsDatepicker.vue'
import vuetify from '../../../src/plugins/vuetify'
import { BhDatePickerMenu } from '../../../../ui/src'

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		d: (key: string) => key,
	}),
}))

config.global.mocks = {
	$t: (tKey) => tKey,
}

describe('Testing the component OutgoingRequests', () => {
	let wrapper: VueWrapper
	const minDate = new Date('2024-03-08')
	const currentDates = [new Date('2024-03-10'), new Date('2024-03-11')]
	const requestDates = [new Date('2024-03-19'), new Date('2024-03-21')]

	beforeEach(() => {
		wrapper = mount(outgoingRequestsDatepicker, {
			attachTo: document.body,
			props: {
				dates: currentDates,
				minDate,
				item: {
					requests: [
						{
							startDate: requestDates[0],
							endDate: requestDates[1],
						},
					],
				},
			},
			global: {
				plugins: [vuetify],
				stubs: {
					BhDatePickerMenu: {
						name: 'BhDatePickerMenu',
						template: '<div class="datepicker"><slot/></div>',
						emits: ['datesSelected'],
					},
				},
			},
		})
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(BhDatePickerMenu).exists()).toBe(true)
	})

	it('should have the correct currently selected dates', () => {
		expect(
			wrapper
				.findComponent(BhDatePickerMenu)
				.attributes('currentdates')
				?.split(',').length,
		).toBe(2)
	})

	it('should have the correct min date', () => {
		const min =
			wrapper.findComponent(BhDatePickerMenu).attributes('mindate') ?? ''
		expect(new Date(min)).toMatchObject(minDate)
	})

	it('should have the correct available dates', () => {
		const available = wrapper
			.findComponent(BhDatePickerMenu)
			.attributes('availabledates')
			?.split(',')
			.map((date: string) => new Date(date))
		;[...currentDates, ...requestDates].forEach((date: Date) => {
			expect((available ?? []).findIndex((d: Date) => d === date)).toBe(
				-1,
			)
		})
	})
})
