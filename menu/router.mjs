import { Router } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
const menuRouter = Router();
import { createMenu, getMenus, updateMenu, deleteMenu } from "./controller.mjs";

const authentication = (req, res, next) => {
  if (!req.headers.authentication) {
    res.status(401).json({ eror: "No token supplied , Login Again!!" });
  }
  return;
};

const token = req.headers.authentication.replace("Bearer", "");
console.log(token);

const output = Jwt.verify(token, process.env.TOKEN_SECRET);
console.log(output);
next();

menuRouter.get("/", getMenus);

menuRouter.use(authentication);

menuRouter.post("/", createMenu).patch("/", updateMenu).delete("/", deleteMenu);

export { menuRouter };
