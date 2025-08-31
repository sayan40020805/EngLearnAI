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
import ExamPage from "../pages/ExamPage";
import NotFound from "../pages/NotFound";
import ChatBox from "../components/ChatBox";
import Contact from "../pages/Contact";
import EnhancedCourseList from "../components/EnhancedCourseList";
import CertificateCourseFinder from "../components/CertificateCourseFinder";
import AllCourseList from "../components/AllCourseList";
import UserProfile from "../pages/UserProfile";
import StreamSelection from "../pages/StreamSelection";
import SemesterSelection from "../pages/SemesterSelection";
import SubjectSelection from "../pages/SubjectSelection";
import NotesOrganizer from "../pages/NotesOrganizer";
import NotesAndOrganizer from "../pages/NotesAndOrganizer";
import "../index.css"; // Global styles
import "../App.css";   // Optional App wrapper styling

export default function AppRoutes() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <ChatBox />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/youtube" element={<YoutubeFetcher />} />
            <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses/:department" element={<DepartmentCourses />} />
          <Route path="/notes/:semester" element={<SemesterNotes />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/enhanced-courses" element={<EnhancedCourseList />} />
          <Route path="/certificate-courses" element={<CertificateCourseFinder />} />
          <Route path="/courses" element={<AllCourseList />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/stream-selection" element={<StreamSelection />} />
          <Route path="/semester-selection/:streamId" element={<SemesterSelection />} />
          <Route path="/subject-selection/:streamId/:semester" element={<SubjectSelection />} />
          <Route path="/notes-organizer/:streamId/:semester/:subject" element={<NotesOrganizer />} />
          <Route path="/notes" element={<NotesAndOrganizer />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
