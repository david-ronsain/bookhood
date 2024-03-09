<script setup lang="ts">
	import { BhPrimaryButton, BhDialog } from '@bookhood/ui'
	import { ref } from 'vue'
	import { useRequestStore, useMainStore } from '../../../store'
	import { useI18n } from 'vue-i18n'
	import { computed } from 'vue'

	const { t } = useI18n({})
	const requestStore = useRequestStore()
	const mainStore = useMainStore()
	const acceptReturnDialog = ref<BhDialog>(null)
	const loading = ref<boolean>(false)
	const request = ref<string>('')

	const profile = computed(() => mainStore.profile)
	const disabled = computed(
		() => loading.value || request.value.toString().length === 0,
	)

	const accept = (): void => {
		loading.value = true

		requestStore
			.acceptReturn(request.value)
			.then(() => {
				close()
				loading.value = false
				mainStore.success = t('request.acceptReturnDialog.success')
				requestStore.getIncomingRequests({
					ownerId: profile.value?._id,
				})
			})
			.catch((err) => {
				mainStore.error = err.response.data.message
				loading.value = false
			})
	}

	const open = (requestId: string): void => {
		if ('open' in acceptReturnDialog.value) acceptReturnDialog.value.open()
		request.value = requestId
	}

	const close = (): void => {
		if ('close' in acceptReturnDialog.value)
			acceptReturnDialog.value.close()
		request.value = ''
	}

	defineExpose({
		open,
	})
</script>

<template>
	<bh-dialog
		ref="acceptReturnDialog"
		:title="$t('request.acceptReturnDialog.title')">
		<template v-slot:default>
			{{ $t('request.acceptReturnDialog.text') }}
		</template>
		<template v-slot:actions>
			<bh-primary-button
				class="refuse-return"
				:text="$t('common.no')"
				no-background
				@click="close" />
			<bh-primary-button
				class="accept-return"
				:text="$t('common.yes')"
				@click="accept"
				:disabled="disabled"
				:loading="loading" />
		</template>
	</bh-dialog>
</template>
