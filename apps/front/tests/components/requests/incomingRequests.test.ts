/* eslint-disable @nx/enforce-module-boundaries */
import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import IncomingRequests from '../../../src/components/requests/incomingRequests.vue'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { BhDatatable } from '@bookhood/ui'
import { useRequestStore, useMainStore } from '../../../src/store'
import { RequestStatus } from '../../../../shared/src'
import BtnValidateStatus from '../../../src/components/requests/actions/btnValidateStatus.vue'
import BtnRefuseStatus from '../../../src/components/requests/actions/btnRefuseStatus.vue'
import BtnOtherAction from '../../../src/components/requests/actions/btnOtherAction.vue'
import { useRouter } from 'vue-router'

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

describe('Testing the component IncomingRequests', () => {
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
		wrapper = mount(IncomingRequests, {
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
							'<div class="incoming-requests-datatable"><slot/></div>',
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
				},
			},
		})

		requestStore = useRequestStore()
		mainStore = useMainStore()
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(IncomingRequests).exists()).toBe(true)
	})

	it('should change the table current page', async () => {
		wrapper.findComponent(BhDatatable).vm.$emit('update:page')
		await wrapper.vm.$nextTick()

		expect(requestStore.getIncomingRequests).toHaveBeenCalledTimes(0)

		requestStore.getIncomingRequests.mockReturnValue(Promise.resolve())
		mainStore.profile = {
			_id: 'userId',
		}
		await wrapper.vm.$nextTick()
		expect(requestStore.getIncomingRequests).toHaveBeenCalledTimes(1)
	})

	it('should display one request', async () => {
		await loadRequests()
		expect(
			wrapper.find('.incoming-requests-datatable tbody tr').text(),
		).toContain(requestStore.incomingRequests.results[0].title)
	})

	it('should display the no data empty state', async () => {
		expect(
			wrapper.findComponent('.v-data-table-rows-no-data').exists(),
		).toBe(true)
	})

	it('should display the validate status button for pending_validation', async () => {
		await loadRequests()

		wrapper.findComponent(BtnValidateStatus).vm.$emit('status:validated')
		expect(wrapper.findComponent(BtnValidateStatus).html()).toContain(
			'accept',
		)
		await wrapper.vm.$nextTick()

		expect(count).toBe(1)
	})

	it('should display the validate status button for return_pending', async () => {
		await loadRequests(RequestStatus.RETURN_PENDING)

		wrapper.findComponent(BtnValidateStatus).vm.$emit('status:validated')
		expect(wrapper.findComponent(BtnValidateStatus).html()).toContain(
			'acceptReturn',
		)
		await wrapper.vm.$nextTick()

		expect(count).toBe(1)
	})

	it('should display the validate status button for returned_with_issue', async () => {
		await loadRequests(RequestStatus.RETURNED_WITH_ISSUE)

		wrapper.findComponent(BtnValidateStatus).vm.$emit('status:validated')
		expect(wrapper.findComponent(BtnValidateStatus).html()).toContain(
			'issueFixed',
		)
		await wrapper.vm.$nextTick()

		expect(count).toBe(1)
	})

	it('should not display the validate status button for accepted_pending_delivery', async () => {
		await loadRequests(RequestStatus.ACCEPTED_PENDING_DELIVERY)

		expect(wrapper.findComponent(BtnValidateStatus).exists()).toBe(false)
	})

	it('should display the refuse status button for pending_validation', async () => {
		await loadRequests()

		wrapper.findComponent(BtnRefuseStatus).vm.$emit('status:refused')
		expect(wrapper.findComponent(BtnRefuseStatus).html()).toContain(
			'refuse',
		)
		await wrapper.vm.$nextTick()

		expect(count).toBe(1)
	})

	it('should display the refuse status button for return_pending', async () => {
		await loadRequests(RequestStatus.RETURN_PENDING)

		wrapper.findComponent(BtnRefuseStatus).vm.$emit('status:refused')
		expect(wrapper.findComponent(BtnRefuseStatus).html()).toContain(
			'refuseReturn',
		)
		await wrapper.vm.$nextTick()

		expect(count).toBe(1)
	})

	it('should not display the validate status button for accepted_pending_delivery', async () => {
		await loadRequests(RequestStatus.ACCEPTED_PENDING_DELIVERY)

		expect(wrapper.findComponent(BtnRefuseStatus).exists()).toBe(false)
	})

	it('should redirect to the chat page', async () => {
		await loadRequests()

		expect(wrapper.findComponent(BtnOtherAction).exists()).toBe(true)

		wrapper.findComponent('.chat').trigger('clicked')
		await wrapper.vm.$nextTick()

		expect(useRouter().push).toHaveBeenCalledWith({
			name: 'conversation',
			params: { id: requestStore.incomingRequests.results[0]._id },
		})
	})

	const loadRequests = async (
		status: RequestStatus = RequestStatus.PENDING_VALIDATION,
	) => {
		requestStore.incomingRequests = {
			total: 1,
			results: [
				{
					_id: 'reqId',
					userFirstName: 'first',
					ownerFirstName: 'last',
					title: 'title',
					place: 'place',
					createdAt: new Date().toISOString(),
					userId: 'userId',
					ownerId: 'ownerId',
					status,
				},
			],
		}
		mainStore.profile = {
			_id: 'userId',
		}
		requestStore.getIncomingRequests.mockReturnValue(Promise.resolve())
		await wrapper.vm.$nextTick()

		expect(requestStore.getIncomingRequests).toHaveBeenCalledTimes(1)
	}
})
