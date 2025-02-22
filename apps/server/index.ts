import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.routes";

const app = express();

app.use(
  cors({
    origin: "*",

    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);

const PORT = 8080;

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
