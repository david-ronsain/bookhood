import { it, describe, beforeEach, expect, vi } from 'vitest'
import { VueWrapper, mount, config } from '@vue/test-utils'
import SignupForm from '../../../src/components/signup/signupForm.vue'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { h } from 'vue'
import { VApp } from 'vuetify/components'
import { useMainStore, useUserStore } from '../../../src/store'
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

describe('Testing the signup form', () => {
	let wrapper: VueWrapper
	let userStore
	let mainStore
	let router

	beforeEach(() => {
		vi.mocked(useRouter).mockReturnValue({
			...useRouter(),
			push: vi.fn(),
		})

		wrapper = mount(VApp, {
			slots: {
				default: h(SignupForm),
			},
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
			},
		})

		userStore = useUserStore()
		mainStore = useMainStore()
		router = useRouter()
	})

	it('should display the form', async () => {
		expect(wrapper.findComponent({ name: 'SignupForm' })).toBeTruthy()
		expect(
			wrapper.findComponent('.signup-submit').attributes('disabled'),
		).not.toBeUndefined()
	})

	it('should not validate the firstName field', async () => {
		await fillForm({ firstName: '' })

		expect(
			wrapper.findComponent('.signup-submit').attributes('disabled'),
		).not.toBeUndefined()
	})

	it('should not validate the lastName field', async () => {
		await fillForm({ lastName: '' })

		expect(
			wrapper.findComponent('.signup-submit').attributes('disabled'),
		).not.toBeUndefined()
	})

	it('should not validate the email field', async () => {
		await fillForm({ email: '' })

		expect(
			wrapper.findComponent('.signup-submit').attributes('disabled'),
		).not.toBeUndefined()

		await wrapper.findComponent('.signup-email').setValue('test@test')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.signup-submit').attributes('disabled'),
		).not.toBeUndefined()
	})

	it('should not validate the temrs checkbox', async () => {
		await fillForm({ acceptTerms: false })

		expect(
			wrapper.findComponent('.signup-submit').attributes('disabled'),
		).not.toBeUndefined()
	})

	it('should validate the form', async () => {
		await fillForm({})
		expect(
			wrapper.findComponent('.signup-submit').attributes('disabled'),
		).toBeUndefined()
	})

	it('should succeed registering the user', async () => {
		await fillForm({})

		userStore.signup = () => Promise.resolve()
		vi.spyOn(userStore, 'signup')

		wrapper.findComponent('.signup-submit').trigger('click')
		await wrapper.vm.$nextTick()

		expect(userStore.signup).toHaveBeenCalledTimes(1)
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		expect(router.push).toHaveBeenCalledWith({ name: 'home' })
	})

	it('should fail registering the user', async () => {
		await fillForm({})

		userStore.signup = () => Promise.reject({ message: 'error' })
		vi.spyOn(userStore, 'signup')

		wrapper.findComponent('.signup-submit').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(userStore.signup).toHaveBeenCalledTimes(1)
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		expect(mainStore.error.length).toBeGreaterThan(0)
	})

	const fillForm = async (user): Promise<void> => {
		await wrapper
			.findComponent('.signup-firstName')
			.setValue(user?.firstName ?? 'first')
		await wrapper
			.findComponent('.signup-lastName')
			.setValue(user?.lastName ?? 'last')
		await wrapper
			.findComponent('.signup-email')
			.setValue(user?.email ?? 'test@test.test')
		await wrapper
			.findComponent('.signup-terms')
			.setValue(user?.acceptTerms ?? true)
		await wrapper.vm.$nextTick()
	}
})
