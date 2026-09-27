
import pool from "../config/db.js";

/*
=========================================================
GET MY PROFILE
=========================================================
*/

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

/*
=========================================================
GET MEMBER DASHBOARD
=========================================================
*/

export const getDashboard = async (req, res) => {
  try {
    /*
    -----------------------------------------------------
    1. MEMBER PROFILE
    -----------------------------------------------------
    */

    const memberResult = await pool.query(
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

    if (memberResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    const member = memberResult.rows[0];

    /*
    -----------------------------------------------------
    2. WORKOUT STATISTICS
    -----------------------------------------------------
    */

    const statsResult = await pool.query(
      `
      SELECT
        COUNT(*) FILTER (
          WHERE status = 'completed'
        )::integer AS completed_workouts,

        COALESCE(
          SUM(calories_burned)
          FILTER (WHERE status = 'completed'),
          0
        )::integer AS calories_burned,

        COALESCE(
          SUM(duration_minutes)
          FILTER (WHERE status = 'completed'),
          0
        )::integer AS workout_minutes,

        COUNT(*) FILTER (
          WHERE status = 'started'
        )::integer AS active_workouts

      FROM workout_logs

      WHERE member_id = $1
      `,
      [member.member_id]
    );

    /*
    -----------------------------------------------------
    3. AVAILABLE WORKOUTS
    -----------------------------------------------------
    */

    const workoutCountResult = await pool.query(
      `
      SELECT COUNT(*)::integer AS total_workouts

      FROM workouts

      WHERE is_active = true
      `
    );

    /*
    -----------------------------------------------------
    4. AVAILABLE EXERCISES
    -----------------------------------------------------
    */

    const exerciseCountResult = await pool.query(
      `
      SELECT COUNT(*)::integer AS total_exercises

      FROM exercises
      `
    );

    /*
    -----------------------------------------------------
    5. RECENT WORKOUTS
    -----------------------------------------------------
    */

    const recentWorkoutsResult = await pool.query(
      `
      SELECT
        wl.id AS log_id,

        wl.workout_id,

        w.name,
        w.category,
        w.difficulty,

        wl.started_at,
        wl.completed_at,
        wl.duration_minutes,
        wl.calories_burned,
        wl.status

      FROM workout_logs AS wl

      LEFT JOIN workouts AS w
        ON w.id = wl.workout_id

      WHERE wl.member_id = $1

      ORDER BY wl.created_at DESC

      LIMIT 5
      `,
      [member.member_id]
    );

    /*
    -----------------------------------------------------
    6. WEEKLY ACTIVITY
    -----------------------------------------------------
    */

    const weeklyActivityResult = await pool.query(
      `
      SELECT
        DATE(created_at) AS workout_date,

        COUNT(*)::integer AS workouts,

        COALESCE(
          SUM(duration_minutes),
          0
        )::integer AS minutes,

        COALESCE(
          SUM(calories_burned),
          0
        )::integer AS calories

      FROM workout_logs

      WHERE member_id = $1

        AND status = 'completed'

        AND created_at >= CURRENT_DATE - INTERVAL '6 days'

      GROUP BY DATE(created_at)

      ORDER BY workout_date ASC
      `,
      [member.member_id]
    );

    /*
    -----------------------------------------------------
    7. RESPONSE
    -----------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      dashboard: {
        member,

        stats: {
          completedWorkouts:
            statsResult.rows[0]?.completed_workouts || 0,

          caloriesBurned:
            statsResult.rows[0]?.calories_burned || 0,

          workoutMinutes:
            statsResult.rows[0]?.workout_minutes || 0,

          activeWorkouts:
            statsResult.rows[0]?.active_workouts || 0,

          availableWorkouts:
            workoutCountResult.rows[0]?.total_workouts || 0,

          availableExercises:
            exerciseCountResult.rows[0]?.total_exercises || 0,
        },

        recentWorkouts:
          recentWorkoutsResult.rows,

        weeklyActivity:
          weeklyActivityResult.rows,
      },
    });
  } catch (error) {
    console.error("Get dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard.",
    });
  }
};

