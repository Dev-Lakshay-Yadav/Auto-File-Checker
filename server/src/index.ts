import express, { Request, Response } from "express";
import cors from "cors";
import filesAccessRoutes from "./routes/filesAccessRoutes.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/files", filesAccessRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
