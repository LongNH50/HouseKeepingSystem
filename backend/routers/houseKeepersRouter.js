import { Router } from "express";
import {
  getAllHouseKeepers,
  addHouseKeeper,
  getHouseKeeperByID,
  updateHouseKeeperByID,
  deleteHouseKeeperByID,
} from "../controllers/houseKeepersController.js";
import checkToken from "../middlewares/checkToken.js";

const router = Router();

router.get("/", getAllHouseKeepers);
router.post("/", checkToken, addHouseKeeper);
router.get("/:houseKeeper_id", getHouseKeeperByID);
router.patch("/:houseKeeper_id", checkToken, updateHouseKeeperByID);
router.delete("/:houseKeeper_id", checkToken, deleteHouseKeeperByID);

export default router;
