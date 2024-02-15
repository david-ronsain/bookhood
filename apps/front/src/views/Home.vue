<script setup lang="ts">
	import Search from '../components/search/search.vue'
	import { BhPrimaryButton } from '@bookhood/ui'
	import { useMainStore } from '../store'
	import { computed } from 'vue'

	const mainStore = useMainStore()

	const profile = computed(() => mainStore.profile)
</script>

<template>
	<v-container fluid>
		<v-row v-if="!profile">
			<v-col col="12">
				<div class="d-flex justify-space-around align-center">
					<bh-primary-button
						:to="{ name: 'signup' }"
						:text="$t('home.signup')" />
					<bh-primary-button
						:to="{ name: 'signin' }"
						:text="$t('home.signin')" />
				</div>
			</v-col>
		</v-row>
		<search></search>
	</v-container>
</template>
