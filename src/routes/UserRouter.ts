import express, {Request, Router} from "express";
import UserController from "../controllers/UserController";
import IUserService from "../interfaces/services/IUserService";
import UserService from "../services/UserService";

const controller = new UserController();
const router: Router = express.Router();

router.post('/', controller.RegisterUser);
router.get('/', controller.ListUsers);
router.get('/:id', controller.GetUser);
router.put('/:id', controller.UpdateUser);

export default router;