/* eslint-disable */
export default {
	displayName: 'api-gateway',
	preset: '../../jest.preset.js',
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]s$': [
			'ts-jest',
			{ tsconfig: '<rootDir>/tsconfig.spec.json' },
		],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	resolver: '@nx/jest/plugins/resolver',
	coverageDirectory: '../../coverage/apps/api-gateway',
	coverageReporters: ['text'],
	coverageThreshold: {
		global: {
			lines: 80,
		},
	},
	collectCoverageFrom: [
		'**/*.ts',
		'!**/node_modules/**',
		'!**/guards/**',
		'!**/filters/**',
		'!**/interceptors/**',
		'!**/jest.config.ts',
		'!**/main.ts',
		'!**/*.repository.ts',
	],
}
