import { Router, Request, Response } from 'express';
import jwtMiddleware from '../middlewares/jwt-middleware'
import {ErrorBody} from "../typings/error";
import serviceMiddleware from "../middlewares/service-middleware";
import { getAllRoles } from "../models/role";
import { getAuthoritiesByUserId } from "../models/authorities";
import {IUserAuthorities} from "../typings/authorities";

const router = Router();

router.use(serviceMiddleware);

router.get('/create-role', jwtMiddleware, (req: Request, res: Response) => {

});

router.get('/add-global-admin', jwtMiddleware, (req: Request, res: Response) => {

});

router.get('/remove-global-admin', jwtMiddleware, (req: Request, res: Response) => {

});

export default router;