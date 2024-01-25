<script setup lang="ts">
	import BhHeader from '../components/layout/BhHeader.vue'
</script>

<template>
	<v-app>
		<BhHeader />
		<router-view id="main-content" />
	</v-app>
</template>

<style lang="scss" scoped>
	@import 'vuetify/lib/styles/settings/_variables';
	#main-content {
		position: relative;
		top: 74px;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	@media #{map-get($display-breakpoints, 'md-and-up')} {
		#main-content {
			width: calc(100% - 48px);
		}
	}
</style>
