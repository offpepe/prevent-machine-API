import { Router } from "express";
import authMiddleware from "../middlewares/AuthMiddleware";
import AssetController from "../controllers/AssetController";

const controller: AssetController = new AssetController();
const router: Router = Router();

router.get("/:unitId", authMiddleware, controller.ListAssets);
router.get("/:unitId/:assetId", authMiddleware, controller.GetAssetById);
router.post("/:unitId", authMiddleware, controller.CreateAsset);
router.put("/:unitId/:assetId", authMiddleware, controller.UpdateAsset);
router.put("/:unitId/:assetId/healthLevel", authMiddleware, controller.UpdateHealthLevel);

export default router;