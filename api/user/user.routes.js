import { Router } from "express";
import { userController } from "./user.controller.js";

const userRouter = Router();

userRouter.get("/", userController.getUsers);
userRouter.get("/:userId", userController.getUserById);
userRouter.put("/:userId", userController.updateUser);
userRouter.delete("/:userId", userController.deleteUser);

export default userRouter;