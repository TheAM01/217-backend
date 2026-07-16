import { model, Schema, type InferSchemaType } from "mongoose";

export const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

export type User = InferSchemaType<typeof userSchema>

export const UserModel = model("user", userSchema);
