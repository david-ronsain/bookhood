<script setup lang="ts">
	import { BhPrimaryButton, BhDialog } from '@bookhood/ui'
	import { ref } from 'vue'
	import { useRequestStore, useMainStore } from '../../../store'
	import { useI18n } from 'vue-i18n'
	import { computed } from 'vue'

	const { t } = useI18n({})
	const requestStore = useRequestStore()
	const mainStore = useMainStore()
	const refuseReturnDialog = ref<BhDialog>(null)
	const loading = ref<boolean>(false)
	const disabled = ref<boolean>(false)
	const request = ref<string>('')

	const profile = computed(() => mainStore.profile)

	const refuse = (): void => {
		requestStore
			.refuseReturn(request.value)
			.then(() => {
				close()
				loading.value = false
				mainStore.success = t('request.refuseReturnDialog.success')
				requestStore.getIncomingRequests({
					ownerId: profile.value?._id,
				})
			})
			.catch((err) => {
				mainStore.error = err.response.data.message
				loading.value = false
				disabled.value = false
			})
	}

	const open = (requestId: string): void => {
		refuseReturnDialog.value.open()
		request.value = requestId
	}

	const close = (): void => {
		refuseReturnDialog.value.close()
		request.value = ''
	}

	defineExpose({
		open,
	})
</script>

<template>
	<bh-dialog
		ref="refuseReturnDialog"
		:title="$t('request.refuseReturnDialog.title')">
		<template v-slot:default>
			{{ $t('request.refuseReturnDialog.text') }}
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
