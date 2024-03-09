<script setup lang="ts">
	import { BhPrimaryButton, BhDialog } from '@bookhood/ui'
	import { ref } from 'vue'
	import { useRequestStore, useMainStore } from '../../../store'
	import { useI18n } from 'vue-i18n'
	import { computed } from 'vue'

	const { t } = useI18n({})
	const requestStore = useRequestStore()
	const mainStore = useMainStore()
	const returnedDialog = ref<BhDialog>(null)
	const loading = ref<boolean>(false)
	const request = ref<string>('')

	const profile = computed(() => mainStore.profile)
	const disabled = computed(
		() => request.value.toString().length === 0 || loading.value,
	)

	const accept = (): void => {
		loading.value = true

		requestStore
			.returned(request.value)
			.then(() => {
				close()
				mainStore.success = t('request.returnedDialog.success')
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
		if ('open' in returnedDialog.value) returnedDialog.value.open()
		request.value = requestId
	}

	const close = (): void => {
		if ('close' in returnedDialog.value) returnedDialog.value.close()
		request.value = ''
	}

	defineExpose({
		open,
	})
</script>

<template>
	<bh-dialog
		ref="returnedDialog"
		:title="$t('request.returnedDialog.title')">
		<template v-slot:default>
			{{ $t('request.returnedDialog.text') }}
		</template>
		<template v-slot:actions>
			<bh-primary-button
				class="cancel-returned"
				:text="$t('common.no')"
				no-background
				@click="close" />
			<bh-primary-button
				class="confirm-returned"
				:text="$t('common.yes')"
				@click="accept"
				:disabled="disabled"
				:loading="loading" />
		</template>
	</bh-dialog>
</template>
