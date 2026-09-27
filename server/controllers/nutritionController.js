import pool from "../config/db.js";

export const getNutritionLogs = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        nl.id,
        nl.member_id,
        nl.meal_type,
        nl.food_name,
        nl.calories,
        nl.protein_g,
        nl.carbohydrates_g,
        nl.fats_g,
        nl.quantity,
        nl.consumed_at,
        nl.logged_at
      FROM nutrition_logs AS nl
      INNER JOIN members AS m
        ON m.id = nl.member_id
      WHERE m.user_id = $1
      ORDER BY nl.logged_at DESC
      `,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      logs: result.rows,
    });
  } catch (error) {
    console.error("Nutrition logs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load nutrition logs.",
    });
  }
};

export const createNutritionLog = async (req, res) => {
  try {
    const {
      mealName,
      mealType,
      calories,
      proteinG,
      carbsG,
      fatsG,
      quantity,
    } = req.body;

    if (!mealName || !mealType) {
      return res.status(400).json({
        success: false,
        message: "Food name and meal type are required.",
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

    const result = await pool.query(
      `
      INSERT INTO nutrition_logs (
        member_id,
        meal_type,
        food_name,
        calories,
        protein_g,
        carbohydrates_g,
        fats_g,
        quantity,
        consumed_at,
        logged_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING
        id,
        member_id,
        meal_type,
        food_name,
        calories,
        protein_g,
        carbohydrates_g,
        fats_g,
        quantity,
        consumed_at,
        logged_at
      `,
      [
        memberId,
        mealType,
        mealName,
        Number(calories) || 0,
        Number(proteinG) || 0,
        Number(carbsG) || 0,
        Number(fatsG) || 0,
        quantity || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Meal logged successfully.",
      log: result.rows[0],
    });
  } catch (error) {
    console.error("Create nutrition log error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create nutrition log.",
    });
  }
};

export const deleteNutritionLog = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM nutrition_logs AS nl
      USING members AS m
      WHERE nl.id = $1
        AND nl.member_id = m.id
        AND m.user_id = $2
      RETURNING nl.id
      `,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nutrition log not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meal deleted successfully.",
    });
  } catch (error) {
    console.error("Delete nutrition log error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete nutrition log.",
    });
  }
};