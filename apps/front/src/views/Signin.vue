<script setup lang="ts">
	import SendLinkForm from '../components/signin/sendLinkForm.vue'
	import { useRoute } from 'vue-router'

	const route = useRoute()
</script>

<template>
	<v-row>
		<v-col
			class="ma-auto"
			cols="12"
			md="6"
			order-md="1"
			order="2">
			<send-link-form v-if="!route.params.token" />
		</v-col>
		<v-col
			cols="12"
			md="6"
			order-md="2"
			order="1">
		</v-col>
	</v-row>
</template>
