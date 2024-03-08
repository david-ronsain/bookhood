import { it, describe, beforeEach, expect, vi } from 'vitest'
import { VueWrapper, mount, config } from '@vue/test-utils'
import SignupForm from '../../../src/components/signup/signupForm.vue'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

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

	beforeEach(() => {
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
	})

	it('should display the form', async () => {
		expect(wrapper.findComponent({ name: 'SignupForm' })).toBeTruthy()
		expect(
			wrapper.findComponent('.signup-submit').attributes('disabled'),
		).not.toBeUndefined()
	})

	it('should not validate the firstName field', async () => {
		await wrapper.findComponent('.signup-firstName').setValue('')
		await wrapper.findComponent('.signup-lastName').setValue('test')
		await wrapper.findComponent('.signup-email').setValue('test@test.test')
		await wrapper.findComponent('.signup-terms').setValue(true)
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.signup-submit').attributes('disabled'),
		).not.toBeUndefined()
	})

	it('should not validate the lastName field', async () => {
		await wrapper.findComponent('.signup-firstName').setValue('test')
		await wrapper.findComponent('.signup-lastName').setValue('')
		await wrapper.findComponent('.signup-email').setValue('test@test.test')
		await wrapper.findComponent('.signup-terms').setValue(true)
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.signup-submit').attributes('disabled'),
		).not.toBeUndefined()
	})

	it('should not validate the email field', async () => {
		await wrapper.findComponent('.signup-firstName').setValue('test')
		await wrapper.findComponent('.signup-lastName').setValue('test')
		await wrapper.findComponent('.signup-email').setValue('')
		await wrapper.findComponent('.signup-terms').setValue(true)
		await wrapper.vm.$nextTick()

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
		await wrapper.findComponent('.signup-firstName').setValue('test')
		await wrapper.findComponent('.signup-lastName').setValue('test')
		await wrapper.findComponent('.signup-email').setValue('test@test.test')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.signup-submit').attributes('disabled'),
		).not.toBeUndefined()
	})

	it('should validate the form', async () => {
		await wrapper.findComponent('.signup-firstName').setValue('test')
		await wrapper.findComponent('.signup-lastName').setValue('test')
		await wrapper.findComponent('.signup-email').setValue('test@test.test')
		await wrapper.findComponent('.signup-terms').setValue(true)
		await wrapper.findComponent({ name: 'SignupForm' }).vm.$nextTick()

		expect(
			wrapper.findComponent('.signup-submit').attributes('disabled'),
		).toBeUndefined()
	})
})
