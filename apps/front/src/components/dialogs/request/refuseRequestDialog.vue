<script setup lang="ts">
	import { BhPrimaryButton, BhDialog } from '@bookhood/ui'
	import { ref } from 'vue'
	import { useRequestStore, useMainStore } from '../../../store'
	import { useI18n } from 'vue-i18n'
	import { computed } from 'vue'

	const { t } = useI18n({})
	const requestStore = useRequestStore()
	const mainStore = useMainStore()
	const refuseDialog = ref<BhDialog>(null)
	const loading = ref<boolean>(false)
	const request = ref<string>('')

	const profile = computed(() => mainStore.profile)
	const disabled = computed(
		() => request.value.toString().length === 0 || loading.value,
	)

	const refuse = (): void => {
		loading.value = true

		requestStore
			.refuse(request.value)
			.then(() => {
				close()
				mainStore.success = t('request.refuseDialog.success')
				requestStore.getIncomingRequests({
					ownerId: profile.value?._id,
				})
			})
			.catch((err) => {
				mainStore.error = err.response.data.message
			})
			.finally(() => {
				loading.value = false
			})
	}

	const open = (requestId: string): void => {
		if ('open' in refuseDialog.value) refuseDialog.value.open()
		request.value = requestId
	}

	const close = (): void => {
		if ('close' in refuseDialog.value) refuseDialog.value.close()
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
				class="cancel-refuse"
				:text="$t('common.no')"
				no-background
				@click="close" />
			<bh-primary-button
				class="confirm-refuse"
				:text="$t('common.yes')"
				@click="refuse"
				:disabled="disabled"
				:loading="loading" />
		</template>
	</bh-dialog>
</template>
