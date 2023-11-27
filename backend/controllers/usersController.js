import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";

export async function signup(req, res, next) {
  try {
    const new_user = req.body;
    const { password: plain_password } = new_user;
    const user = await User.findOne({ email: new_user.email });
    if (user) {
      return res.status(400).json({ message: "email already exists!!!" });
    }
    const hashed_password = await bcrypt.hash(plain_password, 10);
    const result = await User.create({
      ...new_user,
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
    const user = await User.findOne({ email }).lean();
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const JWT_TOKEN = jwt.sign(
          {
            ...user,
            password: "",
          },
          process.env.SECRET_KEY_USER
        );
        res.json({ success: true, data: JWT_TOKEN });
      } else {
        next(new Error("Wrong Password"));
      }
    } else {
      next(new Error("User not found"));
    }
  } catch (e) {
    next(e);
  }
}

export async function getAllUser(req, res, next) {
  try {
    const result = await User.find({});
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function addUser(req, res, next) {
  try {
    const new_user = req.body;
    const result = await User.create(new_user);
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function getUserbyID(req, res, next) {
  try {
    const { user_id } = req.params;
    const result = await User.findOne({ _id: user_id });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function updateUserByID(req, res, next) {
  try {
    const { user_id } = req.params;
    const { name, phone_number, email, address } = req.body;
    const result = await User.updateOne(
      { _id: user_id },
      {
        $set: {
          name: name,
          email: email,
          phone_number: phone_number,
          address: address,
        },
      }
    );
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function deleteUserByID(req, res, next) {
  try {
    const { user_id } = req.params;
    const result = await User.deleteOne({ _id: user_id });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}
