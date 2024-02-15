<script setup lang="ts">
	import { BhPrimaryButton, BhDialog } from '@bookhood/ui'
	import { ref } from 'vue'
	import { useRequestStore, useMainStore } from '../../../store'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n({})
	const requestStore = useRequestStore()
	const mainStore = useMainStore()
	const refuseDialog = ref<BhDialog>(null)
	const loading = ref<boolean>(false)
	const disabled = ref<boolean>(false)
	const request = ref<string>('')

	const refuse = (): void => {
		requestStore
			.refuse(request.value)
			.then(() => {
				close()
				loading.value = false
				mainStore.success = t('request.refuseDialog.success')
				requestStore.getPending()
			})
			.catch((err) => {
				mainStore.error = err.response.data.message
				loading.value = false
				disabled.value = false
			})
	}

	const open = (requestId: string): void => {
		refuseDialog.value.open()
		request.value = requestId
	}

	const close = (): void => {
		refuseDialog.value.close()
		request.value = ''
	}

	defineExpose({
		open,
	})
</script>

<template>
	<bh-dialog
		ref="refuseDialog"
		:title="$t('request.refuseDialog.title')">
		<template v-slot:default>
			{{ $t('request.refuseDialog.text') }}
		</template>
		<template v-slot:actions>
			<bh-primary-button
				:text="$t('common.no')"
				no-background
				@click="close" />
			<bh-primary-button
				:text="$t('common.yes')"
				@click="refuse"
				:disabled="disabled"
				:loading="loading" />
		</template>
	</bh-dialog>
</template>
