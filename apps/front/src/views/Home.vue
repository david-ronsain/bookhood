<script setup lang="ts">
	import { BhPrimaryButton } from '@bookhood/ui'
	import { watch } from 'vue'
	import { isAuthenticated } from '../plugins/authentication'
	import { useRoute } from 'vue-router'
	import { computed } from 'vue'

	const route = useRoute()

	const authenticated = computed(() => isAuthenticated(false))

	watch(route, () => {
		console.log(route)
	})
</script>

<template>
	<v-container fluid>
		<v-row>
			<v-col col="12">
				<div class="d-flex justify-center align-center">
					<bh-primary-button
						v-if="!authenticated"
						:to="{ name: 'signup' }"
						:text="$t('home.signup')" />
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>
