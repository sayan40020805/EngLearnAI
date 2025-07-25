import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import About from "../pages/About";
import Navbar from "../components/Navbar";
import DepartmentCourses from "../pages/DepartmentCourses";
import YoutubeFetcher from "../components/YoutubeFetcher";
import SemesterNotes from "../pages/SemesterNotes";
import ProgressBar from "../components/ProgressBar";
import ExamPage from "../pages/ExamPage";
import NotFound from "../pages/NotFound";
import ChatBox from "../components/ChatBox"; // 🟢 Import ChatBox
import Contact from "../pages/Contact";

export default function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <ChatBox /> {/* 🟢 Add here to appear on all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path = "/contact" element={<Contact/>} />
        <Route path="/youtube" element={<YoutubeFetcher />} />
        <Route path="/progressbar" element={<ProgressBar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses/:department" element={<DepartmentCourses />} />
        <Route path="/notes/:semester" element={<SemesterNotes />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
