import pool from "../db.js";

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
          u.is_active,
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
        u.is_active,
        u.created_at,
        u.updated_at,
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

export const updateMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false.",
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        is_active = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING
        id,
        name,
        email,
        role,
        is_active,
        updated_at
      `,
      [isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: isActive
        ? "Member activated successfully."
        : "Member deactivated successfully.",
      member: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Admin member status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update member status.",
    });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === Number(req.user.id)) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own admin account.",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING id, name, email, role
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Member deleted successfully.",
      member: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Admin member delete error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete member.",
    });
  }
};

export const getAdminWorkouts = async (
  req,
  res
) => {
  try {
    const result = await pool.query(`
      SELECT
        w.id,
        w.name,
        w.description,
        w.category,
        w.difficulty,
        w.duration_minutes,
        w.calories_burned,
        w.is_active,
        w.created_at,
        w.updated_at,
        COUNT(we.id)::int AS exercise_count
      FROM workouts AS w
      LEFT JOIN workout_exercises AS we
        ON we.workout_id = w.id
      GROUP BY
        w.id,
        w.name,
        w.description,
        w.category,
        w.difficulty,
        w.duration_minutes,
        w.calories_burned,
        w.is_active,
        w.created_at,
        w.updated_at
      ORDER BY w.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      workouts: result.rows,
    });
  } catch (error) {
    console.error(
      "Admin workouts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load workouts.",
    });
  }
};

export const createWorkout = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      difficulty,
      durationMinutes,
      caloriesBurned,
    } = req.body;

    if (!name || !difficulty) {
      return res.status(400).json({
        success: false,
        message:
          "Workout name and difficulty are required.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO workouts (
        name,
        description,
        category,
        difficulty,
        duration_minutes,
        calories_burned,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING
        id,
        name,
        description,
        category,
        difficulty,
        duration_minutes,
        calories_burned,
        is_active,
        created_at
      `,
      [
        name,
        description || null,
        category || null,
        difficulty,
        durationMinutes
          ? Number(durationMinutes)
          : null,
        caloriesBurned
          ? Number(caloriesBurned)
          : null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Workout created successfully.",
      workout: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Admin create workout error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create workout.",
    });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      category,
      difficulty,
      durationMinutes,
      caloriesBurned,
    } = req.body;

    if (!name || !difficulty) {
      return res.status(400).json({
        success: false,
        message:
          "Workout name and difficulty are required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE workouts
      SET
        name = $1,
        description = $2,
        category = $3,
        difficulty = $4,
        duration_minutes = $5,
        calories_burned = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING
        id,
        name,
        description,
        category,
        difficulty,
        duration_minutes,
        calories_burned,
        is_active,
        updated_at
      `,
      [
        name,
        description || null,
        category || null,
        difficulty,
        durationMinutes
          ? Number(durationMinutes)
          : null,
        caloriesBurned
          ? Number(caloriesBurned)
          : null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Workout not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Workout updated successfully.",
      workout: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Admin update workout error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update workout.",
    });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE workouts
      SET
        is_active = false,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, is_active
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Workout not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Workout deactivated successfully.",
      workout: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Admin delete workout error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to deactivate workout.",
    });
  }
};

export const getWorkoutLogs = async (
  req,
  res
) => {
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
    console.error(
      "Admin workout logs error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load workout activity.",
    });
  }
};
