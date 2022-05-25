let io;

// FIXME: This is not very good :/
const ENDPOINT = 'https:/azape.es';
const ENDPOINT_DEV = 'http://localhost:5000';

module.exports = {
	init: server => {
		io = require('socket.io')(server, {
			cors: {
				origin:
					process.env.NODE_ENV === 'development'
						? ENDPOINT_DEV
						: ENDPOINT,
				methods: ['GET', 'POST'],
			},
		});
		return io;
	},
	getIO() {
		if (!io) {
			throw new Error('Io dont initialized');
		}
		return io;
	},
};
