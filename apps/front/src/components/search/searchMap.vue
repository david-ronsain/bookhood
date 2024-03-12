<script setup lang="ts">
	import { Loader } from '@googlemaps/js-api-loader'
	import { EnvConfig } from '../../../config/env'
	import { onMounted, ref, toRaw } from 'vue'
	import type {
		IBookSearchResult,
		IBookSearchResultOwner,
	} from '@bookhood/shared'

	const loader = new Loader({
		apiKey: EnvConfig.googleApis.maps.key,
		version: 'weekly',
		libraries: ['maps'],
	})
	const center = ref<{ lat: number; lng: number } | null>(null)
	const map = ref<google.maps.Map | null>(null)
	const loading = ref<boolean>(false)
	const listeners = ref<google.maps.MapsEventListener[]>([])
	const markers = ref<google.maps.Marker[]>([])

	const markerPicked = ref<google.maps.Marker | null | undefined>(null)
	const highlightedMarker = ref<google.maps.Marker | null | undefined>(null)

	onMounted(() => {
		localize()
	})

	const localize = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(setMap, null, {
				enableHighAccuracy: true,
				timeout: 5000,
			})
		}
	}

	const setMap = async (coords: { coords: { longitude; latitude } }) => {
		center.value = {
			lat: coords.coords.latitude,
			lng: coords.coords.longitude,
		}

		const { Map } = (await loader.importLibrary(
			'maps',
		)) as google.maps.MapsLibrary

		map.value = new Map(document.getElementById('map') as HTMLElement, {
			center: center.value,
			zoom: 14,
			gestureHandling: 'greedy',
			fullscreenControl: false,
			mapTypeControl: false,
			minZoom: 8,
			streetViewControl: false,
		})

		map.value.addListener('zoom_changed', mapUpdated)
		map.value.addListener('center_changed', mapUpdated)
		map.value.addListener('bounds_changed', () => events('map:ready'))
		events('search')
	}

	const mapUpdated = () => {
		loading.value = true
		events('search')
	}

	const getBoundingBox = (): number[] => {
		return [
			map.value.getBounds().getNorthEast().lng(),
			map.value.getBounds().getNorthEast().lat(),
			map.value.getBounds().getSouthWest().lng(),
			map.value.getBounds().getSouthWest().lat(),
		]
	}

	const setMarkers = async (books: IBookSearchResult[]) => {
		const { Marker } = (await loader.importLibrary(
			'marker',
		)) as google.maps.MarkerLibrary
		removeMarkers()

		books.forEach((book: IBookSearchResult) =>
			book.owner.forEach((owner: IBookSearchResultOwner) => {
				const marker = new Marker({
					map: map.value,
					position: owner.coords,
					zIndex: 9998,
					icon:
						markerPicked.value?.['book']?._id === book._id
							? EnvConfig.googleApis.maps.blueIcon
							: EnvConfig.googleApis.maps.redIcon,
				})
				marker['book'] = { ...book, libraryId: owner._id }
				listeners.value.push(
					google.maps.event.addListener(marker, 'mouseover', () => {
						highlightMarker(marker['book'])
					}),
				)
				listeners.value.push(
					google.maps.event.addListener(marker, 'mouseout', () => {
						unhighlightMarker(marker)
					}),
				)
				listeners.value.push(
					google.maps.event.addListener(marker, 'click', () => {
						pickMarker(marker['book'])
					}),
				)
				markers.value.push(marker)
			}),
		)
	}

	const highlightMarker = (book: IBookSearchResult, highlight = true) => {
		const marker = markers.value.find(
			(marker) => marker['book']._id === book._id,
		)
		marker?.setIcon(EnvConfig.googleApis.maps.blueIcon)
		if (marker) {
			marker['highlighted'] = highlight
		}
		marker?.setZIndex(9999)
		highlightedMarker.value = marker
	}

	const unhighlightMarkers = () => {
		markers.value.forEach((marker) => {
			unhighlightMarker(marker)
		})
	}

	const unhighlightMarker = (marker) => {
		if (markerPicked.value?.['book']?._id !== marker.book._id) {
			marker.setZIndex(9998)
			marker.setIcon(EnvConfig.googleApis.maps.redIcon)
		}
		highlightedMarker.value = null
	}

	const pickMarker = (book: IBookSearchResult) => {
		const marker = markers.value.find(
			(marker) => marker['book']._id === book._id,
		)
		markerPicked.value = marker
		events('book:picked', [markerPicked.value?.['book']._id])
		unhighlightMarkers()
		highlightMarker(book, false)
	}

	const removeMarkers = () => {
		listeners.value.forEach((listener) =>
			google.maps.event.removeListener(listener),
		)
		markers.value.forEach((marker) => toRaw(marker).setMap(null))
		markerPicked.value = null
		events('book:picked', [])
		markers.value = []
		highlightedMarker.value = null
	}

	const setCenter = ({ lat, lng }): void => {
		map.value.setCenter({ lat, lng })
	}

	const events = defineEmits(['search', 'book:picked', 'map:ready'])

	defineExpose({
		getBoundingBox,
		setMarkers,
		removeMarkers,
		highlightMarker,
		unhighlightMarker,
		unhighlightMarkers,
		pickMarker,
		markerPicked,
		highlightedMarker,
		setCenter,
	})
</script>

<template>
	<div
		id="map"
		style="height: 500px"></div>
</template>

<style scoped lang="scss">
	#map {
		position: relative;
		width: 100%;
	}
</style>
