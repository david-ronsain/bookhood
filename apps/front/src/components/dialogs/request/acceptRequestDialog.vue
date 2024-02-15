<script setup lang="ts">
	import { BhPrimaryButton, BhDialog } from '@bookhood/ui'
	import { ref } from 'vue'
	import { useRequestStore, useMainStore } from '../../../store'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n({})
	const requestStore = useRequestStore()
	const mainStore = useMainStore()
	const acceptDialog = ref<BhDialog>(null)
	const loading = ref<boolean>(false)
	const disabled = ref<boolean>(false)
	const request = ref<string>('')

	const accept = (): void => {
		requestStore
			.accept(request.value)
			.then(() => {
				close()
				loading.value = false
				mainStore.success = t('request.acceptDialog.success')
				requestStore.getPending()
			})
			.catch((err) => {
				mainStore.error = err.response.data.message
				loading.value = false
				disabled.value = false
			})
	}

	const open = (requestId: string): void => {
		acceptDialog.value.open()
		request.value = requestId
	}

	const close = (): void => {
		acceptDialog.value.close()
		request.value = ''
	}

	defineExpose({
		open,
	})
</script>

<template>
	<bh-dialog
		ref="acceptDialog"
		:title="$t('request.acceptDialog.title')">
		<template v-slot:default>
			{{ $t('request.acceptDialog.text') }}
		</template>
		<template v-slot:actions>
			<bh-primary-button
				:text="$t('common.no')"
				no-background
				@click="close" />
			<bh-primary-button
				:text="$t('common.yes')"
				@click="accept"
				:disabled="disabled"
				:loading="loading" />
		</template>
	</bh-dialog>
</template>
