import express, {Request, Router} from "express";
import UserController from "../controllers/UserController";
import IUserService from "../models/interfaces/services/IUserService";
import UserService from "../services/UserService";
import authMiddleware from "../middlewares/AuthMiddleware";
import ValidateUserPost from "../middlewares/validations/user/ValidateUser.post";
import ValidateUserPut from "../middlewares/validations/user/ValidateUser.put";

const controller = new UserController();
const router: Router = express.Router();

router.post('/login', controller.LoginUser);
router.post('/', ValidateUserPost,controller.RegisterUser);
router.get('/', authMiddleware, controller.ListUsers);
router.get('/:id', authMiddleware, controller.GetUser);
router.put('/:id', ValidateUserPut,authMiddleware, controller.UpdateUser);
router.delete('/:id', authMiddleware, controller.DeleteUser);

export default router;