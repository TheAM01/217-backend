import { type Request, type Response } from "express";
import { StudentModel, type Student } from "../models/students.model.ts";
import { isValidObjectId } from "mongoose";

export async function getAllStudents(req: Request, res: Response) {
    try {
        const students = await StudentModel.find({}).sort({ student: 1 });

        res.send(students);
    } catch (error: unknown) {
        res.status(500).json({ error: "There was an error" });
    }
}

export async function getStudentById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (id === undefined || !isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid ID" });
        }

        const student = await StudentModel.findById(id);

        if (!student) {
            res.status(404).json({ error: "Student not found!" });
            return;
        }

        res.send(student);
    } catch (error: unknown) {
        res.status(500).json({ error: "There was an error" });
    }
}

export async function createStudent(req: Request, res: Response) {
    try {
        const body = req.body as Partial<Student>;

        if (
            typeof body.studentId !== "number" ||
            typeof body.name !== "string" ||
            typeof body.email !== "string" ||
            typeof body.age !== "number" ||
            typeof body.batch !== "string"
        ) {
            res.status(400).json({ error: "Invalid JSON body" });
            return;
        }

        const student = await StudentModel.create(body);

        res.status(201).json(student);
    } catch (error: unknown) {
        res.status(500).json({ error: "There was an error" });
    }
}

// JSON WEB TOKEN (JWT)
// eyJhbbfebysbfiyegfygvsevbfi.fbesbuebfib.fbesibibvxbbcivb

export async function updateStudent(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (id === undefined || !isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid ID" });
        }

        const body = req.body as Partial<Student>;

        const updatedStudent = await StudentModel.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedStudent) {
            res.status(404).json({ error: "Student not found!" });
            return;
        }

        res.status(200).json(updatedStudent);
    } catch (error: unknown) {
        res.status(500).json({ error: "There was an error" });
    }
}

export async function deleteStudent(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (id === undefined || !isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid ID" });
        }

        const deleteStudent = await StudentModel.findByIdAndDelete(id);

        if (!deleteStudent) {
            res.status(404).json({ error: "Student not found!" });
            return;
        }

        res.status(200).json(deleteStudent);
    } catch (error: unknown) {
        res.status(500).json({ error: "There was an error" });
    }
}
