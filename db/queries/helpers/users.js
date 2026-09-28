import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByUsername } from "#db/queries/users";

export async function loginUser(username, password) {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }
  return user;
}

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized: Missing or invalid token.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret =
      process.env.JWT_SECRET || "supersecret_jwt_key_for_development";
    const payload = jwt.verify(token, secret);

    req.user = { id: payload.id };
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized: Invalid or expired token.");
  }
}
