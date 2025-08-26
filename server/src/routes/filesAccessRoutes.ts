import express from "express";
import {checkCases} from "../controllers/fileService.js"

const router = express.Router();

router.get("/datefolder",checkCases);

export default router;