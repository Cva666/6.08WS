import express from "express";
import jwt from "jsonwebtoken";
import { loginUser } from "#db/queries/helpers/users";
import { createUser } from "#db/queries/users";

const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "supersecret_jwt_key_for_development";

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).send("Username and password are required.");
    }

    const user = await loginUser(username, password);
    if (!user) {
      return res.status(401).send("Invalid username or password.");
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.send(token); // Send token as plain text
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).send("Username and password are required.");
    }

    const user = await createUser(username, password);
    const token = jwt.sign({ id: user.id }, JWT_SECRET);

    res.status(201).send(token); // Send token as plain text
  } catch (error) {
    next(error);
  }
});

export default router;
