/// <reference types='vitest' />
import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import vuetify from 'vite-plugin-vuetify'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import path, { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

export default defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd(), '')

	return {
		root: __dirname,
		cacheDir: '../../node_modules/.vite/apps/front',

		server: {
			port: env.APP_FRONT_SERVER_PORT,
			host: env.APP_FRONT_SERVER_HOST,
		},

		preview: {
			port: env.APP_FRONT_PREVIEW_PORT,
			host: env.APP_FRONT_PREVIEW_HOST,
		},

		plugins: [
			vue(),
			VueI18nPlugin({
				include: resolve(
					dirname(fileURLToPath(import.meta.url)),
					'./src/locales/**',
				),
			}),
			nxViteTsPaths(),
			vuetify({ autoImport: true }),
		],

		resolve: {
			alias: [
				{
					find: '@',
					replacement: fileURLToPath(
						new URL('./src', import.meta.url),
					),
				},
				{
					find: '@bookhood/shared',
					replacement: path.resolve(__dirname, '../shared/src'),
				},
			],
		},

		// Uncomment this if you are using workers.
		// worker: {
		//  plugins: [ nxViteTsPaths() ],
		// },

		build: {
			outDir: '../../dist/apps/front',
			reportCompressedSize: true,
			commonjsOptions: {
				transformMixedEsModules: true,
			},
		},

		test: {
			globals: true,
			cache: {
				dir: '../../node_modules/.vitest',
			},
			environment: 'jsdom',
			include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

			reporters: ['default'],
			coverage: {
				reportsDirectory: '../../coverage/apps/front',
				provider: 'v8',
				reporter: ['text'],
			},
			server: {
				deps: {
					inline: ['vuetify'],
				},
			},
		},
	}
})
