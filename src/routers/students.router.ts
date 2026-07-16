import { Router, type Request, type Response } from "express";
import * as studentsController from "../controllers/students.controller.ts";

const router = Router();

router.get("/", studentsController.getAllStudents);
router.post("/", studentsController.createStudent);

router.get("/:id", studentsController.getStudentById);
router.patch("/:id", studentsController.updateStudent);
router.delete("/:id", studentsController.deleteStudent);

export default router;
