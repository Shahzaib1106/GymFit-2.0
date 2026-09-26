const MEMBER_API_URL = "http://localhost:5000/api/member";
const WORKOUT_API_URL = "http://localhost:5000/api/workouts";

export const getMyProfile = async (token) => {
  const response = await fetch(`${MEMBER_API_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load member profile."
    );
  }

  return data;
};

export const getWorkouts = async (token) => {
  const response = await fetch(WORKOUT_API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load workouts."
    );
  }

  return data;
};