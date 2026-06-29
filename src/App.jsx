import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentProfile from "./pages/StudentProfile";
import AlumniProfile from "./pages/AlumniProfile";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";
import StudentEvents from "./pages/StudentEvents";
import AlumniEvents from "./pages/AlumniEvents";
import StudentJobs from "./pages/StudentJobs";
import AlumniJobs from "./pages/AlumniJobs";
import Forum from "./pages/Forum";
import Notifications from "./pages/Notifications";
import ForumQuestion from "./pages/ForumQuestion";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/alumni/profile" element={<AlumniProfile />} />
        <Route path="/student/dashboard" element={<StudentDashboard />}></Route>
        <Route path="/alumni/dashboard" element={<AlumniDashboard />}></Route>
        <Route path="/student/events" element={<StudentEvents />}></Route>
        <Route path="/alumni/events" element={<AlumniEvents />}></Route>
        <Route path="/student/jobs" element={<StudentJobs />}></Route>
        <Route path="/alumni/jobs" element={<AlumniJobs />}></Route>
        <Route path="/forum" element={<Forum />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/forum/question/:id" element={<ForumQuestion />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;