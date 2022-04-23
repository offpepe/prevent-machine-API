import express, {Router} from "express";
import userRouter from "./UserRouter";
import companyRouter from "./CompanyRouter";

const router : Router = express.Router();

router.use('/user', userRouter);
router.use('/company', companyRouter);

export default router;