import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import StudentMentorship from "./pages/StudentMentorship";
import StudentJobs from "./pages/StudentJobs";
import StudentEvents from "./pages/StudentEvents";

import AlumniDashboard from "./pages/AlumniDashboard";
import AlumniProfile from "./pages/AlumniProfile";
import AlumniMentorship from "./pages/AlumniMentorship";
import AlumniJobs from "./pages/AlumniJobs";
import AlumniEvents from "./pages/AlumniEvents";

import Forum from "./pages/Forum";
import ForumQuestion from "./pages/ForumQuestion";
import Notifications from "./pages/Notifications";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingState from "./components/LoadingState";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/profile"
          element={<StudentProfile />}
        />

        <Route
          path="/student/mentorships"
          element={<StudentMentorship />}
        />

        <Route
          path="/student/jobs"
          element={<StudentJobs />}
        />

        <Route
          path="/student/events"
          element={<StudentEvents />}
        />

        <Route
          path="/alumni/dashboard"
          element={<AlumniDashboard />}
        />

        <Route
          path="/alumni/profile"
          element={<AlumniProfile />}
        />

        <Route
          path="/alumni/mentorships"
          element={<AlumniMentorship />}
        />

        <Route
          path="/alumni/jobs"
          element={<AlumniJobs />}
        />

        <Route
          path="/alumni/events"
          element={<AlumniEvents />}
        />

        <Route
          path="/alumni/student/:studentId"
          element={<StudentProfile />}
        />

        <Route
          path="/forum"
          element={<Forum />}
        />

        <Route
          path="/forum/question/:id"
          element={<ForumQuestion />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="*"
          element={
            <LoadingState
              title="Page not found"
              subtitle="This route does not match any page in the portal."
            />
          }
        />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
