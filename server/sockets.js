
const MESSAGE_EVENTS = [
    'new-call',
    'chat-message',
];

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

class Sockets {
    init(server, passport) {
        this.io = require('socket.io')(server);

        this.io.use(wrap(passport.initialize()));
        this.io.use(wrap(passport.session()));
        this.io.use(wrap(passport.authenticate(['jwt'])));

        this.io.use((socket, next) => {
            if (socket.request.user) {
                next();
            } else {
                next(new Error("Unauthorized"))
            }
        });

        this.io.on('connection', (socket) => {
            const { id: userId } = socket.request.user;
            socket.join(`user-${userId}`); // for private messaging
            this.setupSocketEvents(socket);
        });
    }

    setupSocketEvents(socket) {
        socket.on("disconnecting", (reason) => {
            // const { id: userId } = socket.request.user;
            // socket.rooms.forEach(socketRoomId => {
            //     if (socketRoomId.startsWith('room-')) {
            //         // remove room- prefix to get real roomId
            //         const roomId = socketRoomId.substring(5);
            //         const event = { type: 'user-left', userId, roomId };
            //         this.emitEvent(`room-${roomId}`, 'room-members-update', event);
            //     }
            // });
        });

        MESSAGE_EVENTS.forEach(eventName => {
            socket.on(eventName, this.transmitMessage(socket, eventName));
        });
    }

    /**
     * @param receiver: string - can be either roomId or userId
     * @param eventName
     * @param event
     */
    emitEvent(receiver, eventName, event) {
        this.io.to(receiver).emit(eventName, event);
    }

    transmitMessage(socket, eventName) {
        const { id: userId } = socket.request.user;
        return ({ message, to }) => {
            socket.to(`user-${to}`).emit(eventName, {
                message,
                from: userId,
            });
        }
    }
}

module.exports = new Sockets();
