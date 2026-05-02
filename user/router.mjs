import express from "express";
const userRouter = express.Router();
import { signup, login, forget_password, verifyOtp } from "./controler.mjs";

userRouter
  .post("/signup", signup)
  .post("/login", login)
  .patch("/forget_password", forget_password)
  .patch("/reset_password", verifyOtp);

export { userRouter };
