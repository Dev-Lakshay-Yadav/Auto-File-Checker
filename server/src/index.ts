import express, { Request, Response } from "express";
import cors from "cors";
import filesAccessRoutes from "./routes/caseStatusRoutes.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/cases", filesAccessRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
