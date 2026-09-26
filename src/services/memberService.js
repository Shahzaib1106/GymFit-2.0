
const MEMBER_API_URL = "http://localhost:5000/api/member";
const WORKOUT_API_URL = "http://localhost:5000/api/workouts";

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong."
    );
  }

  return data;
};

export const getMyProfile = async (token) => {
  return request(`${MEMBER_API_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getWorkouts = async (token) => {
  return request(WORKOUT_API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getWorkoutById = async (token, workoutId) => {
  return request(`${WORKOUT_API_URL}/${workoutId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getExercises = async (
  token,
  filters = {}
) => {
  const params = new URLSearchParams();

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.difficulty) {
    params.set("difficulty", filters.difficulty);
  }

  if (filters.search) {
    params.set("search", filters.search);
  }

  const query = params.toString();

  return request(
    `${WORKOUT_API_URL}/exercises${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getExerciseById = async (
  token,
  exerciseId
) => {
  return request(
    `${WORKOUT_API_URL}/exercises/${exerciseId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
