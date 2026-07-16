import express, { type Request, type Response } from "express";
import "dotenv/config";

// importing routers
import studentsRouter from "./routers/students.router.ts"
import batchesRouter from "./routers/batches.router.ts"
import authRouter from "./routers/auth.router.ts"

// importing middleware
import { logger } from "./middleware/logger.ts";
import { authentication } from "./middleware/authentication.ts"; // x-api-key check on non-GET requests
import { connectDB } from "./database/connect.ts";
import { auth } from "./middleware/auth.ts"; // JWT cookie check, populates req.user

// importing packages
import cookieParser from "cookie-parser";
// import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import multer from "multer";


// connecting to database
// top-level await: the server must not start accepting requests before the DB is reachable
await connectDB();


// creating constants
const app = express();
const PORT = process.env.PORT || 8080;

// uploads land on disk under src/uploads/, served back out via the /uploads static mount below
const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, "src/uploads/")
	},
	filename(req, file, callback) {
		// timestamp prefix keeps same-named uploads from overwriting each other
		const uniqueName = `${Date.now()}-${file.originalname}`
		callback(null, uniqueName);
	}
});
const upload = multer({ storage });


// applying middleware (order matters!)
app.use(logger);
app.use(express.json());
app.use(cookieParser()) // must run before `auth`, which reads req.cookies.token
app.use("/api", authentication); // api-key gate, scoped to /api only — /auth and /profile stay open
// app.use(helmet());
app.use(morgan("tiny"));
app.use(cors({
	origin: [
		"http://localhost:3000",
		// "http://localhost:5173",
		"https://example-site.vercel.app"
	],
	credentials: true, // required for the browser to send the JWT cookie cross-origin
	methods: ["GET", "POST", "PATCH", "DELETE"]
}));

// static mounts: bundled assets, and user uploads written by multer above
app.use("/public", express.static("src/static"));
app.use("/uploads", express.static("src/uploads"));


// creating routes

// health check
app.get("/", (req: Request, res: Response) => {
	res.send("Hello, World!");
});

// `auth` populates req.user from the JWT cookie
app.get("/profile", auth, (req: Request, res: Response) => {
	res.json(req.user?.userId);
});

// accepts a single "profilePicture" file field; multer puts it on req.file
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