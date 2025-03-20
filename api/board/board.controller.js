import { socketService } from "../../services/socket.service.js";
import { boardService } from "./board.service.js";

export const boardController = {
    getBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    getBoardById
};

async function getBoards(_, res) {
    try {
        const boards = await boardService.getBoards();
        return res.send(boards);
    } catch (error) {
        console.log('ERROR: cannot fetch boards from DB', error);
        return res.status(400).send({ err: 'Encountered an error trying to fetch boards' });
    }
}

async function getBoardById(req, res) {
    try {
        const boardId = req.params.id;
        const board = await boardService.getBoardById(boardId);
        return res.send(board);
    } catch (error) {
        console.log('ERROR: cannot fetch board from DB', error);
        return res.status(400).send({ err: 'Encountered an error trying to fetch board' });
    }
}

async function createBoard(req, res) {
    try {
        const { name, groups = [], color = '#000000' } = req.body;

        if (!name)
            return res.status(400).send({ err: 'Missing required fields' });

        const boardToCreate = {
            name: name,
            groups: groups,
            color: color,
        };

        const newBoard = await boardService.createBoard(boardToCreate);

        await socketService.broadcast({ type: 'updated-board', data: newBoard._id, room: newBoard._id, userId: req.user?._id || '' })
        return res.status(201).send(newBoard);
    } catch (error) {
        console.log('ERROR: cannot create board in DB', error);
        return res.status(400).send({ err: 'Encountered an error trying to create board' });
    }
}

async function updateBoard(req, res) {
    try {
        const board = req.body;

        const boardToUpdate = {
            _id: board._id,
            name: board.name,
            groups: board.groups,
            color: board.color,
        }

        const updatedBoard = await boardService.updateBoard(boardToUpdate);

        const roomToEmit = 'board:' + board._id;
        await socketService.broadcast({ type: 'updated-board', data: updatedBoard, room: roomToEmit, userId: req.user?._id || '' })

        return res.send(updatedBoard);
    } catch (error) {
        console.log('ERROR: cannot update board in DB', error);
        return res.status(400).send({ err: 'Encountered an error trying to update board' });
    }
}

async function deleteBoard(req, res) {
    try {
        const boardId = req.params.id;
        await boardService.deleteBoard(boardId);
        await socketService.broadcast({ type: 'deleted-board', data: boardId, room: "board:" + boardId, userId: req.user?._id || '' })
        return res.send({ msg: `Board with id \"${boardId}\" was deleted` });
    } catch (error) {
        console.log('ERROR: cannot delete board', error);
        return res.status(500).send({ err: `Could not delete board` });
    }
}