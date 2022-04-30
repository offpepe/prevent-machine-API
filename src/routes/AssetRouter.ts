import { Router } from 'express';
import authMiddleware from '../middlewares/AuthMiddleware';
import AssetController from '../controllers/AssetController';
import validateAssetPost from "../middlewares/validations/asset/ValidateAsset.post";
import validateAssetPut from "../middlewares/validations/asset/ValidateAsset.put";
import validateAssetHealthLevelPut from "../middlewares/validations/asset/ValidateAssetHealthLevel.put";

const controller: AssetController = new AssetController();
const router: Router = Router();

router.get('/:unitId', authMiddleware, controller.ListAssets);
router.get('/:unitId/:assetId', authMiddleware, controller.GetAssetById);
router.post('/:unitId', authMiddleware, validateAssetPost, controller.CreateAsset);
router.put('/:unitId/:assetId', authMiddleware, validateAssetPut, controller.UpdateAsset);
router.put('/:unitId/:assetId/healthLevel', authMiddleware, validateAssetHealthLevelPut, controller.UpdateHealthLevel);
router.delete('/:unitId/:assetId', authMiddleware, controller.DeleteAsset);

export default router;