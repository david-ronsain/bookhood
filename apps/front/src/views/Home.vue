<script setup lang="ts">
	import { BhPrimaryButton } from '@bookhood/ui'
	import { useRoute } from 'vue-router'

	const route = useRoute()
</script>

<template>
	<v-container fluid>
		<v-row>
			<v-col col="12">
				<div class="d-flex justify-center align-center">
					<bh-primary-button
						v-if="!route.meta.authenticated"
						:to="{ name: 'signup' }"
						:text="$t('home.signup')" />
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>
