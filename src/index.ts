import express, { type Request, type Response } from "express";
import "dotenv/config";

// importing routers
import studentsRouter from "./routers/students.router.ts"
import batchesRouter from "./routers/batches.router.ts"
import authRouter from "./routers/auth.router.ts"

// importing middleware
import { logger } from "./middleware/logger.ts";
import { authentication } from "./middleware/authentication.ts";
import { connectDB } from "./database/connect.ts";
import { auth } from "./middleware/auth.ts";

// importing packages
import cookieParser from "cookie-parser";
// import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import multer from "multer";


// connecting to database
await connectDB();


// creating constants
const app = express();
const PORT = process.env.PORT || 8080;
const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, "src/uploads/")
	},
	filename(req, file, callback) {
		const uniqueName = `${Date.now()}-${file.originalname}`
		callback(null, uniqueName);
	}
});
const upload = multer({ storage });


// applying middleware (order matters!)
app.use(logger);
app.use(express.json());
app.use(cookieParser())
app.use("/api", authentication);
// app.use(helmet());
app.use(morgan("tiny"));
app.use(cors({
	origin: [
		"http://localhost:3000",
		// "http://localhost:5173",
		"https://example-site.vercel.app"
	],
	credentials: true,
	methods: ["GET", "POST", "PATCH", "DELETE"]
}));

app.use("/public", express.static("src/static"));
app.use("/uploads", express.static("src/uploads"));


// creating routes
app.get("/", (req: Request, res: Response) => {
	res.send("Hello, World!");
});

app.get("/profile", auth, (req: Request, res: Response) => {
	res.json(req.user?.userId);
});

app.post("/profile", upload.single("profilePicture"), (req: Request, res: Response) => {
	res.json(req.file);
});




// assigning routers
app.use("/api/students", studentsRouter);
app.use("/api/batches", batchesRouter);
app.use("/auth", authRouter);


// making the app live
app.listen(PORT, () => {
    console.clear();
	console.log(`Server is live on port ${PORT}!`);
});