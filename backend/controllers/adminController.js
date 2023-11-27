import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Error } from "mongoose";

export async function signup(req, res, next) {
  try {
    const new_Admin = req.body;
    const { password: plain_password } = new_Admin;
    const user = await Admin.findOne({ email: new_Admin.email });
    if (user) {
      return res.status(400).json({ message: "email already exists!!!" });
    }
    const hashed_password = await bcrypt.hash(plain_password, 10);
    const result = await Admin.create({
      ...new_Admin,
      password: hashed_password,
    });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).lean();
    if (admin) {
      const match = await bcrypt.compare(password, admin.password);
      if (match) {
        const JWT_TOKEN = jwt.sign(
          {
            ...admin,
            password: "",
          },
          process.env.SECRET_KEY
        );
        res.json({ success: true, data: JWT_TOKEN });
      } else {
        next(new Error("Wrong Password"));
      }
    } else {
      next(new Error("Admin not found"));
    }
  } catch (e) {
    next(e);
  }
}
