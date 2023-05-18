import express from "express";
import usersController from "../controllers/users.js";

const router = express.Router();

router.route("/login").post(usersController.login);
router.route("/register").post(usersController.register);
router.route("/logout").post(usersController.logout);

export default router;
