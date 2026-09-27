import pool from "../db.js";

export const getMembershipPlans = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        price,
        description,
        features,
        is_active
      FROM membership_plans
      WHERE is_active = true
      ORDER BY price ASC
    `);

    return res.status(200).json({
      success: true,
      plans: result.rows,
    });
  } catch (error) {
    console.error("Membership plans error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load membership plans.",
    });
  }
};

export const getMyMembership = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        mm.id,
        mm.member_id,
        mm.plan_id,
        mm.start_date,
        mm.end_date,
        mm.status,
        mp.name AS plan_name,
        mp.price,
        mp.description,
        mp.features
      FROM member_memberships AS mm
      INNER JOIN members AS m
        ON m.id = mm.member_id
      INNER JOIN membership_plans AS mp
        ON mp.id = mm.plan_id
      WHERE m.user_id = $1
      ORDER BY mm.created_at DESC
      LIMIT 1
      `,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      membership: result.rows[0] || null,
    });
  } catch (error) {
    console.error("My membership error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load membership.",
    });
  }
};

export const subscribeMembership = async (req, res) => {
  const client = await pool.connect();

  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required.",
      });
    }

    const memberResult = await client.query(
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

    const planResult = await client.query(
      `
      SELECT
        id,
        name,
        price,
        is_active
      FROM membership_plans
      WHERE id = $1
      `,
      [planId]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found.",
      });
    }

    const plan = planResult.rows[0];

    if (!plan.is_active) {
      return res.status(400).json({
        success: false,
        message: "This membership plan is not available.",
      });
    }

    const memberId = memberResult.rows[0].id;

    await client.query("BEGIN");

    await client.query(
      `
      UPDATE member_memberships
      SET
        status = 'cancelled',
        updated_at = CURRENT_TIMESTAMP
      WHERE member_id = $1
        AND status = 'active'
      `,
      [memberId]
    );

    const membershipResult = await client.query(
      `
      INSERT INTO member_memberships (
        member_id,
        plan_id,
        start_date,
        status
      )
      VALUES (
        $1,
        $2,
        CURRENT_DATE,
        'active'
      )
      RETURNING
        id,
        member_id,
        plan_id,
        start_date,
        end_date,
        status
      `,
      [memberId, plan.id]
    );

    const membership = membershipResult.rows[0];

    await client.query(
      `
      INSERT INTO membership_payments (
        membership_id,
        amount,
        payment_method,
        payment_status
      )
      VALUES ($1, $2, 'manual', 'paid')
      `,
      [membership.id, plan.price]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: `${plan.name} membership activated successfully.`,
      membership: {
        ...membership,
        plan_name: plan.name,
        price: plan.price,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Subscribe membership error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to activate membership.",
    });
  } finally {
    client.release();
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        mp.id,
        mp.amount,
        mp.payment_method,
        mp.payment_status,
        mp.paid_at,
        mpl.name AS plan_name
      FROM membership_payments AS mp
      INNER JOIN member_memberships AS mm
        ON mm.id = mp.membership_id
      INNER JOIN members AS m
        ON m.id = mm.member_id
      INNER JOIN membership_plans AS mpl
        ON mpl.id = mm.plan_id
      WHERE m.user_id = $1
      ORDER BY mp.paid_at DESC
      `,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      payments: result.rows,
    });
  } catch (error) {
    console.error("Payment history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load payment history.",
    });
  }
};
