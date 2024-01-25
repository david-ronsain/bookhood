import { it, describe, beforeEach, expect, vi } from 'vitest'
import { VueWrapper, mount, config } from '@vue/test-utils'
import SignupForm from '../../../src/components/signup/signupForm.vue'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		d: (key: string) => key,
	}),
}))

config.global.mocks = {
	$t: (tKey) => tKey,
}

describe('Testing the signup form', () => {
	let wrapper: VueWrapper

	beforeEach(() => {
		const div = document.createElement('div')
		document.body.appendChild(div)
		wrapper = mount(SignupForm, {
			template: '<v-app><signup-form /></v-app>',
			attachTo: div,
			global: {
				components: {
					SignupForm,
				},
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
			},
		})
	})

	it('should display the form', async () => {
		expect(wrapper.findComponent({ name: 'SignupForm' })).toBeTruthy()
		expect(
			wrapper.findComponent({ ref: 'submit' }).attributes().disabled
		).not.toBeUndefined()
	})

	it('should not validate the firstName field', async () => {
		await wrapper.findComponent({ ref: 'firstName' }).setValue('')
		await wrapper.findComponent({ ref: 'lastName' }).setValue('test')
		await wrapper.findComponent({ ref: 'email' }).setValue('test@test.test')
		await wrapper.findComponent({ ref: 'terms' }).setValue(true)
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.$refs?.form?.isValid).toBeNull()
		expect(
			wrapper.findComponent({ ref: 'submit' }).attributes().disabled
		).not.toBeUndefined()
	})

	it('should not validate the lastName field', async () => {
		await wrapper.findComponent({ ref: 'firstName' }).setValue('test')
		await wrapper.findComponent({ ref: 'lastName' }).setValue('')
		await wrapper.findComponent({ ref: 'email' }).setValue('test@test.test')
		await wrapper.findComponent({ ref: 'terms' }).setValue(true)
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.$refs?.form?.isValid).toBeNull()
		expect(
			wrapper.findComponent({ ref: 'submit' }).attributes().disabled
		).not.toBeUndefined()
	})

	it('should not validate the email field', async () => {
		await wrapper.findComponent({ ref: 'firstName' }).setValue('test')
		await wrapper.findComponent({ ref: 'lastName' }).setValue('test')
		await wrapper.findComponent({ ref: 'email' }).setValue('')
		await wrapper.findComponent({ ref: 'terms' }).setValue(true)
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.$refs?.form?.isValid).toBeNull()
		expect(
			wrapper.findComponent({ ref: 'submit' }).attributes().disabled
		).not.toBeUndefined()

		await wrapper.findComponent({ ref: 'email' }).setValue('test@test')
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.$refs?.form?.isValid).toBeNull()
		expect(
			wrapper.findComponent({ ref: 'submit' }).attributes().disabled
		).not.toBeUndefined()
	})

	it('should not validate the temrs checkbox', async () => {
		await wrapper.findComponent({ ref: 'firstName' }).setValue('test')
		await wrapper.findComponent({ ref: 'lastName' }).setValue('test')
		await wrapper.findComponent({ ref: 'email' }).setValue('test@test.test')
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.$refs?.form?.isValid).toBeNull()
		expect(
			wrapper.findComponent({ ref: 'submit' }).attributes().disabled
		).not.toBeUndefined()
	})

	it('should validate the form', async () => {
		await wrapper.findComponent({ ref: 'firstName' }).setValue('test')
		await wrapper.findComponent({ ref: 'lastName' }).setValue('test')
		await wrapper.findComponent({ ref: 'email' }).setValue('test@test.test')
		await wrapper.findComponent({ ref: 'terms' }).setValue(true)
		await wrapper.findComponent({ name: 'SignupForm' }).vm.$nextTick()
		expect(wrapper.vm.$refs?.form?.isValid).toBe(true)
		expect(
			wrapper.findComponent({ ref: 'submit' }).attributes().disabled
		).toBeUndefined()
	})
})
