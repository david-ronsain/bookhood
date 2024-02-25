<script setup lang="ts">
	import ProfileCard from '../components/profile/profileCard.vue'
	import ProfileBooks from '../components/profile/profileBooks.vue'
</script>

<template>
	<v-container
		fluid
		id="profile">
		<v-row>
			<v-col
				cols="12"
				md="4">
				<profile-card />
			</v-col>
			<v-col
				cols="12"
				md="8">
				<profile-books />
			</v-col>
		</v-row>
	</v-container>
</template>
