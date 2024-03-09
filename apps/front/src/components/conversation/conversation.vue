<script setup lang="ts">
	import { BhCard } from '@bookhood/ui'
	import { computed } from 'vue'
	import type { IUser, IConversationFull } from '@bookhood/shared'
	import { useSocket } from '../../composables/socket'
	import { useMainStore } from '../../store'
	import Message from './message.vue'
	import createMessage from './createMessage.vue'

	const mainStore = useMainStore()
	const { state } = useSocket()

	const me = computed(() => mainStore.profile)
	const conversation = computed<IConversationFull>(
		() => state.value.conversation,
	)
	const other = computed<IUser>(() =>
		me.value && conversation
			? conversation.value?.request?.emitter?._id !== me.value._id
				? conversation.value?.request?.emitter
				: conversation.value?.request?.owner
			: null,
	)
</script>

<template>
	<bh-card
		border
		flat
		id="conversation"
		:title="
			$t('conversation.title', {
				firstName: other?.firstName,
				lastName: other?.lastName,
				book: conversation?.request?.book?.title,
			})
		">
		<template v-slot:text>
			<div
				v-if="conversation"
				class="d-flex flex-column">
				<message
					v-for="message in conversation.messages"
					:key="message._id"
					:message="message"
					:conversationId="conversation._id" />
			</div>
		</template>

		<template v-slot:actions>
			<createMessage
				v-if="conversation"
				:conversationId="conversation._id"
				:requestId="conversation.request?._id"
				:roomId="conversation.roomId" />
		</template>
	</bh-card>
</template>

<style lang="scss" scoped>
	@import 'vuetify/lib/styles/settings/_variables';
	@media #{map-get($display-breakpoints, 'md-and-up')} {
		#conversation {
			min-width: 700px;
		}
	}

	.is-writing {
		font-size: 12px;
		font-style: italic;
	}
</style>

<style lang="scss">
	@import 'vuetify/lib/styles/settings/_colors';

	#conversation {
		max-width: 800px;
		max-height: 100%;
		position: absolute;
		top: 12px;
		bottom: 12px;
		overflow-y: hidden;

		> .v-card-title {
			position: sticky;
			top: 0px;
			width: 100%;
			background-color: map-get($shades, 'white');
			z-index: 1000;
		}

		> .v-card-text {
			z-index: 999;
			overflow-y: auto;

			.v-icon {
				position: absolute;
				bottom: 0;
				right: 0;
			}
		}

		> .v-card-actions {
			position: sticky;
			bottom: 0;
			width: 100%;
			background-color: map-get($shades, 'white');
			z-index: 1000;
		}

		.v-card {
			&.align-self-end {
				background-color: map-get($grey, 'lighten-4');
			}
		}
	}
</style>
