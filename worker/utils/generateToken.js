import jwt from "jsonwebtoken";
import { env } from "cloudflare:workers";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;
