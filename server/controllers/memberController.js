import pool from "../config/db.js";

export const getMyProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.created_at,
        m.id AS member_id,
        m.fitness_goal
      FROM users AS u
      LEFT JOIN members AS m
        ON m.user_id = u.id
      WHERE u.id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      member: result.rows[0],
    });
  } catch (error) {
    console.error("Get member profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load member profile.",
    });
  }
};