<script setup lang="ts">
	import { useRouter } from 'vue-router'
	import { BhDialog, BhPrimaryButton } from '@bookhood/ui'
	import { ref } from 'vue'
	import { EnvConfig } from '../../../../config/env'

	const router = useRouter()
	const logoutDialog = ref<boolean>(false)

	const logout = () => {
		localStorage.removeItem(EnvConfig.localStorage.userKey)
		logoutDialog.value = false
		router.push({
			name: 'logout',
		})
	}

	const open = () => {
		logoutDialog.value = true
	}

	defineExpose({
		open,
	})
</script>

<template>
	<bh-dialog
		:opened="logoutDialog"
		:title="$t('logout.dialog.title')">
		<template v-slot>{{ $t('logout.dialog.text') }}</template>

		<template v-slot:actions>
			<bh-primary-button
				class="cancel-logout"
				:text="$t('logout.dialog.cancel')"
				no-background
				@click.prevent="logoutDialog = false" />

			<bh-primary-button
				class="confirm-logout"
				:text="$t('logout.dialog.confirm')"
				@click.prevent="logout" />
		</template>
	</bh-dialog>
</template>
