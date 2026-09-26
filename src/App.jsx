import {
BrowserRouter,
Routes,
Route,
Navigate,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import MemberDashboard from "./pages/Member/MemberDashboard.jsx";
import Workouts from "./pages/Member/Workouts.jsx";
import Exercises from "./pages/Member/Exercises.jsx";
import Progress from "./pages/Member/Progress.jsx";
import Nutrition from "./pages/Member/Nutrition.jsx";
import Membership from "./pages/Member/Membership.jsx";
import Profile from "./pages/Member/Profile.jsx";

import { useAuth } from "./context/useAuth.jsx";

function ProtectedRoute({ children }) {
const { user, loading } = useAuth();

if (loading) {
return ( <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white"> <div className="text-center"> <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" /> <p className="text-sm text-gray-400">
Loading GymFit... </p> </div> </div>
);
}

if (!user) {
return <Navigate to="/login" replace />;
}

return children;
}

function App() {
return ( <BrowserRouter> <Routes>
<Route path="/" element={<Home />} />

```
    <Route path="/login" element={<Login />} />

    <Route path="/register" element={<Register />} />

    <Route
      path="/member"
      element={
        <ProtectedRoute>
          <MemberDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/member/workouts"
      element={
        <ProtectedRoute>
          <Workouts />
        </ProtectedRoute>
      }
    />

    <Route
      path="/member/exercises"
      element={
        <ProtectedRoute>
          <Exercises />
        </ProtectedRoute>
      }
    />

    <Route
      path="/member/progress"
      element={
        <ProtectedRoute>
          <Progress />
        </ProtectedRoute>
      }
    />

    <Route
      path="/member/nutrition"
      element={
        <ProtectedRoute>
          <Nutrition />
        </ProtectedRoute>
      }
    />

    <Route
      path="/member/membership"
      element={
        <ProtectedRoute>
          <Membership />
        </ProtectedRoute>
      }
    />

    <Route
      path="/member/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />

    <Route
      path="*"
      element={<Navigate to="/" replace />}
    />
  </Routes>
</BrowserRouter>


);
}

export default App;
