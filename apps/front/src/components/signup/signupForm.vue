<script setup lang="ts">
	import { BhTextField, BhPrimaryButton, BhCheckBox } from '@bookhood/ui'
	import { ref } from 'vue'
	import { type CreateUserDTO } from '@bookhood/shared'
	import { useI18n } from 'vue-i18n'
	import { useUserStore, useMainStore } from '../../store'
	import { useRouter } from 'vue-router'

	const mainStore = useMainStore()
	const router = useRouter()
	const userStore = useUserStore()
	const { t } = useI18n()
	const formValid = ref<boolean>(false)
	const disabled = ref<boolean>(false)
	const data = ref<CreateUserDTO>({
		firstName: '',
		lastName: '',
		email: '',
		checked: false,
	})
	const loading = ref<boolean>(false)
	const firstNameRules = ref([
		(v) => !!v || t('signup.form.validation.firstName_required'),
	])
	const lastNameRules = ref([
		(v) => !!v || t('signup.form.validation.lastName_required'),
	])
	const emailRules = ref([
		(v) => !!v || t('signup.form.validation.email_required'),
		(v) =>
			/^[\w-.+]+@([\w-]+\.)+[\w-]{2,}$/.test(v.trim()) ||
			t('signup.form.validation.email_regex'),
	])
	const termRules = ref([
		(v) => !!v || t('signup.form.validation.terms_required'),
	])

	async function signup() {
		loading.value = true
		disabled.value = true
		userStore
			.signup(data.value)
			.then(() => {
				router.push({ name: 'home' })
			})
			.catch((err) => {
				mainStore.error = err.message
				loading.value = false
				disabled.value = false
			})
	}
</script>

<template>
	<v-form
		class="signup-form"
		v-model="formValid"
		validate-on="input lazy">
		<v-row>
			<v-col
				cols="12"
				md="6">
				<bh-text-field
					class="signup-firstName"
					v-model.trim="data.firstName"
					autofocus
					:label="$t('signup.form.firstName.label')"
					:placeholder="$t('signup.form.firstName.placeholder')"
					:rules="firstNameRules"
					name="firstName" />
			</v-col>
			<v-col
				cols="12"
				md="6">
				<bh-text-field
					class="signup-lastName"
					v-model.trim="data.lastName"
					:label="$t('signup.form.lastName.label')"
					:placeholder="$t('signup.form.lastName.placeholder')"
					:rules="lastNameRules"
					name="lastName" />
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<bh-text-field
					class="signup-email"
					v-model.trim="data.email"
					:label="$t('signup.form.email.label')"
					:placeholder="$t('signup.form.email.placeholder')"
					:rules="emailRules"
					name="email" />
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12">
				<bh-check-box
					class="signup-terms"
					v-model="data.checked"
					:label="$t('signup.form.terms_read')"
					:rules="termRules" />
			</v-col>
		</v-row>

		<v-row>
			<v-col
				class="text-center"
				cols="12">
				<bh-primary-button
					class="signup-submit"
					@click.stop="signup"
					:disabled="!formValid || loading || disabled"
					:loading="formValid && loading"
					:text="$t('signup.form.signup')" />
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
