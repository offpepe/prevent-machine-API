import express, {Router} from "express";
import userRouter from "./UserRouter";
import companyRouter from "./CompanyRouter";
import unitRouter from "./UnitRouter";
import assetRouter from "./AssetRouter";

const router : Router = express.Router();

router.use('/user', userRouter);
router.use('/company', companyRouter);
router.use('/unit', unitRouter);
router.use('/asset', assetRouter);

export default router;