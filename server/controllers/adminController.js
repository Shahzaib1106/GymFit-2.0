import pool from "../config/db.js";

export const getDashboard = async (req, res) => {
  try {
    const [
      membersResult,
      workoutsResult,
      exercisesResult,
      sessionsResult,
      caloriesResult,
      recentMembersResult,
    ] = await Promise.all([
      pool.query(`
        SELECT COUNT(*)::int AS total
        FROM members
      `),

      pool.query(`
        SELECT COUNT(*)::int AS total
        FROM workouts
        WHERE is_active = true
      `),

      pool.query(`
        SELECT COUNT(*)::int AS total
        FROM exercises
      `),

      pool.query(`
        SELECT
          COUNT(*) FILTER (
            WHERE status = 'completed'
          )::int AS completed,

          COUNT(*) FILTER (
            WHERE status = 'started'
          )::int AS active,

          COUNT(*)::int AS total
        FROM workout_logs
      `),

      pool.query(`
        SELECT
          COALESCE(
            SUM(calories_burned) FILTER (
              WHERE status = 'completed'
            ),
            0
          )::int AS total
        FROM workout_logs
      `),

      pool.query(`
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
        ORDER BY u.created_at DESC
        LIMIT 8
      `),
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        stats: {
          totalMembers: membersResult.rows[0].total,
          activeWorkouts: sessionsResult.rows[0].active,
          completedWorkouts: sessionsResult.rows[0].completed,
          totalWorkouts: workoutsResult.rows[0].total,
          totalExercises: exercisesResult.rows[0].total,
          totalCalories: caloriesResult.rows[0].total,
          totalSessions: sessionsResult.rows[0].total,
        },
        recentMembers: recentMembersResult.rows,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard.",
    });
  }
};

export const getMembers = async (req, res) => {
  try {
    const result = await pool.query(`
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
      ORDER BY u.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      members: result.rows,
    });
  } catch (error) {
    console.error("Admin members error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load members.",
    });
  }
};

export const getWorkoutLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        wl.id,
        wl.member_id,
        wl.workout_id,
        wl.started_at,
        wl.completed_at,
        wl.duration_minutes,
        wl.calories_burned,
        wl.status,
        u.name AS member_name,
        u.email AS member_email,
        w.name AS workout_name,
        w.category,
        w.difficulty
      FROM workout_logs AS wl
      INNER JOIN members AS m
        ON m.id = wl.member_id
      INNER JOIN users AS u
        ON u.id = m.user_id
      LEFT JOIN workouts AS w
        ON w.id = wl.workout_id
      ORDER BY wl.created_at DESC
      LIMIT 100
    `);

    return res.status(200).json({
      success: true,
      logs: result.rows,
    });
  } catch (error) {
    console.error("Admin workout logs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load workout activity.",
    });
  }
};