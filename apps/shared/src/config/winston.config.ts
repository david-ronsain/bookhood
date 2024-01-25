export const winstonConfig = (winston, service: string) => ({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: {
		service,
	},
	handleExceptions: true,
	handleRejections: true,
	transports: [
		new winston.transports.Console({
			handleExceptions: true,
			handleRejections: true,
		}),
		new winston.transports.File({
			filename: 'error.log',
			level: 'error',
			dirname: `apps/${service}/logs/`,
			handleExceptions: true,
			handleRejections: true,
		}),
		new winston.transports.File({
			filename: 'info.log',
			level: 'info',
			dirname: `apps/${service}/logs/`,
		}),
		new winston.transports.File({
			filename: 'warning.log',
			level: 'warning',
			dirname: `apps/${service}/logs/`,
		}),
	],
})
