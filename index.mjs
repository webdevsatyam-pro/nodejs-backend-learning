import "dotenv/config";
import express from "express";
import { prisma } from "./prisma/prisma_client.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "./resend.mjs";

const app = express();
const port = 6000;
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ a: "apple" });
});

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      password: hashPassword,
    },
  });
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
});

app.post("/login", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    res.status(404).json({
      error: "user not found",
    });
    return;
  }
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    res.status(401).json({
      error: "password not matched",
    });
    return;
  }

  // generate token

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.token_secret,
  );

  res.json({ message: "login successful", token: token });
});

app.patch("/forget_password", async (req, res) => {
  // 1. find user in Database  email
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    res.status(404).json({
      error: "user not found",
    });
    return;
  }

  // 2. generate OTP of 6 digit
  const OTP = Math.floor(Math.random() * 899999 + 100000);
  const strOTP = `${OTP}`;

  // 3.0 Create OTP Column in DB (One time)
  // 3.1 save OTP in DB
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      OTP: strOTP,
      OtpGeneratedAt: new Date(Date.now()),
    },
  });

  // 4. send email
  await sendOTP(user.email, strOTP);

  // // 5. send success in response
  res.json({ message: "check your email" });
});

// verify otp

app.post("/verify-otp", async (req, res) => {
  const { email, OTP } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user || user.OTP !== OTP) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      OTP: null,
    },
  });

  res.json({ message: "OTP verified successfully" });
});

app.listen(port, () => {
  console.log(`server start from ${port}`);
});
