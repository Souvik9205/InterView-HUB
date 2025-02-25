import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.routes";
import jobRouter from "./routes/job.routes";
import inviteRouter from "./routes/inviteInterview.routes";
import userRouter from "./routes/user.routes";
import interviewRouter from "./routes/interview.routes";

import aiRouter from "./routes/ai.routes";

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
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/invite", inviteRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/interview", interviewRouter);

app.use("/api/v1/ai", aiRouter);

const PORT = 8080;

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
