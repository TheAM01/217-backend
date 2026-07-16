import { model, Schema, type InferSchemaType } from "mongoose";

export const studentSchema = new Schema({
    studentId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    age: {
        type: Number,
        required: true,
        min: 14,
    },
    batch: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

export type Student = InferSchemaType<typeof studentSchema>

export const StudentModel = model("student", studentSchema);
