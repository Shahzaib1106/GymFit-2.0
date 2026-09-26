
import bcrypt from "bcryptjs";

import pool from "../config/db.js";
import generateToken from "../utils/generateToken.js";

/*
============================================================
REGISTER
POST /api/auth/register
============================================================
*/
export const register = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      name,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      fitnessGoal,
    } = req.body;

    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // --------------------------------------------------------
    // Check existing user
    // --------------------------------------------------------

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // --------------------------------------------------------
    // Hash password
    // --------------------------------------------------------

    const passwordHash = await bcrypt.hash(password, 12);

    // --------------------------------------------------------
    // Transaction
    // --------------------------------------------------------

    await client.query("BEGIN");

    // --------------------------------------------------------
    // Create user
    // --------------------------------------------------------

    const userResult = await client.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role,
        phone,
        date_of_birth,
        gender
      )
      VALUES ($1, $2, $3, 'member', $4, $5, $6)
      RETURNING
        id,
        name,
        email,
        role,
        phone,
        date_of_birth,
        gender,
        created_at
      `,
      [
        name.trim(),
        normalizedEmail,
        passwordHash,
        phone || null,
        dateOfBirth || null,
        gender || null,
      ]
    );

    const user = userResult.rows[0];

    // --------------------------------------------------------
    // Create member profile
    // --------------------------------------------------------

    await client.query(
      `
      INSERT INTO members (
        user_id,
        fitness_goal
      )
      VALUES ($1, $2)
      `,
      [user.id, fitnessGoal || null]
    );

    await client.query("COMMIT");

    // --------------------------------------------------------
    // Generate JWT
    // --------------------------------------------------------

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
    });
  } finally {
    client.release();
  }
};

/*
============================================================
LOGIN
POST /api/auth/login
============================================================
*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // --------------------------------------------------------
    // Find user
    // --------------------------------------------------------

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password_hash,
        role,
        phone,
        date_of_birth,
        gender,
        is_active,
        created_at
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    // --------------------------------------------------------
    // Check active status
    // --------------------------------------------------------

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated.",
      });
    }

    // --------------------------------------------------------
    // Compare password
    // --------------------------------------------------------

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // --------------------------------------------------------
    // Remove password hash from response
    // --------------------------------------------------------

    delete user.password_hash;

    // --------------------------------------------------------
    // Generate JWT
    // --------------------------------------------------------

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
};

/*
============================================================
GET CURRENT USER
GET /api/auth/me
============================================================
*/
export const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        phone,
        date_of_birth,
        gender,
        is_active,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user.",
    });
  }
};