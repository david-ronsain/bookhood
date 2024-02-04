<script setup lang="ts">
	import {
		BhPrimaryButton,
		BhTextField,
		BhAddressAutocomplete,
		type ISearchingEventProps,
	} from '@bookhood/ui'
	import { isAuthenticated } from '../plugins/authentication'
	import { computed } from 'vue'
	import { useBookStore } from '../store'
	import { ref } from 'vue'
	import { type IBookSearchResult } from '@bookhood/shared'
	import Map from 'ol/Map'
	import { onMounted } from 'vue'
	import Style from 'ol/style/Style.js'
	import Icon from 'ol/style/Icon.js'
	import Fill from 'ol/style/Fill.js'
	import Stroke from 'ol/style/Stroke.js'
	import View from 'ol/View.js'
	import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
	import { OSM, Vector as VectorSource } from 'ol/source.js'
	import Feature from 'ol/Feature.js'
	import Point from 'ol/geom/Point.js'
	import { fromLonLat, toLonLat } from 'ol/proj.js'
	import debounce from 'debounce'
	import {
		mdiAccountTie,
		mdiBookOpenBlankVariantOutline,
		mdiCrosshairsGps,
		mdiMagnify,
	} from '@mdi/js'

	const bookStore = useBookStore()
	const center = ref([0, 0])
	const map = ref<Map>(null)
	const authenticated = computed(() => isAuthenticated(false))
	const boundingBox = ref<number[]>([])
	const books = ref<IBookSearchResult[]>([])
	const nbResults = ref<number>(0)
	const searchAddress = ref<string>('')

	const form = ref<ISearchingEventProps>({
		type: 'intitle',
		text: '',
		page: 0,
	})

	onMounted(() => {
		localize()
	})

	const localize = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(setUserCoords, null, {
				enableHighAccuracy: true,
				timeout: 5000,
			})
		}
	}

	const setUserCoords = (coords: { coords: { longitude; latitude } }) => {
		center.value = [coords.coords.longitude, coords.coords.latitude]

		if (!map.value) {
			initMap()
		} else {
			map.value.getView().setCenter(fromLonLat(center.value))
		}
	}

	const initMap = () => {
		map.value = new Map({
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
			],
			target: document.getElementById('map'),
			view: new View({
				center: fromLonLat(center.value),
				zoom: 15,
			}),
		})

		map.value.on('loadend', () => {
			search()
		})
		map.value.on('moveend', () => {
			search()
		})

		const info = document.getElementById('info')

		let currentFeature
		const displayFeatureInfo = function (pixel, target) {
			const feature = target.closest('.ol-control')
				? undefined
				: map.value.forEachFeatureAtPixel(pixel, function (feature) {
						return feature
					})
			if (feature) {
				info.style.left = pixel[0] + 'px'
				info.style.top = pixel[1] + 'px'
				if (feature !== currentFeature) {
					info.style.visibility = 'visible'
					info.innerText = feature.get('title')
				}
			} else {
				info.style.visibility = 'hidden'
			}
			currentFeature = feature
		}
		map.value.on('pointermove', function (evt) {
			if (evt.dragging) {
				info.style.visibility = 'hidden'
				currentFeature = undefined
				return
			}
			const pixel = map.value.getEventPixel(evt.originalEvent)
			displayFeatureInfo(pixel, evt.originalEvent.target)
		})

		map.value.on('click', function (evt) {
			displayFeatureInfo(evt.pixel, evt.originalEvent.target)
		})

		map.value
			.getTargetElement()
			.addEventListener('pointerleave', function () {
				currentFeature = undefined
				info.style.visibility = 'hidden'
			})
	}

	const reset = () => {
		searchAddress.value = null
		addressValue.value = null
		form.value.page = 0
		nbResults.value = 0
		search()
	}

	const search = debounce(async () => {
		const startAt = form.value.page * 10
		const boundaries = map.value.getView().calculateExtent()

		boundingBox.value = [
			...toLonLat([boundaries[0], boundaries[1]]),
			...toLonLat([boundaries[2], boundaries[3]]),
		]

		if (
			(nbResults.value > 0 && startAt < nbResults.value) ||
			nbResults.value === 0 ||
			form.value.page === 0
		) {
			const results = await bookStore.searchByName(
				form.value,
				startAt,
				boundingBox.value,
			)
			nbResults.value = parseInt(results.data.total)
			books.value = results.data.results.map(
				(book: IBookSearchResult) => ({
					...book,
					value: book._id,
				}),
			)

			setMarkers()
		}
	}, 750)

	const setMarkers = () => {
		const features: Feature[] = books.value.flatMap((book) =>
			book.owner.map((owner) => {
				const feat = new Feature({
					geometry: new Point(
						fromLonLat([owner.coords.lng, owner.coords.lat]),
					),
				})
				feat.setProperties({
					title: book.title,
				})
				feat.setStyle(
					new Style({
						fill: new Fill({ color: 'white' }),
						stroke: new Stroke({
							color: 'black',
							width: 2,
						}),
						zIndex: 9999,
						image: new Icon({
							src: 'http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png',
							scale: 0.25,
						}),
					}),
				)
				return feat
			}),
		)
		map.value.removeLayer(map.value.getAllLayers()[1])
		map.value.addLayer(
			new VectorLayer({
				source: new VectorSource({
					features: features,
				}),
			}),
		)
	}

	const centerUpdated = (point: number[]) => {
		center.value = point
		map.value.getView().setCenter(fromLonLat(center.value))
	}

	const boundingBoxUpdated = (point: number[]) => {
		boundingBox.value = [
			...fromLonLat([point[2], point[0]]),
			...fromLonLat([point[3], point[1]]),
		]
		search()
	}
</script>

<template>
	<v-container fluid>
		<v-row v-if="!authenticated">
			<v-col col="12">
				<div class="d-flex justify-center align-center">
					<bh-primary-button
						:to="{ name: 'signup' }"
						:text="$t('home.signup')" />
				</div>
			</v-col>
		</v-row>
		<v-row>
			<v-col col="12">
				<div
					class="d-flex flex-column flex-md-row mb-4"
					id="search-fields">
					<v-btn-toggle
						class="mr-md-4 mb-4"
						v-model="form.type"
						density="compact"
						variant="outlined"
						mandatory
						@update:modelValue="search">
						<v-btn value="intitle">
							<v-icon>{{
								mdiBookOpenBlankVariantOutline
							}}</v-icon>
						</v-btn>

						<v-btn value="inauthor">
							<v-icon>{{ mdiAccountTie }}</v-icon>
						</v-btn>
					</v-btn-toggle>

					<bh-text-field
						class="mr-md-4 mb-4"
						v-model="form.text"
						:placeholder="$t('common.header.searchbar.label')"
						clear
						:icon="{ icon: mdiMagnify, appendInner: true }"
						variant="outlined"
						density="compact"
						height="36px"
						@click:clear="reset"
						@update:modelValue="search"
						@update:focused="search" />

					<bh-address-autocomplete
						@center:updated="centerUpdated"
						@boundingbox:updated="boundingBoxUpdated" />
				</div>

				<div
					id="map"
					style="height: 400px; width: 100%">
					<div id="info"></div>
					<v-btn
						density="compact"
						:icon="mdiCrosshairsGps"
						location="top right"
						position="absolute"
						size="40"
						style="z-index: 999"
						@click.prevent="localize" />
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<style scoped lang="scss">
	#map {
		position: relative;
	}

	#info {
		position: absolute;
		display: inline-block;
		height: auto;
		width: auto;
		z-index: 100;
		background-color: #333;
		color: #fff;
		text-align: center;
		border-radius: 4px;
		padding: 5px;
		left: 50%;
		transform: translateX(3%);
		visibility: hidden;
		pointer-events: none;
	}
</style>

<style lang="scss">
	#search-fields {
		display: flex;

		.v-text-field,
		.v-text-field > .v-input__control {
			height: 36px;
		}
	}
</style>
