<script setup lang="ts">
	import {
		BhTextField,
		BhAddressAutocomplete,
		type ISearchingEventProps,
	} from '@bookhood/ui'
	import {
		mdiAccountTie,
		mdiBookOpenBlankVariantOutline,
		mdiMagnify,
	} from '@mdi/js'

	import { ref } from 'vue'

	const form = ref<ISearchingEventProps>({
		type: 'intitle',
		text: '',
		page: 0,
	})

	const resetPage = (): void => {
		form.value.page = 0
	}

	const events = defineEmits(['search', 'reset', 'center:changed'])

	defineExpose({
		form,
		resetPage,
	})
</script>

<template>
	<div
		class="d-flex flex-column flex-md-row"
		id="search-fields">
		<v-btn-toggle
			class="mr-md-4 mb-4 mb-md-0"
			v-model="form.type"
			density="compact"
			variant="outlined"
			mandatory
			@update:modelValue="events('search')">
			<v-btn value="intitle">
				<v-icon>{{ mdiBookOpenBlankVariantOutline }}</v-icon>
			</v-btn>

			<v-btn value="inauthor">
				<v-icon>{{ mdiAccountTie }}</v-icon>
			</v-btn>
		</v-btn-toggle>

		<bh-text-field
			class="mr-md-4 mb-4 mb-md-0"
			v-model="form.text"
			:placeholder="$t('search.label')"
			clear
			:icon="{ icon: mdiMagnify, appendInner: true }"
			variant="outlined"
			density="compact"
			height="36px"
			@click:clear="events('reset')"
			@update:modelValue="events('search')"
			@update:focused="events('search')" />

		<bh-address-autocomplete
			class="mb-md-0"
			:placeholder="$t('search.place')"
			@center:updated="(center) => events('center:changed', center)" />
	</div>
</template>

<style lang="scss">
	#search-fields {
		display: flex;

		.v-text-field,
		.v-text-field > .v-input__control {
			height: 36px;
		}
	}

	@media screen and (min-width: 960px) {
		#search-fields > div {
			max-width: 400px;
		}
	}
</style>
