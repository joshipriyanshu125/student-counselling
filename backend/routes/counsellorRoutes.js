import express from "express";
import { getCounsellors } from "../controllers/counsellorController.js";

const router = express.Router();

router.get("/counsellors", getCounsellors);

export default router;