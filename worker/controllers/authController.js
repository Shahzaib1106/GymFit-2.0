import bcrypt from "bcryptjs";
import pool from "../db.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  const client = await pool.connect();

  try {
    const { name, email, password, phone, dateOfBirth, gender, fitnessGoal } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await client.query("BEGIN");

    const userResult = await client.query(
      "INSERT INTO users (name, email, password_hash, role, phone, date_of_birth, gender) VALUES ($1, $2, $3, 'member', $4, $5, $6) RETURNING id, name, email, role, phone, date_of_birth, gender, created_at",
      [
        name.trim(),
        normalizedEmail,
        passwordHash,
        phone || null,
        dateOfBirth || null,
        gender || null
      ]
    );

    const user = userResult.rows[0];

    await client.query(
      "INSERT INTO members (user_id, fitness_goal) VALUES ($1, $2)",
      [user.id, fitnessGoal || null]
    );

    await client.query("COMMIT");

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Registration rollback error:", rollbackError);
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create account."
    });
  } finally {
    await client.release();
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      "SELECT id, name, email, password_hash, role, phone, date_of_birth, gender, is_active, created_at FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated."
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    delete user.password_hash;

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login."
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, phone, date_of_birth, gender, is_active, created_at, updated_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    return res.status(200).json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user."
    });
  }
};
