import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentProfile from "./pages/StudentProfile";
import AlumniProfile from "./pages/AlumniProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/alumni/profile" element={<AlumniProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;