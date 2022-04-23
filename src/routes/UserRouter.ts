import express, {Request, Router} from "express";
import UserController from "../controllers/UserController";
import IUserService from "../models/interfaces/services/IUserService";
import UserService from "../services/UserService";
import authMiddleware from "../middlewares/AuthMiddleware";

const controller = new UserController();
const router: Router = express.Router();

router.post('/login', controller.LoginUser);
router.post('/', controller.RegisterUser);
router.get('/', controller.ListUsers);
router.get('/:id', controller.GetUser);
router.put('/:id', controller.UpdateUser);
router.delete('/:id', controller.DeleteUser);

export default router;