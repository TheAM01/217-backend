import { Router, type Request, type Response } from "express";
import * as batchesController from "../controllers/batches.controller.ts";

const router = Router();

router.get("/", batchesController.getAllBatches);
router.post("/", batchesController.createBatch);

router.get("/:id", batchesController.getBatchById);
router.patch("/:id", batchesController.updateBatch);
router.delete("/:id", batchesController.deleteBatch);

export default router;
