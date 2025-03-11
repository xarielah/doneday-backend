import { authService } from "./auth.service.js";

export const authController = {
    login,
    register,
    logout
};

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await authService.login(username, password);

        const loginToken = authService.getLoginToken(user);
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true });

        return res.send(user);
    } catch (error) {
        console.log('ERROR: cannot login user', error);
        return res.status(401).send({ err: 'Encountered an error trying to login user' });
    }
}

async function register(req, res) {
    try {
        const user = req.body;
        const newUser = await authService.register(user);

        const loginToken = authService.getLoginToken(user);
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true });

        return res.send(newUser);
    } catch (error) {
        console.log('ERROR: cannot register user in DB', error);
        return res.status(400).send({ err: 'Failed to register user' });
    }
}

async function logout(_, res) {
    try {
        res.clearCookie('loginToken')
        return res.send({ msg: 'User logged out' });
    } catch (error) {
        console.log('ERROR: cannot logout user', error);
        return res.status(500).send({ err: 'Encountered an error trying to logout user' });
    }
}