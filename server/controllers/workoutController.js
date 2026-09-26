import pool from "../config/db.js";

export const getWorkouts = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        description,
        category,
        difficulty,
        duration_minutes,
        calories_burned,
        trainer_id,
        is_active,
        created_at,
        updated_at
      FROM workouts
      WHERE is_active = true
      ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      workouts: result.rows,
    });
  } catch (error) {
    console.error("Get workouts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load workouts.",
    });
  }
};