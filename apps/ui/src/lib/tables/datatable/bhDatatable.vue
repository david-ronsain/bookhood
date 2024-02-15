<script setup lang="ts"></script>

<template>
	<v-data-table
		density="compact"
		hide-no-data
		hover
		:items-per-page="10"
		no-filter
		show-current-page>
		<template v-slot:item="{ item }">
			<slot
				name="item"
				:item="item"></slot>
		</template>
	</v-data-table>
</template>

<style lang="scss">
	.v-data-table {
		tr th:not(:last-of-type),
		tr td:not(:last-of-type) {
			border-right: thin solid
				rgba(var(--v-border-color), var(--v-border-opacity));
		}

		.v-divider {
			display: none;
		}

		.v-data-table-footer {
			justify-content: center !important;

			.v-data-table-footer__items-per-page,
			.v-data-table-footer__info {
				display: none !important;
			}
		}
	}
	.v-card-text {
		padding-top: 0;
		padding-bottom: 0;
	}
</style>
