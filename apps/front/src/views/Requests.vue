<script setup lang="ts">
	import IncomingRequests from '../components/requests/incomingRequests.vue'
	import OutgoingRequests from '../components/requests/outgoingRequests.vue'
</script>

<template>
	<v-row>
		<v-col
			cols="12"
			md="6">
			<incoming-requests />
		</v-col>
		<v-col
			cols="12"
			md="6">
			<outgoing-requests />
		</v-col>
	</v-row>
</template>
