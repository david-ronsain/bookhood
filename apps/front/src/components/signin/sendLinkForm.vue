<script setup lang="ts">
	import { BhTextField, BhPrimaryButton } from '@bookhood/ui'
	import { ref } from 'vue'
	import { useI18n } from 'vue-i18n'
	import { useUserStore, useMainStore } from '../../store'
	import { mdiSendOutline } from '@mdi/js'

	const mainStore = useMainStore()
	const userStore = useUserStore()
	const { t } = useI18n()
	const formValid = ref<boolean>(false)
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

		if (formValid.value) {
			userStore
				.sendSigninLink(email.value)
				.then(() => {
					mainStore.success = 'Le lien vous a été envoyé'
				})
				.catch((err) => {
					mainStore.error = t(
						`signin.sendLink.error${err.response.status}`,
					)
				})
				.finally(() => {
					loading.value = false
				})
		}
	}
</script>

<template>
	<v-form
		ref="form"
		v-model="formValid"
		validate-on="input lazy"
		@submit.prevent="sendSigninLink">
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
					:icon="{ icon: mdiSendOutline, prepend: true }"
					@click.stop="sendSigninLink"
					:disabled="!formValid || loading"
					:loading="formValid && loading"
					:text="$t('signin.sendLink.send')" />
			</v-col>
		</v-row>
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
