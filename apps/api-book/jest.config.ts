/* eslint-disable */
export default {
	displayName: 'api-book',
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
	coverageDirectory: '../../coverage/apps/api-book',
	coverageReporters: ['text'],
	coverageThreshold: {
		global: {
			lines: 80,
		},
	},
	collectCoverageFrom: [
		'**/*.ts',
		'!**/node_modules/**',
		'!**/jest.config.ts',
		'!**/main.ts',
	],
}
