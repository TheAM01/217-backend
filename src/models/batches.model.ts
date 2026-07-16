import { model, Schema, type InferSchemaType } from "mongoose";

export const batchSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    startDate: {
        type: Date,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        require: true,
        default: true,
    }
}, {
    timestamps: true,
});

export type Batch = InferSchemaType<typeof batchSchema>

export const BatchModel = model("batch", batchSchema);
