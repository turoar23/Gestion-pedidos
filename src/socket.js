let io;

module.exports = {
	init: server => {
		io = require('socket.io')(server, {
			cors: {
				origin: 'http://localhost:5000',
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
