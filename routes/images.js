import { Router } from "express";
import ImagesController from "../controllers/images.js";

const router = Router();

router.post("/", ImagesController.saveImage);
router.get("/:name", ImagesController.getImageByName);

export default router;