<script setup lang="ts">
	import { BhPrimaryButton, BhDialog } from '@bookhood/ui'
	import { ref } from 'vue'
	import { useRequestStore, useMainStore } from '../../../store'
	import { useI18n } from 'vue-i18n'
	import { computed } from 'vue'

	const { t } = useI18n({})
	const requestStore = useRequestStore()
	const mainStore = useMainStore()
	const neverReceivedDialog = ref<BhDialog>(null)
	const loading = ref<boolean>(false)
	const request = ref<string>('')

	const profile = computed(() => mainStore.profile)
	const disabled = computed(
		() => request.value?.toString().length === 0 || loading.value,
	)

	const accept = (): void => {
		loading.value = true

		requestStore
			.neverReceived(request.value)
			.then(() => {
				close()
				mainStore.success = t('request.neverReceivedDialog.success')
				requestStore.getOutgoingRequests({ userId: profile.value?._id })
			})
			.catch((err) => {
				mainStore.error = err.response.data.message
			})
			.finally(() => {
				loading.value = false
			})
	}

	const open = (requestId: string): void => {
		if ('open' in neverReceivedDialog.value)
			neverReceivedDialog.value.open()
		request.value = requestId
	}

	const close = (): void => {
		if ('close' in neverReceivedDialog.value)
			neverReceivedDialog.value.close()
		request.value = ''
	}

	defineExpose({
		open,
	})
</script>

<template>
	<bh-dialog
		ref="neverReceivedDialog"
		:title="$t('request.neverReceivedDialog.title')">
		<template v-slot:default>
			{{ $t('request.neverReceivedDialog.text') }}
		</template>
		<template v-slot:actions>
			<bh-primary-button
				class="cancel-never-received"
				:text="$t('common.no')"
				no-background
				@click="close" />
			<bh-primary-button
				class="never-received"
				:text="$t('common.yes')"
				@click="accept"
				:disabled="disabled"
				:loading="loading" />
		</template>
	</bh-dialog>
</template>
