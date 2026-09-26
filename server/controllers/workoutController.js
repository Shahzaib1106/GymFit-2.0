
import pool from "../config/db.js";

export const getWorkouts = async (req, res) => {
  try {
    const result = await pool.query(`
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
      ORDER BY id ASC
    `);

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

export const getWorkoutById = async (req, res) => {
  try {
    const { id } = req.params;

    const workoutResult = await pool.query(
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
        is_active
      FROM workouts
      WHERE id = $1
        AND is_active = true
      `,
      [id]
    );

    if (workoutResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Workout not found.",
      });
    }

    const exercisesResult = await pool.query(
      `
      SELECT
        we.id AS workout_exercise_id,
        we.sets,
        we.repetitions,
        we.duration_seconds,
        we.weight_kg,
        we.rest_seconds,
        we.exercise_order,

        e.id AS exercise_id,
        e.name,
        e.category,
        e.muscle_group,
        e.difficulty,
        e.instructions,
        e.video_url

      FROM workout_exercises AS we

      INNER JOIN exercises AS e
        ON e.id = we.exercise_id

      WHERE we.workout_id = $1

      ORDER BY we.exercise_order ASC
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      workout: {
        ...workoutResult.rows[0],
        exercises: exercisesResult.rows,
      },
    });
  } catch (error) {
    console.error("Get workout by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load workout details.",
    });
  }
};

export const getExercises = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;

    const conditions = [];
    const values = [];

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    if (difficulty) {
      values.push(difficulty);
      conditions.push(`difficulty = $${values.length}`);
    }

    if (search) {
      values.push(`%${search}%`);

      conditions.push(`
        (
          name ILIKE $${values.length}
          OR muscle_group ILIKE $${values.length}
          OR category ILIKE $${values.length}
        )
      `);
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        category,
        muscle_group,
        difficulty,
        instructions,
        video_url,
        created_at,
        updated_at
      FROM exercises
      ${whereClause}
      ORDER BY name ASC
      `,
      values
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      exercises: result.rows,
    });
  } catch (error) {
    console.error("Get exercises error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load exercises.",
    });
  }
};

export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        category,
        muscle_group,
        difficulty,
        instructions,
        video_url,
        created_at,
        updated_at
      FROM exercises
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found.",
      });
    }

    return res.status(200).json({
      success: true,
      exercise: result.rows[0],
    });
  } catch (error) {
    console.error("Get exercise by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load exercise.",
    });
  }
};

