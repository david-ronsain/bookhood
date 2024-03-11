/* eslint-disable @nx/enforce-module-boundaries */
import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import OutgoingRequests from '../../../src/components/requests/outgoingRequests.vue'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { BhDatatable } from '@bookhood/ui'
import { useRequestStore, useMainStore } from '../../../src/store'
import { IRequestSimple, RequestStatus } from '../../../../shared/src'
import BtnValidateStatus from '../../../src/components/requests/actions/btnValidateStatus.vue'
import BtnRefuseStatus from '../../../src/components/requests/actions/btnRefuseStatus.vue'
import BtnOtherAction from '../../../src/components/requests/actions/btnOtherAction.vue'
import { useRouter } from 'vue-router'
import OutgoingRequestsDatepicker from '../../../src/components/requests/outgoingRequestsDatepicker.vue'
import { requestsList } from '../../data/requestData'
import { myProfile } from '../../data/profileData'

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		d: (key: string) => key,
	}),
}))

vi.mock('vue-router')

config.global.mocks = {
	$t: (tKey) => tKey,
}

global.ResizeObserver = require('resize-observer-polyfill')

describe('Testing the component OutgoingRequests', () => {
	let wrapper: VueWrapper
	let requestStore
	let mainStore
	let count
	vi.mocked(useRouter).mockReturnValue({
		...useRouter(),
		push: vi.fn(),
	})

	beforeEach(() => {
		count = 0
		wrapper = mount(OutgoingRequests, {
			attachTo: document.body,
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
				stubs: {
					BhDatatable: {
						name: 'BhDatatable',
						template:
							'<div class="outgoing-requests-datatable"><slot/></div>',
					},
					BtnValidateStatus: {
						name: 'BtnValidateStatus',
						template: '<div><slot/></div>',
					},
					BtnRefuseStatus: {
						name: 'BtnRefuseStatus',
						template: '<div><slot/></div>',
					},
					BtnOtherAction: {
						name: 'BtnOtherAction',
						template: '<div><slot/></div>',
					},
					BhDialog: {
						name: 'BhDialog',
						template:
							'<div class="dialog"><slot name="default" /><slot name="actions"/></div>',
						methods: {
							open: () => ++count,
						},
					},
					OutgoingRequestsDatepicker: {
						name: 'OutgoingRequestsDatepicker',
						template: '<div class="date-picker"><slot /></div>',
						emits: ['datesSelected'],
					},
				},
			},
		})

		requestStore = useRequestStore()
		mainStore = useMainStore()
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(OutgoingRequests).exists()).toBe(true)
	})

	it('should change the table current page', async () => {
		wrapper.findComponent(BhDatatable).vm.$emit('update:page')
		await wrapper.vm.$nextTick()

		expect(requestStore.getOutgoingRequests).toHaveBeenCalledTimes(0)

		requestStore.getOutgoingRequests.mockReturnValue(Promise.resolve())
		mainStore.profile = myProfile
		await wrapper.vm.$nextTick()
		expect(requestStore.getOutgoingRequests).toHaveBeenCalledTimes(1)
	})

	it('should display one request', async () => {
		await loadRequests()
		expect(
			wrapper.find('.outgoing-requests-datatable tbody tr').text(),
		).toContain(requestStore.outgoingRequests.results[0].title)

		expect(
			wrapper
				.find('.outgoing-requests-datatable tbody tr td.pa-1')
				.text(),
		).toContain(' - ')
	})

	it('should display the no data empty state', async () => {
		expect(
			wrapper.findComponent('.v-data-table-rows-no-data').exists(),
		).toBe(true)
	})

	it('should display the validate status button for accepted_pending_delivery', async () => {
		await loadRequests(RequestStatus.ACCEPTED_PENDING_DELIVERY)

		wrapper.findComponent(BtnValidateStatus).vm.$emit('status:validated')
		expect(wrapper.findComponent(BtnValidateStatus).html()).toContain(
			'received',
		)
		await wrapper.vm.$nextTick()

		expect(count).toBe(1)
	})

	it('should display the validate status button for never_received', async () => {
		await loadRequests(RequestStatus.NEVER_RECEIVED)

		wrapper.findComponent(BtnValidateStatus).vm.$emit('status:validated')
		expect(wrapper.findComponent(BtnValidateStatus).html()).toContain(
			'received',
		)
		await wrapper.vm.$nextTick()

		expect(count).toBe(1)
	})

	it('should display the validate status button for received', async () => {
		await loadRequests(RequestStatus.RECEIVED)

		wrapper.findComponent(BtnValidateStatus).vm.$emit('status:validated')
		expect(wrapper.findComponent(BtnValidateStatus).html()).toContain(
			'returned',
		)
		await wrapper.vm.$nextTick()

		expect(count).toBe(1)
	})

	it('should not display the validate status button for issue_fixed', async () => {
		await loadRequests(RequestStatus.ISSUE_FIXED)

		expect(wrapper.findComponent(BtnValidateStatus).exists()).toBe(false)
	})

	it('should display the refuse status button for accepted_pending_delivery', async () => {
		await loadRequests(RequestStatus.ACCEPTED_PENDING_DELIVERY)

		wrapper.findComponent(BtnRefuseStatus).vm.$emit('status:refused')
		expect(wrapper.findComponent(BtnRefuseStatus).html()).toContain(
			'neverReceived',
		)
		await wrapper.vm.$nextTick()

		expect(count).toBe(1)
	})

	it('should not display the refuse status button for return_pending', async () => {
		await loadRequests(RequestStatus.RETURN_PENDING)

		expect(wrapper.findComponent(BtnRefuseStatus).exists()).toBe(false)
	})

	it('should redirect to the chat page', async () => {
		await loadRequests()

		expect(wrapper.findComponent(BtnOtherAction).exists()).toBe(true)

		wrapper.findComponent('.chat').trigger('clicked')
		await wrapper.vm.$nextTick()

		expect(useRouter().push).toHaveBeenCalledWith({
			name: 'conversation',
			params: { id: requestStore.outgoingRequests.results[0]._id },
		})
	})

	it('should process event selectDate', async () => {
		await loadRequests(RequestStatus.PENDING_VALIDATION)

		expect(
			wrapper
				.findComponent(OutgoingRequestsDatepicker)
				.vm.$emit('datesSelected', [new Date(), new Date()]),
		)
		await wrapper.vm.$nextTick()

		expect(wrapper.findComponent('.cancel-dates').exists()).toBe(true)
		expect(wrapper.findComponent('.save-dates').exists()).toBe(true)
	})

	it('should cancel date edition', async () => {
		await loadRequests(RequestStatus.PENDING_VALIDATION)

		expect(
			wrapper
				.findComponent(OutgoingRequestsDatepicker)
				.vm.$emit('datesSelected', [new Date(), new Date()]),
		)
		await wrapper.vm.$nextTick()

		wrapper.findComponent('.cancel-dates').trigger('click')
		await wrapper.vm.$nextTick()

		expect(
			wrapper
				.find(
					`.date-picker[dates="${requestStore.outgoingRequests.results[0].startDate},${requestStore.outgoingRequests.results[0].endDate}"]`,
				)
				.exists(),
		).toBe(true)
	})

	it('should save the new dates', async () => {
		await loadRequests(RequestStatus.PENDING_VALIDATION)

		const startDate = new Date('2024-03-15')
		const endDate = new Date('2024-03-18')

		requestStore.changeDates = () => Promise.resolve()

		expect(
			wrapper
				.findComponent(OutgoingRequestsDatepicker)
				.vm.$emit('datesSelected', [startDate, endDate]),
		)
		await wrapper.vm.$nextTick()

		wrapper.findComponent('.save-dates').trigger('click')
		await wrapper.vm.$nextTick()

		expect(
			wrapper
				.find(`.date-picker[dates="${startDate},${endDate}"]`)
				.exists(),
		).toBe(true)
		expect(mainStore.success.length).toBeGreaterThan(0)
	})

	it('should fail saving the new dates', async () => {
		await loadRequests(RequestStatus.PENDING_VALIDATION)

		const startDate = new Date('2024-03-15')
		const endDate = new Date('2024-03-18')

		requestStore.changeDates = () => Promise.reject()
		expect(
			wrapper
				.findComponent(OutgoingRequestsDatepicker)
				.vm.$emit('datesSelected', [startDate, endDate]),
		)
		await wrapper.vm.$nextTick()

		wrapper.findComponent('.save-dates').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(mainStore.error.length).toBeGreaterThan(0)
	})

	const loadRequests = async (
		status: RequestStatus = RequestStatus.ACCEPTED_PENDING_DELIVERY,
	) => {
		const list = {
			...requestsList,
			results: requestsList.results.map((res: IRequestSimple) => ({
				...res,
				status,
			})),
		}
		requestStore.outgoingRequests = list

		mainStore.profile = myProfile
		requestStore.getOutgoingRequests.mockReturnValue(Promise.resolve())
		await wrapper.vm.$nextTick()

		expect(requestStore.getOutgoingRequests).toHaveBeenCalledTimes(1)
	}
})
