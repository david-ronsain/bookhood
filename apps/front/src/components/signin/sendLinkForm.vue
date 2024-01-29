<script setup lang="ts">
	import {
		BhTextField,
		BhPrimaryButton,
		BhSnackbarError,
		BhSnackbarSuccess,
	} from '@bookhood/ui'
	import { ref } from 'vue'
	import { useI18n } from 'vue-i18n'
	import { useUserStore } from '../../store'
	import { mdiSendOutline } from '@mdi/js'

	const userStore = useUserStore()
	const { t } = useI18n()
	const formValid = ref<boolean>(false)
	const disabled = ref<boolean>(false)
	const error = ref<string>('')
	const snackError = ref(null)
	const snackSuccess = ref(null)
	const form = ref(null)
	const email = ref<string>('')
	const loading = ref<boolean>(false)
	const emailRules = ref([
		(v) => !!v || t('signin.sendLink.email.email_required'),
		(v) =>
			/^[\w-.+]+@([\w-]+\.)+[\w-]{2,}$/.test(v.trim()) ||
			t('signin.sendLink.email.email_regex'),
	])

	async function sendSigninLink() {
		loading.value = true
		disabled.value = true
		userStore
			.sendSigninLink(email.value)
			.then(() => {
				loading.value = false
				snackSuccess.value?.open()
			})
			.catch((err) => {
				error.value = err.message
				loading.value = false
				snackError.value?.open()
			})
	}
</script>

<template>
	<v-form
		ref="form"
		v-model="formValid"
		validate-on="input lazy">
		<v-row>
			<v-col cols="12">
				<h1
					class="mb-4"
					v-text="$t('signin.sendLink.explanation')" />

				<bh-text-field
					v-model.trim="email"
					:label="$t('signin.sendLink.email.label')"
					:placeholder="$t('signin.sendLink.email.placeholder')"
					:rules="emailRules"
					name="email" />
			</v-col>
		</v-row>

		<v-row>
			<v-col
				class="text-center"
				cols="12">
				<bh-primary-button
					ref="submit"
					:icon="mdiSendOutline"
					@click.stop="sendSigninLink"
					:disabled="!formValid || loading || disabled"
					:loading="formValid && loading"
					:text="$t('signin.sendLink.send')" />
			</v-col>
		</v-row>
		<bh-snackbar-error
			:attach="form"
			ref="snackError"
			:text="$t('signin.sendLink.error')"
			@close="disabled = false" />
		<bh-snackbar-success
			:attach="form"
			ref="snackSuccess"
			:text="$t('signin.sendLink.success')"
			@close="disabled = false" />
	</v-form>
</template>

<style lang="scss" scoped>
	@import 'vuetify/lib/styles/settings/_colors';
	@import 'vuetify/lib/styles/settings/_variables';

	@media #{map-get($display-breakpoints, 'md-and-up')} {
		.v-form {
			padding: 0 16px;
			border-right: 1px solid map-get($grey, 'lighten-2');
		}
	}
</style>
