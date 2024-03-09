<script setup lang="ts">
	import { mdiAccountOutline } from '@mdi/js'
	import { computed, onUnmounted } from 'vue'
	import { onMounted } from 'vue'
	import { useProfileStore } from '../../store'
	import { useRoute } from 'vue-router'

	const route = useRoute()
	const profileStore = useProfileStore()
	const profile = computed(() => profileStore.profile)

	onMounted(() => {
		profileStore.loadProfile(route.params.userId.toString())
	})

	onUnmounted(() => {
		profileStore.$patch({ profile: null })
	})
</script>

<template>
	<v-card
		class="profile-card"
		v-if="profile"
		:prepend-icon="mdiAccountOutline"
		:title="`${profile.firstName} ${profile.lastName.charAt(0)}`">
	</v-card>
</template>
