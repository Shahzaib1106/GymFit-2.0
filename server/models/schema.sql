-- ============================================================
-- GymFit 2.0
-- PostgreSQL Database Schema
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'member'
        CHECK (role IN ('member', 'trainer', 'admin')),

    phone VARCHAR(30),

    date_of_birth DATE,

    gender VARCHAR(20),

    profile_image TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- MEMBERS
-- ============================================================

CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,

    user_id INTEGER UNIQUE NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    membership_status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (
            membership_status IN (
                'active',
                'expired',
                'cancelled',
                'pending'
            )
        ),

    height_cm NUMERIC(5,2),

    weight_kg NUMERIC(5,2),

    fitness_goal VARCHAR(100),

    emergency_contact_name VARCHAR(100),

    emergency_contact_phone VARCHAR(30),

    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- TRAINERS
-- ============================================================

CREATE TABLE IF NOT EXISTS trainers (
    id SERIAL PRIMARY KEY,

    user_id INTEGER UNIQUE NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    specialization VARCHAR(150),

    experience_years INTEGER DEFAULT 0,

    bio TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- MEMBERSHIP PLANS
-- ============================================================

CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    description TEXT,

    duration_months INTEGER NOT NULL,

    price NUMERIC(10,2) NOT NULL,

    features JSONB DEFAULT '[]'::jsonb,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- MEMBER MEMBERSHIPS
-- ============================================================

CREATE TABLE IF NOT EXISTS memberships (
    id SERIAL PRIMARY KEY,

    member_id INTEGER NOT NULL
        REFERENCES members(id)
        ON DELETE CASCADE,

    plan_id INTEGER NOT NULL
        REFERENCES plans(id),

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (
            status IN (
                'active',
                'expired',
                'cancelled',
                'pending'
            )
        ),

    amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- EXERCISES
-- ============================================================

CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    category VARCHAR(100),

    muscle_group VARCHAR(100),

    difficulty VARCHAR(30),

    instructions TEXT,

    video_url TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- WORKOUTS
-- ============================================================

CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    description TEXT,

    category VARCHAR(100),

    difficulty VARCHAR(30),

    duration_minutes INTEGER,

    calories_burned INTEGER,

    trainer_id INTEGER
        REFERENCES trainers(id)
        ON DELETE SET NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- WORKOUT EXERCISES
-- ============================================================

CREATE TABLE IF NOT EXISTS workout_exercises (
    id SERIAL PRIMARY KEY,

    workout_id INTEGER NOT NULL
        REFERENCES workouts(id)
        ON DELETE CASCADE,

    exercise_id INTEGER NOT NULL
        REFERENCES exercises(id)
        ON DELETE CASCADE,

    sets INTEGER,

    repetitions INTEGER,

    duration_seconds INTEGER,

    weight_kg NUMERIC(6,2),

    rest_seconds INTEGER,

    exercise_order INTEGER NOT NULL DEFAULT 1,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- WORKOUT LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS workout_logs (
    id SERIAL PRIMARY KEY,

    member_id INTEGER NOT NULL
        REFERENCES members(id)
        ON DELETE CASCADE,

    workout_id INTEGER
        REFERENCES workouts(id)
        ON DELETE SET NULL,

    started_at TIMESTAMP,

    completed_at TIMESTAMP,

    duration_minutes INTEGER,

    calories_burned INTEGER,

    status VARCHAR(20) NOT NULL DEFAULT 'completed'
        CHECK (
            status IN (
                'started',
                'completed',
                'cancelled'
            )
        ),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- PROGRESS
-- ============================================================

CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,

    member_id INTEGER NOT NULL
        REFERENCES members(id)
        ON DELETE CASCADE,

    weight_kg NUMERIC(5,2),

    body_fat_percentage NUMERIC(5,2),

    muscle_mass_kg NUMERIC(5,2),

    chest_cm NUMERIC(6,2),

    waist_cm NUMERIC(6,2),

    hips_cm NUMERIC(6,2),

    notes TEXT,

    recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- NUTRITION LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS nutrition_logs (
    id SERIAL PRIMARY KEY,

    member_id INTEGER NOT NULL
        REFERENCES members(id)
        ON DELETE CASCADE,

    meal_type VARCHAR(50),

    food_name VARCHAR(150),

    calories INTEGER,

    protein_g NUMERIC(7,2),

    carbohydrates_g NUMERIC(7,2),

    fats_g NUMERIC(7,2),

    quantity VARCHAR(100),

    consumed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,

    member_id INTEGER NOT NULL
        REFERENCES members(id)
        ON DELETE CASCADE,

    membership_id INTEGER
        REFERENCES memberships(id)
        ON DELETE SET NULL,

    amount NUMERIC(10,2) NOT NULL,

    payment_method VARCHAR(50),

    transaction_reference VARCHAR(150),

    status VARCHAR(20) NOT NULL DEFAULT 'paid'
        CHECK (
            status IN (
                'pending',
                'paid',
                'failed',
                'refunded'
            )
        ),

    paid_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- ATTENDANCE
-- ============================================================

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,

    member_id INTEGER NOT NULL
        REFERENCES members(id)
        ON DELETE CASCADE,

    check_in TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    check_out TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_role
ON users(role);

CREATE INDEX IF NOT EXISTS idx_members_user_id
ON members(user_id);

CREATE INDEX IF NOT EXISTS idx_memberships_member_id
ON memberships(member_id);

CREATE INDEX IF NOT EXISTS idx_memberships_status
ON memberships(status);

CREATE INDEX IF NOT EXISTS idx_workout_logs_member_id
ON workout_logs(member_id);

CREATE INDEX IF NOT EXISTS idx_progress_member_id
ON progress(member_id);

CREATE INDEX IF NOT EXISTS idx_nutrition_logs_member_id
ON nutrition_logs(member_id);

CREATE INDEX IF NOT EXISTS idx_payments_member_id
ON payments(member_id);

CREATE INDEX IF NOT EXISTS idx_attendance_member_id
ON attendance(member_id);


-- ============================================================
-- DEFAULT MEMBERSHIP PLANS
-- ============================================================

INSERT INTO plans (
    name,
    description,
    duration_months,
    price,
    features
)
SELECT
    'Basic',
    'Essential gym access for consistent training.',
    1,
    2500,
    '[
        "Gym Access",
        "Basic Workout Plans",
        "Progress Tracking"
    ]'::jsonb
WHERE NOT EXISTS (
    SELECT 1 FROM plans WHERE name = 'Basic'
);


INSERT INTO plans (
    name,
    description,
    duration_months,
    price,
    features
)
SELECT
    'Pro',
    'Complete training and fitness tracking experience.',
    3,
    6500,
    '[
        "Gym Access",
        "Personalized Workouts",
        "Progress Tracking",
        "Nutrition Tracking"
    ]'::jsonb
WHERE NOT EXISTS (
    SELECT 1 FROM plans WHERE name = 'Pro'
);


INSERT INTO plans (
    name,
    description,
    duration_months,
    price,
    features
)
SELECT
    'Elite',
    'Advanced membership with premium fitness support.',
    6,
    11500,
    '[
        "Unlimited Gym Access",
        "Personalized Workouts",
        "Nutrition Tracking",
        "Trainer Support",
        "Advanced Progress Analytics"
    ]'::jsonb
WHERE NOT EXISTS (
    SELECT 1 FROM plans WHERE name = 'Elite'
);