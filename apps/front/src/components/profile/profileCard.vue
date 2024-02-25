<script setup lang="ts">
	import { mdiAccountOutline } from '@mdi/js'
	import { ref } from 'vue'
	import { type IExternalProfile } from '@bookhood/shared'
	import { onMounted } from 'vue'
	import { useProfileStore } from '../../store'
	import { useRoute } from 'vue-router'

	const route = useRoute()
	const profileStore = useProfileStore()
	const profile = ref<IExternalProfile>(null)

	onMounted(() => {
		profileStore.loadProfile(route.params.userId.toString()).then((res) => {
			profile.value = res.data
		})
	})
</script>

<template>
	<v-card
		v-if="profile"
		:prepend-icon="mdiAccountOutline"
		:title="`${profile.firstName} ${profile.lastName.charAt(0)}`">
	</v-card>
</template>
