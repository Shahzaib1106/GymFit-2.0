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

export const getDashboard = async (req, res) => {
  try {
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
      INNER JOIN members AS m
        ON m.user_id = u.id
      WHERE u.id = $1
      `,
      [req.user.id]
    );

    if (memberResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found.",
      });
    }

    const member = memberResult.rows[0];

    const statsResult = await pool.query(
      `
      SELECT
        COUNT(*) FILTER (
          WHERE status = 'completed'
        )::int AS "completedWorkouts",

        COALESCE(
          SUM(calories_burned) FILTER (
            WHERE status = 'completed'
          ),
          0
        )::int AS "caloriesBurned",

        COALESCE(
          SUM(duration_minutes) FILTER (
            WHERE status = 'completed'
          ),
          0
        )::int AS "workoutMinutes",

        COUNT(*) FILTER (
          WHERE status = 'started'
        )::int AS "activeWorkouts"

      FROM workout_logs
      WHERE member_id = $1
      `,
      [member.member_id]
    );

    const availableResult = await pool.query(
      `
      SELECT
        (SELECT COUNT(*) FROM workouts WHERE is_active = true)::int
          AS "availableWorkouts",

        (SELECT COUNT(*) FROM exercises)::int
          AS "availableExercises"
      `
    );

    const recentResult = await pool.query(
      `
      SELECT
        wl.id,
        wl.workout_id,
        w.name AS workout_name,
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

    const weeklyResult = await pool.query(
      `
      SELECT
        days.date,
        COALESCE(activity.workouts, 0)::int AS workouts,
        COALESCE(activity.calories, 0)::int AS calories,
        COALESCE(activity.minutes, 0)::int AS minutes
      FROM (
        SELECT
          CURRENT_DATE - series.day AS date
        FROM generate_series(0, 6) AS series(day)
      ) AS days
      LEFT JOIN (
        SELECT
          DATE(completed_at) AS date,
          COUNT(*)::int AS workouts,
          COALESCE(SUM(calories_burned), 0)::int AS calories,
          COALESCE(SUM(duration_minutes), 0)::int AS minutes
        FROM workout_logs
        WHERE member_id = $1
          AND status = 'completed'
          AND completed_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(completed_at)
      ) AS activity
        ON activity.date = days.date
      ORDER BY days.date ASC
      `,
      [member.member_id]
    );

    return res.status(200).json({
      success: true,
      dashboard: {
        member,
        stats: {
          ...statsResult.rows[0],
          ...availableResult.rows[0],
        },
        recentWorkouts: recentResult.rows,
        weeklyActivity: weeklyResult.rows,
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

export const startWorkout = async (req, res) => {
  try {
    const { workoutId } = req.body;

    if (!workoutId) {
      return res.status(400).json({
        success: false,
        message: "Workout ID is required.",
      });
    }

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

    const workoutResult = await pool.query(
      `
      SELECT
        id,
        name,
        calories_burned,
        duration_minutes
      FROM workouts
      WHERE id = $1
        AND is_active = true
      `,
      [workoutId]
    );

    if (workoutResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Workout not found.",
      });
    }

    const activeResult = await pool.query(
      `
      SELECT id
      FROM workout_logs
      WHERE member_id = $1
        AND status = 'started'
      ORDER BY started_at DESC
      LIMIT 1
      `,
      [memberId]
    );

    if (activeResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "You already have an active workout.",
        logId: activeResult.rows[0].id,
      });
    }

    const result = await pool.query(
      `
      INSERT INTO workout_logs (
        member_id,
        workout_id,
        started_at,
        status
      )
      VALUES (
        $1,
        $2,
        CURRENT_TIMESTAMP,
        'started'
      )
      RETURNING
        id,
        member_id,
        workout_id,
        started_at,
        status
      `,
      [memberId, workoutId]
    );

    return res.status(201).json({
      success: true,
      message: "Workout started successfully.",
      workoutLog: result.rows[0],
    });
  } catch (error) {
    console.error("Start workout error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start workout.",
    });
  }
};

export const completeWorkout = async (req, res) => {
  try {
    const { logId } = req.params;

    if (!logId) {
      return res.status(400).json({
        success: false,
        message: "Workout log ID is required.",
      });
    }

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

    const activeLogResult = await pool.query(
      `
      SELECT
        wl.id,
        wl.workout_id,
        wl.started_at,
        w.calories_burned AS estimated_calories
      FROM workout_logs AS wl
      LEFT JOIN workouts AS w
        ON w.id = wl.workout_id
      WHERE wl.id = $1
        AND wl.member_id = $2
        AND wl.status = 'started'
      `,
      [logId, memberId]
    );

    if (activeLogResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Active workout session not found.",
      });
    }

    const activeLog = activeLogResult.rows[0];

    const durationResult = await pool.query(
      `
      SELECT GREATEST(
        1,
        CEIL(
          EXTRACT(
            EPOCH FROM (
              CURRENT_TIMESTAMP - $1::timestamp
            )
          ) / 60
        )
      )::int AS duration_minutes
      `,
      [activeLog.started_at]
    );

    const durationMinutes =
      durationResult.rows[0].duration_minutes;

    const caloriesBurned =
      activeLog.estimated_calories || 0;

    const result = await pool.query(
      `
      UPDATE workout_logs
      SET
        completed_at = CURRENT_TIMESTAMP,
        duration_minutes = $1,
        calories_burned = $2,
        status = 'completed'
      WHERE id = $3
        AND member_id = $4
      RETURNING
        id,
        member_id,
        workout_id,
        started_at,
        completed_at,
        duration_minutes,
        calories_burned,
        status
      `,
      [
        durationMinutes,
        caloriesBurned,
        logId,
        memberId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Workout completed successfully.",
      workoutLog: result.rows[0],
    });
  } catch (error) {
    console.error("Complete workout error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete workout.",
    });
  }
};