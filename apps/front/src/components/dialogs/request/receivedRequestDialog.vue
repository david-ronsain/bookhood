<script setup lang="ts">
	import { BhPrimaryButton, BhDialog } from '@bookhood/ui'
	import { ref } from 'vue'
	import { useRequestStore, useMainStore } from '../../../store'
	import { useI18n } from 'vue-i18n'
	import { computed } from 'vue'

	const { t } = useI18n({})
	const requestStore = useRequestStore()
	const mainStore = useMainStore()
	const receivedDialog = ref<BhDialog>(null)
	const loading = ref<boolean>(false)
	const disabled = ref<boolean>(false)
	const request = ref<string>('')

	const profile = computed(() => mainStore.profile)

	const received = (): void => {
		requestStore
			.received(request.value)
			.then(() => {
				close()
				loading.value = false
				mainStore.success = t('request.receivedDialog.success')
				requestStore.getOutgoingRequests({ userId: profile.value?._id })
			})
			.catch((err) => {
				mainStore.error = err.response.data.message
				loading.value = false
				disabled.value = false
			})
	}

	const open = (requestId: string): void => {
		receivedDialog.value.open()
		request.value = requestId
	}

	const close = (): void => {
		receivedDialog.value.close()
		request.value = ''
	}

	defineExpose({
		open,
	})
</script>

<template>
	<bh-dialog
		ref="receivedDialog"
		:title="$t('request.receivedDialog.title')">
		<template v-slot:default>
			{{ $t('request.receivedDialog.text') }}
		</template>
		<template v-slot:actions>
			<bh-primary-button
				:text="$t('common.no')"
				no-background
				@click="close" />
			<bh-primary-button
				:text="$t('common.yes')"
				@click="received"
				:disabled="disabled"
				:loading="loading" />
		</template>
	</bh-dialog>
</template>
