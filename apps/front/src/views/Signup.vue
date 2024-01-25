<script setup lang="ts">
	import SignupForm from '../components/signup/signupForm.vue'
</script>

<template>
	<v-row>
		<v-col
			class="ma-auto"
			cols="12"
			md="6"
			order-md="1"
			order="2">
			<signup-form />
		</v-col>
		<v-col
			cols="12"
			md="6"
			order-md="2"
			order="1">
		</v-col>
	</v-row>
</template>
