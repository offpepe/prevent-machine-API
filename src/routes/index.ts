import express, {Router} from "express";
import user from "./UserRouter";

const router : Router = express.Router();
const userRouter: Router = user;

router.use('/user', userRouter);

export default router;