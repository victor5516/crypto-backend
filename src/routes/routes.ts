import { Router } from "express";
import { getAll, calculate, getCalculatedRoi } from "../controllers/crypto.controller";


const router = Router();
router.get("/assets", getAll);
router.post("/calculate", calculate);
router.post("/calculate-roi", getCalculatedRoi);
export default router;