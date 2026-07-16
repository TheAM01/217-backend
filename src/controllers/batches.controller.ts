import { type Request, type Response } from "express";
import { BatchModel, type Batch } from "../models/batches.model.ts";
import { isValidObjectId } from "mongoose";

export async function getAllBatches(req: Request, res: Response) {
    try {
        const batches = await BatchModel.find({}).sort({ code: 1 });

        res.send(batches);
    } catch (error: unknown) {
        res.status(500).json({ error: "There was an error" });
    }
}

export async function getBatchById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (id === undefined || !isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid ID" });
        }

        const batch = await BatchModel.findById(id);

        if (!batch) {
            res.status(404).json({ error: "Batch not found!" });
            return;
        }

        res.send(batch);
    } catch (error: unknown) {
        res.status(500).json({ error: "There was an error" });
    }
}

export async function createBatch(req: Request, res: Response) {
    try {
        const body = req.body as Partial<Batch>;

        if (
            typeof body.name !== "string" ||
            typeof body.code !== "string" ||
            typeof body.startDate !== typeof Date ||
            typeof body.isActive !== "boolean"
        ) {
            res.status(400).json({ error: "Invalid JSON body" });
            return;
        }

        const batch = await BatchModel.create(body);

        res.status(201).json(batch);
    } catch (error: unknown) {
        res.status(500).json({ error: "There was an error" });
    }
}

export async function updateBatch(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (id === undefined || !isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid ID" });
        }

        const body = req.body as Partial<Batch>;

        const updatedBatch = await BatchModel.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedBatch) {
            res.status(404).json({ error: "Batch not found!" });
            return;
        }

        res.status(200).json(updatedBatch);
    } catch (error: unknown) {
        res.status(500).json({ error: "There was an error" });
    }
}

export async function deleteBatch(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (id === undefined || !isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid ID" });
        }

        const deletedBatch = await BatchModel.findByIdAndDelete(id);

        if (!deletedBatch) {
            res.status(404).json({ error: "Batch not found!" });
            return;
        }

        res.status(200).json(deleteBatch);
    } catch (error: unknown) {
        res.status(500).json({ error: "There was an error" });
    }
}
