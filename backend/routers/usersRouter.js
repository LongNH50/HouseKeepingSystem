import { Router } from "express";
import {
  deleteUserByID,
  getAllUser,
  getUserbyID,
  login,
  signup,
  updateUserByID,
} from "../controllers/usersController.js";

import checkTokenForUsers from "../middlewares/checkTokenForUsers.js";
import checkToken from "../middlewares/checkToken.js";
import bookingRouter from "./bookingRouter.js";

const router = Router({ mergeParams: true });

router.get("/", checkToken, getAllUser);
router.post("/signup", signup);
router.post("/login", login);
router.get("/:user_id", checkTokenForUsers, getUserbyID);
router.patch("/:user_id", checkTokenForUsers, updateUserByID);
router.delete("/:user_id", checkTokenForUsers, deleteUserByID);

router.use("/:user_id/booking", checkTokenForUsers, bookingRouter);

export default router;
