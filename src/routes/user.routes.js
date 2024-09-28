import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUsers,
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/register").post(registerUsers);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

export default router;
