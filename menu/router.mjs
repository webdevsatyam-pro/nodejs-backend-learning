import { Router } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { authentication } from "../middleware/Authentication.mjs";
const menuRouter = Router();
import { createMenu, getMenus, updateMenu, deleteMenu } from "./controller.mjs";

menuRouter.get("/", getMenus);

menuRouter.use(authentication);

menuRouter.post("/", createMenu).patch("/", updateMenu).delete("/", deleteMenu);

export { menuRouter };
