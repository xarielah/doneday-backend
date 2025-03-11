import { userService } from "./user.service.js";

export const userController = {
    getUserById,
    createUser,
    updateUser,
    deleteUser
};

async function getUserById(req, res) {
    try {
        const userId = req.params.userId;
        const user = await userService.getUserById(userId);

        if (!user)
            return res.status(404).send('Could not find user with id \"${userId}\"');

        delete user.password;

        return res.send(user);
    } catch (error) {
        console.log('ERROR: cannot fetch user from DB', error);
        return res.status(500).send('Encountered an error trying to fetch user');
    }
}

async function createUser(req, res) {
    try {
        const { username, password, fullname } = req.body;

        if (!username || !password || !fullname)
            return res.status(400).send('Invalid username, password or fullname');

        const newUser = await userService.createUser({ username, password, fullname });
        return res.status(201).send(newUser);
    } catch (error) {
        console.log('ERROR: cannot create user in DB', error);
        return res.status(400).send('Encountered an error trying to create user');
    }
}

async function updateUser(req, res) {
    try {
        const user = req.body;
        const updatedUser = await userService.updateUser(user);
        return res.send(updatedUser);
    } catch (error) {
        console.log('ERROR: cannot update user in DB', error);
        return res.status(500).send('Encountered an error trying to update user');
    }
}

async function deleteUser(req, res) {
    try {
        const userId = req.params.userId;
        const deleteResult = await userService.deleteUser(userId);

        if (deleteResult.deletedCount === 0)
            return res.status(404).send(`Could not find user with id \"${userId}\"`);

        return res.send(`Deleted user with id \"${userId}\"`);
    } catch (error) {
        console.log('ERROR: cannot delete user from DB', error);
        return res.status(500).send('Encountered an error trying to delete user');
    }
}
