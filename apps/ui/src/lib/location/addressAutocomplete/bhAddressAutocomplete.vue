<script setup lang="ts">
	import { ref } from 'vue'
	import debounce from 'debounce'
	import axios from 'axios'
	import { EnvConfig } from '../../../../config/env'

	interface Address {
		value: string
		title: string
		boundingBox: number[]
		lon: number
		lat: number
		city?: string
		department?: string
		region?: string
	}

	const props = defineProps<{ placeholder?: string }>()

	const addressValue = ref()
	const addresses = ref([])
	const searchAddress = ref<string>('')
	const addressesLoading = ref<boolean>(false)
	const lastSearch = ref<string>('')

	const chooseAddress = (obj: Address) => {
		if (obj?.boundingBox) {
			events('center:updated', [obj.lon, obj.lat])
		}
		events('place:updated', obj.city ?? obj.department ?? obj.region)
	}

	const loadAddresses = (text?: string) => {
		if (text !== searchAddress.value) {
			if (!text) {
				text = searchAddress.value
			} else {
				searchAddress.value = text
			}
		}

		if (searchAddress.value.length) debounceLoadAddresses()
	}

	const debounceLoadAddresses = debounce(() => {
		if (
			searchAddress.value.length &&
			searchAddress.value !== lastSearch.value
		) {
			lastSearch.value = searchAddress.value
			addressesLoading.value = true
			axios
				.post(
					EnvConfig.googleApis.places.url,
					{
						textQuery: searchAddress.value,
					},
					{
						headers: {
							'X-Goog-Api-Key': EnvConfig.googleApis.key,
							'X-Goog-FieldMask':
								'places.formattedAddress,places.id,places.viewport,places.location,places.addressComponents',
						},
					},
				)
				.then((response) => {
					addresses.value = response.data.places.map((address) => ({
						value: address.id,
						title: address.formattedAddress,
						boundingBox: [
							address.viewport.low.longitude,
							address.viewport.low.latitude,
							address.viewport.high.longitude,
							address.viewport.high.latitude,
						],
						lat: address.location.latitude,
						lon: address.location.longitude,
						city: address.addressComponents.find((component) =>
							component.types.includes('locality'),
						)?.longText,
						department: address.addressComponents.find(
							(component) =>
								component.types.includes(
									'administrative_area_level_2',
								),
						)?.longText,
						region: address.addressComponents.find((component) =>
							component.types.includes(
								'administrative_area_level_1',
							),
						)?.longText,
					}))
					addressesLoading.value = false
				})
				.catch(() => {
					addressesLoading.value = false
				})
		}
	}, 500)

	const reset = () => {
		searchAddress.value = ''
		addresses.value = []
	}

	const events = defineEmits<{
		(e: 'boundingbox:updated', boundingBox: number[]): void
		(e: 'center:updated', center: number[]): void
		(e: 'place:updated', place: string | undefined): void
	}>()
</script>

<template>
	<v-autocomplete
		class="mb-4"
		clearable
		hideDetails
		no-filter
		density="compact"
		:modelValue="addressValue"
		:items="addresses"
		:placeholder="props.placeholder"
		:loading="addressesLoading"
		:search="searchAddress"
		variant="outlined"
		@update:modelValue="chooseAddress"
		@update:search="loadAddresses"
		@click:clear="reset"
		returnObject />
</template>

<style scoped></style>
