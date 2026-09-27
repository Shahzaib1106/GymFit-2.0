const API_URL = import.meta.env.VITE_API_URL;

const MEMBER_API_URL = `${API_URL}/member`;
const WORKOUT_API_URL = `${API_URL}/workouts`;
const NUTRITION_API_URL = `${API_URL}/nutrition`;
const MEMBERSHIP_API_URL = `${API_URL}/membership`;

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
const error = new Error(
data.message || "Something went wrong."
);

```
if (data.logId) {
  error.logId = data.logId;
}

throw error;
```

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

export const updateMyProfile = async (token, profileData) => {
return request(`${MEMBER_API_URL}/profile`, {
method: "PATCH",
headers: {
Authorization: `Bearer ${token}`,
},
body: JSON.stringify(profileData),
});
};

export const changeMyPassword = async (token, passwordData) => {
return request(`${MEMBER_API_URL}/password`, {
method: "PATCH",
headers: {
Authorization: `Bearer ${token}`,
},
body: JSON.stringify(passwordData),
});
};

export const getDashboard = async (token) => {
return request(`${MEMBER_API_URL}/dashboard`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`,
},
});
};

export const startWorkout = async (token, workoutId) => {
return request(`${MEMBER_API_URL}/workouts/start`, {
method: "POST",
headers: {
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({
workoutId,
}),
});
};

export const completeWorkout = async (token, logId) => {
return request(`${MEMBER_API_URL}/workouts/${logId}/complete`, {
method: "PATCH",
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

export const getExercises = async (token, filters = {}) => {
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

export const getExerciseById = async (token, exerciseId) => {
return request(`${WORKOUT_API_URL}/exercises/${exerciseId}`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`,
},
});
};

export const getNutritionLogs = async (token) => {
return request(NUTRITION_API_URL, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`,
},
});
};

export const createNutritionLog = async (token, mealData) => {
return request(NUTRITION_API_URL, {
method: "POST",
headers: {
Authorization: `Bearer ${token}`,
},
body: JSON.stringify(mealData),
});
};

export const deleteNutritionLog = async (token, logId) => {
return request(`${NUTRITION_API_URL}/${logId}`, {
method: "DELETE",
headers: {
Authorization: `Bearer ${token}`,
},
});
};

export const getMembershipPlans = async (token) => {
return request(`${MEMBERSHIP_API_URL}/plans`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`,
},
});
};

export const getMyMembership = async (token) => {
return request(`${MEMBERSHIP_API_URL}/my`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`,
},
});
};

export const subscribeMembership = async (token, planId) => {
return request(`${MEMBERSHIP_API_URL}/subscribe`, {
method: "POST",
headers: {
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({
planId,
}),
});
};

export const getPaymentHistory = async (token) => {
return request(`${MEMBERSHIP_API_URL}/payments`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`,
},
});
};
