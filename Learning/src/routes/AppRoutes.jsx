import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import About from "../pages/About";
import Navbar from "../components/Navbar";
import DepartmentCourses from "../pages/DepartmentCourses";
import SemesterNotes from "../pages/SemesterNotes";
import ExamPage from "../pages/ExamPage";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses/:department" element={<DepartmentCourses />} />
        <Route path="/notes/:semester" element={<SemesterNotes />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
