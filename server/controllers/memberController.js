import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const getMemberId = async (userId) => {
  const result = await pool.query(
    `
    SELECT id
    FROM members
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0]?.id || null;
};

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
        u.is_active,
        u.created_at,
        m.id AS member_id,
        m.membership_status,
        m.height_cm,
        m.weight_kg,
        m.fitness_goal,
        m.emergency_contact_name,
        m.emergency_contact_phone,
        m.joined_at
      FROM users u
      LEFT JOIN members m
        ON m.user_id = u.id
      WHERE u.id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    const member = result.rows[0];

    let age = null;

    if (member.date_of_birth) {
      const birthDate = new Date(member.date_of_birth);
      const today = new Date();

      age =
        today.getFullYear() -
        birthDate.getFullYear();

      const monthDifference =
        today.getMonth() -
        birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 &&
          today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
    }

    return res.status(200).json({
      success: true,
      member: {
        ...member,
        age,
        height: member.height_cm,
        weight: member.weight_kg,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);

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
      age,
      height,
      weight,
      fitness_goal,
      profile_image,
    } = req.body;

    await client.query("BEGIN");

    let dateOfBirth = null;

    if (age !== null && age !== undefined && age !== "") {
      const numericAge = Number(age);

      if (
        Number.isNaN(numericAge) ||
        numericAge < 1 ||
        numericAge > 120
      ) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Invalid age.",
        });
      }

      const currentYear = new Date().getFullYear();
      dateOfBirth = `${currentYear - numericAge}-01-01`;
    }

    await client.query(
      `
      UPDATE users
      SET
        name = COALESCE($1, name),
        phone = $2,
        date_of_birth = $3,
        profile_image = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      `,
      [
        name || null,
        phone || null,
        dateOfBirth,
        profile_image || null,
        req.user.id,
      ]
    );

    const memberId = await getMemberId(req.user.id);

    if (!memberId) {
      await client.query(
        `
        INSERT INTO members (
          user_id,
          membership_status,
          height_cm,
          weight_kg,
          fitness_goal
        )
        VALUES ($1, 'active', $2, $3, $4)
        `,
        [
          req.user.id,
          height || null,
          weight || null,
          fitness_goal || null,
        ]
      );
    } else {
      await client.query(
        `
        UPDATE members
        SET
          height_cm = $1,
          weight_kg = $2,
          fitness_goal = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        `,
        [
          height || null,
          weight || null,
          fitness_goal || null,
          memberId,
        ]
      );
    }

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Profile update error:", error);

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
        message:
          "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters.",
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

    const valid = await bcrypt.compare(
      currentPassword,
      result.rows[0].password_hash
    );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const passwordHash = await bcrypt.hash(
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
      [passwordHash, req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Password change error:", error);

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
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.profile_image,
        u.created_at,
        m.id AS member_id,
        m.membership_status,
        m.height_cm,
        m.weight_kg,
        m.fitness_goal
      FROM users u
      INNER JOIN members m
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
    const memberId = member.member_id;

    const [
      workoutStats,
      recentWorkouts,
      weeklyStats,
      availableWorkouts,
      availableExercises,
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
        FROM workout_logs wl
        LEFT JOIN workouts w
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
        FROM workout_logs wl
        WHERE wl.member_id = $1
          AND wl.created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(wl.created_at)
        ORDER BY workout_date ASC
        `,
        [memberId]
      ),

      pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM workouts
        WHERE is_active = true
        `
      ),

      pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM exercises
        `
      ),
    ]);

    const stats = workoutStats.rows[0];

    return res.status(200).json({
      success: true,
      dashboard: {
        member: {
          id: member.id,
          memberId: member.member_id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          profileImage: member.profile_image,
          membershipStatus:
            member.membership_status,
          height: member.height_cm,
          weight: member.weight_kg,
          fitnessGoal: member.fitness_goal,
          createdAt: member.created_at,
        },

        stats: {
          completedWorkouts:
            stats.completed_workouts || 0,
          caloriesBurned:
            stats.calories_burned || 0,
          workoutMinutes:
            stats.workout_minutes || 0,
          activeWorkouts:
            stats.active_workouts || 0,
          availableWorkouts:
            availableWorkouts.rows[0].count || 0,
          availableExercises:
            availableExercises.rows[0].count || 0,
        },

        recentWorkouts:
          recentWorkouts.rows,

        weeklyActivity:
          weeklyStats.rows,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

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

    const memberId = await getMemberId(req.user.id);

    if (!memberId) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found.",
      });
    }

    const workout = await pool.query(
      `
      SELECT id, name, calories_burned
      FROM workouts
      WHERE id = $1
        AND is_active = true
      `,
      [workoutId]
    );

    if (workout.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Workout not found.",
      });
    }

    const activeWorkout = await pool.query(
      `
      SELECT id
      FROM workout_logs
      WHERE member_id = $1
        AND status = 'started'
      LIMIT 1
      `,
      [memberId]
    );

    if (activeWorkout.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You already have an active workout.",
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
      RETURNING *
      `,
      [memberId, workoutId]
    );

    return res.status(201).json({
      success: true,
      message: "Workout started.",
      log: result.rows[0],
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

    const memberId = await getMemberId(req.user.id);

    if (!memberId) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found.",
      });
    }

    const result = await pool.query(
      `
      UPDATE workout_logs wl
      SET
        completed_at = CURRENT_TIMESTAMP,
        duration_minutes = GREATEST(
          1,
          ROUND(
            EXTRACT(
              EPOCH FROM (
                CURRENT_TIMESTAMP - wl.started_at
              )
            ) / 60
          )::int
        ),
        calories_burned = COALESCE(
          w.calories_burned,
          0
        ),
        status = 'completed'
      FROM workouts w
      WHERE wl.id = $1
        AND wl.member_id = $2
        AND wl.workout_id = w.id
        AND wl.status = 'started'
      RETURNING wl.*
      `,
      [logId, memberId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Active workout log not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Workout completed.",
      log: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Complete workout error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to complete workout.",
    });
  }
};