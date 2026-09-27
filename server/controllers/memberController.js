import bcrypt from "bcryptjs";
import pool from "../config/db.js";

export const getMyProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.date_of_birth,
        u.gender,
        u.profile_image,
        u.role,
        u.created_at,
        m.id AS member_id,
        m.fitness_goal,
        m.height_cm,
        m.weight_kg
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
        message: "User profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      profile: result.rows[0],
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load profile.",
    });
  }
};

export const updateMyProfile = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      name,
      phone,
      dateOfBirth,
      gender,
      fitnessGoal,
      heightCm,
      weightKg,
    } = req.body;

    await client.query("BEGIN");

    const userResult = await client.query(
      `
      UPDATE users
      SET
        name = COALESCE(NULLIF($1, ''), name),
        phone = NULLIF($2, ''),
        date_of_birth = NULLIF($3, '')::date,
        gender = NULLIF($4, ''),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING
        id,
        name,
        email,
        phone,
        date_of_birth,
        gender,
        profile_image,
        role,
        created_at
      `,
      [
        name,
        phone,
        dateOfBirth,
        gender,
        req.user.id,
      ]
    );

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await client.query(
      `
      UPDATE members
      SET
        fitness_goal = COALESCE(NULLIF($1, ''), fitness_goal),
        height_cm = CASE
          WHEN $2 IS NULL OR $2 = '' THEN height_cm
          ELSE $2::numeric
        END,
        weight_kg = CASE
          WHEN $3 IS NULL OR $3 = '' THEN weight_kg
          ELSE $3::numeric
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $4
      `,
      [
        fitnessGoal,
        heightCm,
        weightKg,
        req.user.id,
      ]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile: userResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  } finally {
    client.release();
  }
};

export const changeMyPassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters.",
      });
    }

    const result = await pool.query(
      `
      SELECT password_hash
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

    const isMatch = await bcrypt.compare(
      currentPassword,
      result.rows[0].password_hash
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await pool.query(
      `
      UPDATE users
      SET
        password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [hashedPassword, req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password.",
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const memberResult = await pool.query(
      `
      SELECT id
      FROM members
      WHERE user_id = $1
      `,
      [req.user.id]
    );

    if (memberResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found.",
      });
    }

    const memberId = memberResult.rows[0].id;

    const [
      workoutStats,
      recentWorkouts,
      weeklyStats,
    ] = await Promise.all([
      pool.query(
        `
        SELECT
          COUNT(*) FILTER (
            WHERE status = 'completed'
          )::int AS completed_workouts,
          COUNT(*) FILTER (
            WHERE status = 'started'
          )::int AS active_workouts,
          COALESCE(
            SUM(calories_burned)
            FILTER (WHERE status = 'completed'),
            0
          )::int AS calories_burned,
          COALESCE(
            SUM(duration_minutes)
            FILTER (WHERE status = 'completed'),
            0
          )::int AS workout_minutes
        FROM workout_logs
        WHERE member_id = $1
        `,
        [memberId]
      ),

      pool.query(
        `
        SELECT
          wl.id,
          wl.started_at,
          wl.completed_at,
          wl.duration_minutes,
          wl.calories_burned,
          wl.status,
          w.name AS workout_name,
          w.category,
          w.difficulty
        FROM workout_logs AS wl
        LEFT JOIN workouts AS w
          ON w.id = wl.workout_id
        WHERE wl.member_id = $1
        ORDER BY wl.created_at DESC
        LIMIT 10
        `,
        [memberId]
      ),

      pool.query(
        `
        SELECT
          DATE(wl.created_at) AS workout_date,
          COUNT(*) FILTER (
            WHERE wl.status = 'completed'
          )::int AS completed_workouts,
          COALESCE(
            SUM(wl.calories_burned)
            FILTER (WHERE wl.status = 'completed'),
            0
          )::int AS calories_burned,
          COALESCE(
            SUM(wl.duration_minutes)
            FILTER (WHERE wl.status = 'completed'),
            0
          )::int AS workout_minutes
        FROM workout_logs AS wl
        WHERE wl.member_id = $1
          AND wl.created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(wl.created_at)
        ORDER BY workout_date ASC
        `,
        [memberId]
      ),
    ]);

    return res.status(200).json({
      success: true,
      stats: workoutStats.rows[0],
      recentWorkouts: recentWorkouts.rows,
      weeklyStats: weeklyStats.rows,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard.",
    });
  }
};
