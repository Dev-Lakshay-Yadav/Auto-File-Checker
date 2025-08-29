import express, { Request, Response } from "express";
import cors from "cors";
import filesAccessRoutes from "./routes/caseStatusRoutes.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/cases", filesAccessRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});