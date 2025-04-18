import { Server } from 'socket.io'
import { logger } from './logger.service.js'


var gIo = null


export function setupSocketAPI(http) {
    logger.debug('Setting up sockets')
    gIo = new Server(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        logger.info(`New connected socket [id: ${socket.id}]`);
        socket.on('disconnect', socket => {
            logger.info(`Socket disconnected [id: ${socket.id}]`);
        })
        socket.on('user-watch', userId => {
            logger.info(`user-watch from socket [id: ${socket.id}], on user ${userId}`);
            socket.join('watching:' + userId);
        })
        socket.on('watch-board', board => {
            const room = 'board:' + board;
            logger.info(`Event watch-board from socket [id: ${socket.id}], on room ${room}`);
            socket.join(room);
        })
        socket.on('unwatch-board', board => {
            const room = 'board:' + board;
            logger.info(`Event unwatch-board from socket [id: ${socket.id}], on room ${room}`);
            socket.leave(room);
        })
        socket.on('set-user-socket', userId => {
            logger.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`);
            socket.userId = userId;
        })
        socket.on('trigger-notification', data => {
            logger.info(`Triggering notification from socket [id: ${socket.id}]`);
            console.log("🚀 ~ setupSocketAPI ~ data:", data)
            socket.broadcast.to('board:' + data.boardId).emit('new-notification', data)
        })
        socket.on('unset-user-socket', () => {
            logger.info(`Removing socket.userId for socket [id: ${socket.id}]`);
            delete socket.userId;
        })
    })
}


function emitTo({ type, data, label }) {
    logger.info(`Emiting event: ${type} to label: ${label}`)
    if (label) gIo.to(label.toString()).emit(type, data)
    else gIo.emit(type, data)
}


async function emitToUser({ type, data, userId }) {
    userId = userId.toString()
    const socket = await _getUserSocket(userId)

    if (socket) {
        logger.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        socket.emit(type, data)
    } else {
        logger.info(`No active socket for user: ${userId}`)
        _printSockets()
    }
}


// If possible, send to all sockets BUT not the current socket 
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
    userId = userId.toString()

    if (!userId)
        logger.warn("socketService.broadcast - No userId provided to broadcast!");

    logger.info(`Broadcasting event: ${type}`)
    const excludedSocket = await _getUserSocket(userId)
    if (room && excludedSocket) {
        logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.to(room).emit(type, data)
        // excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        logger.info(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        logger.info(`Emit to room: ${room}`)
        gIo.to('board:' + room).emit(type, data)
    } else {
        logger.info(`Emit to all`)
        gIo.emit(type, data)
    }
}


async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.userId === userId)
    return socket
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}


async function _printSockets() {
    const sockets = await _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}


export const socketService = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific user (if currently active in system)
    emitToUser,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
}
