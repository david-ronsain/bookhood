<script setup lang="ts">
	import { onMounted, onUnmounted, watch, computed } from 'vue'
	import { socket, state, emitEvent } from '../composables/socket'
	import { useRoute } from 'vue-router'
	import { useMainStore } from '../store'
	import type {
		IConversationFull,
		IUser,
		IConversationMessage,
	} from '@bookhood/shared'
	import { BhCard, BhTextField } from '@bookhood/ui'
	import { mdiCheck, mdiCheckBold, mdiLoading, mdiSendOutline } from '@mdi/js'
	import { ref } from 'vue'
	const route = useRoute()
	const mainStore = useMainStore()
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n({})
	const socketConnected = computed(() => state.value.connected)
	const conversation = computed<IConversationFull>(
		() => state.value.conversation,
	)
	const me = computed(() => mainStore.profile)
	const other = computed<IUser>(() =>
		me.value && conversation
			? conversation.value?.request?.emitter?._id !== me.value._id
				? conversation.value?.request?.emitter
				: conversation.value?.request?.owner
			: null,
	)
	const iconDisabled = computed(
		() => loading.value || currentMessage.value.length === 0,
	)
	const icon = computed(() => (loading.value ? mdiLoading : mdiSendOutline))
	const currentMessage = ref<string>('')
	const loading = ref<boolean>(false)

	const send = (): void => {
		if (currentMessage.value) {
			loading.value = true
			emitEvent('conversation-add-message', {
				message: currentMessage.value,
				_id: conversation.value._id,
				userId: me.value._id,
				roomId: conversation.value.roomId,
				requestId: conversation.value.request?._id,
			})
		}
	}

	const seen = (message: IConversationMessage): boolean =>
		message.from === me.value._id &&
		Array.isArray(message.seenBy) &&
		message.seenBy.length

	const flagAsSeen = (
		isIntersecting,
		entries,
		observer,
		message: IConversationMessage,
	): void => {
		if (
			isIntersecting &&
			entries[0].intersectionRatio === 1 &&
			message.from !== me.value._id &&
			!message.seenBy?.includes(me.value._id)
		) {
			emitEvent('conversation-flag-seen', {
				messageId: message._id,
				conversationId: conversation.value._id,
				userId: me.value._id,
			})
		}
	}

	onMounted(() => {
		socket.connect()

		socket.on(
			'conversation-message',
			(res: { data: IConversationMessage }) => {
				if (res.data.from === me.value._id) {
					loading.value = false
					currentMessage.value = ''
				}
			},
		)

		socket.on('conversation-add-message-error', () => {
			mainStore.error = t('conversation.error.messageCanNotBeCreated')
		})

		socket.on('conversation-access-forbidden', () => {
			mainStore.error = t('conversation.error.accessForbidden')
		})
	})

	onUnmounted(() => {
		socket.disconnect()
	})

	watch(socketConnected, () => {
		if (socketConnected.value) {
			emitEvent('conversation-connect', { requestId: route.params.id })
		}
	})
	watch(currentMessage, () => {})
</script>

<template>
	<v-container
		class="d-flex justify-center"
		:class="
			(route.meta.fullHeight ? 'fullheight' : '') +
			' ' +
			(conversation ? '' : 'align-center')
		"
		fluid>
		<bh-card
			v-if="conversation"
			border
			flat
			id="conversation"
			:title="
				$t('conversation.title', {
					firstName: other.firstName,
					lastName: other.lastName,
					book: conversation?.request?.book?.title,
				})
			">
			<template v-slot:text>
				<div class="d-flex flex-column">
					<bh-card
						border
						v-for="message in conversation.messages"
						flat
						:hover="false"
						:key="message._id"
						class="my-1"
						:class="
							message.from === me._id
								? 'align-self-end'
								: 'align-self-start'
						">
						<template v-slot:text>
							<div
								v-text="message.message"
								v-intersect.once="{
									handler: (
										isIntersecting,
										entries,
										observer,
									) =>
										flagAsSeen(
											isIntersecting,
											entries,
											observer,
											message,
										),
									options: {
										threshold: [1],
									},
								}" />
							<v-icon
								v-if="seen(message)"
								size="12"
								color="green">
								{{ mdiCheckBold }}
							</v-icon>
						</template>
					</bh-card>
				</div>
			</template>

			<template v-slot:actions>
				<bh-text-field
					autofocus
					clear
					density="compact"
					:icon="{
						appendInner: true,
						icon,
						disabled: iconDisabled,
					}"
					:placeholder="$t('conversation.writemessage')"
					rounded
					variant="outlined"
					v-model="currentMessage"
					@keyup.enter.prevent="send"
					@click:appendInner="send" />
			</template>
		</bh-card>
		<v-progress-circular
			v-else
			color="primary"
			indeterminate
			:size="100" />
	</v-container>
</template>

<style lang="scss" scoped>
	@import 'vuetify/lib/styles/settings/_variables';
	.v-container.fullheight {
		max-height: 100%;
	}

	@media #{map-get($display-breakpoints, 'md-and-up')} {
		#conversation {
			min-width: 700px;
		}
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
