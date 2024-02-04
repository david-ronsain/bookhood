<script setup lang="ts">
	import { ref } from 'vue'
	import debounce from 'debounce'
	import axios from 'axios'

	interface Address {
		value: string
		title: string
		boundingBox: number[]
		lon: number
		lat: number
	}

	const addressValue = ref()
	const addresses = ref([])
	const searchAddress = ref<string>('')
	const addressesLoading = ref<boolean>(false)
	const lastSearch = ref<string>('')

	const chooseAddress = (obj: Address) => {
		if (obj?.boundingBox) {
			events('boundingbox:updated', obj.boundingBox)
			events('center:updated', [obj.lon, obj.lat])
		}
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
				.get('https://nominatim.openstreetmap.org/search', {
					params: {
						format: 'jsonv2',
						q: searchAddress.value,
						addressdetails: 1,
					},
				})
				.then((response) => {
					addresses.value = response.data.map((address) => ({
						value: address.place_id,
						title: `${address.address.road ? address.address.road + ', ' : ''}${address.address.postcode ? address.address.postcode + ' ' + (address.address.town ?? address.address.village ?? address.address.suburb) + ', ' : ''}${address.address.country}`,
						boundingBox: address.boundingbox,
						lat: address.lat,
						lon: address.lon,
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
		placeholder=""
		:loading="addressesLoading"
		:search="searchAddress"
		variant="outlined"
		@update:modelValue="chooseAddress"
		@update:search="loadAddresses"
		@click:clear="reset"
		returnObject />
</template>

<style scoped></style>
