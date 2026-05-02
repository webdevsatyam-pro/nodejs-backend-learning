import "dotenv/config";
import express from "express";
import { userRouter } from "./user/router.mjs";
const app = express();
const port = 6000;
app.use(express.json());
app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`server start from ${port}`);
});
