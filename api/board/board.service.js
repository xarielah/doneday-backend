import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service.js";

export const boardService = {
    getBoards,
    createBoard,
    updateBoard,
    deleteBoard
};

async function getBoards() {
    const collection = await dbService.getCollection('boards');
    const boards = await collection.find({}).toArray();
    return boards;
}

async function createBoard(board) {
    const collection = await dbService.getCollection('boards');
    const { insertedId } = await collection.insertOne(board);

    board._id = insertedId.toString();

    return board;
}

async function updateBoard(board) {
    const collection = await dbService.getCollection('boards');
    const boardId = board._id;

    const { matchedCount } = await collection.updateOne({ _id: ObjectId.createFromHexString(boardId) }, { $set: { 'name': board.name, 'groups': board.groups, 'color': board.color } });

    if (matchedCount === 0)
        return Promise.reject('Could not find board to update');

    board._id = boardId;

    return board;
}

async function deleteBoard(board) {
    const collection = await dbService.getCollection('boards');
    const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(board._id) });

    if (deletedCount === 0)
        return Promise.reject('Could not delete board');

    return deletedCount;
}