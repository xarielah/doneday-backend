import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service.js";

export const userService = {
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserByUsername
};

async function getUserById(userId) {
    const collection = await dbService.getCollection('users');
    const user = await collection.findOne({ _id: ObjectId.createFromHexString(userId) });
    return user;
}

async function getUserByUsername(username) {
    const collection = await dbService.getCollection('users');
    const user = await collection.findOne({ username });
    return user;
}

async function createUser(user) {
    const collection = await dbService.getCollection('users');

    const foundUser = await collection.findOne({ username: user.username });
    if (foundUser) return Promise.reject('Username already exists');

    user._id = user._id.toString();
    const saltRounds = 10
    const encryptedInputPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = encryptedInputPassword;

    const newUser = await collection.insertOne(user);
    return newUser;
}

async function updateUser(user) {
    const collection = await dbService.getCollection('users');

    const userToUpdate = {
        _id: ObjectId.createFromHexString(user._id),
        username: user.username,
        fullname: user.fullname,
    };

    const updatedUser = await collection.updateOne({ _id: ObjectId.createFromHexString(user._id) }, { $set: userToUpdate });

    if (!updatedUser)
        return Promise.reject(`Could not find user with id \"${user.id}\"`)

    delete updatedUser.password;
    updatedUser._id = updatedUser._id.toString();

    return updatedUser;
}

async function deleteUser(userId) {
    const collection = await dbService.getCollection('users');
    const deletedUser = await collection.deleteOne({ _id: ObjectId.createFromHexString(userId) });
    return deletedUser;
}