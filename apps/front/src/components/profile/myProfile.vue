<script setup lang="ts">
	import { BhCard } from '@bookhood/ui'
	import { type IUser } from '@bookhood/shared'
	import { computed, onMounted, onUnmounted } from 'vue'
	import { useProfileStore } from '../../store'
	import {
		mdiBookArrowLeftOutline,
		mdiBookArrowRightOutline,
		mdiBookOutline,
		mdiGiftOutline,
		mdiMapMarkerOutline,
		mdiTimerSand,
	} from '@mdi/js'

	interface Props {
		profile: IUser
	}

	const profileStore = useProfileStore()
	const props = defineProps<Props>()

	const stats = computed(() => profileStore.stats)

	onMounted(() => {
		if (props.profile) {
			profileStore.loadProfileStats()
		}
	})

	onUnmounted(() => {
		profileStore.$patch({ stats: null })
	})
</script>

<template>
	<bh-card
		class="profile-stats"
		v-if="stats"
		:hover="false"
		border
		flat
		:title="profile.firstName + ' ' + profile.lastName">
		<template v-slot:text>
			<v-container>
				<v-row>
					<v-col
						cols="12"
						md="6">
						<v-icon
							size="20"
							color="primary"
							>{{ mdiBookOutline }}</v-icon
						>{{
							$t(
								'account.myProfile.nbBooks',
								{
									nb: stats.nbBooks,
								},
								stats.nbBooks,
							)
						}}
					</v-col>
					<v-col
						cols="12"
						md="6">
						<v-icon
							size="20"
							color="primary"
							>{{ mdiMapMarkerOutline }}</v-icon
						>{{
							$t(
								'account.myProfile.nbPlaces',
								{
									nb: stats.nbPlaces,
								},
								stats.nbPlaces,
							)
						}}
					</v-col>
				</v-row>
				<v-row>
					<v-col
						cols="12"
						md="6">
						<v-icon
							size="20"
							color="primary"
							>{{ mdiGiftOutline }}</v-icon
						>{{
							$t(
								'account.myProfile.nbBooksToGive',
								{
									nb: stats.nbBooksToGive,
								},
								stats.nbBooksToGive,
							)
						}}
					</v-col>
					<v-col
						cols="12"
						md="6">
						<v-icon
							size="20"
							color="primary"
							>{{ mdiTimerSand }}</v-icon
						>{{
							$t(
								'account.myProfile.nbBooksToLend',
								{
									nb: stats.nbBooksToLend,
								},
								stats.nbBooksToLend,
							)
						}}
					</v-col>
				</v-row>
				<v-row>
					<v-col
						cols="12"
						md="6">
						<v-icon
							size="20"
							color="primary"
							>{{ mdiBookArrowLeftOutline }}</v-icon
						>{{
							$t(
								'account.myProfile.nbIncomingRequests',
								{
									nb: stats.nbIncomingRequests,
								},
								stats.nbIncomingRequests,
							)
						}}
					</v-col>
					<v-col
						cols="12"
						md="6">
						<v-icon
							size="20"
							color="primary"
							>{{ mdiBookArrowRightOutline }}</v-icon
						>{{
							$t(
								'account.myProfile.nbOutgoingRequests',
								{
									nb: stats.nbOutgoingRequests,
								},
								stats.nbOutgoingRequests,
							)
						}}
					</v-col>
				</v-row>
			</v-container>
		</template>
	</bh-card>
</template>
