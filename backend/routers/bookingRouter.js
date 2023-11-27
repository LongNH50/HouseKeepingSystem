import { Router } from "express";
import {booking} from '../controllers/bookingController.js'

const router = Router({ mergeParams: true });

router.patch('/', booking);

export default router