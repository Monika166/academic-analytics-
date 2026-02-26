import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import HodLogin from "./components/HodLogin";
import AddCo from "./components/AddCo";
import SubjectDetails from "./components/SubjectDetails";
import HodDashboard from "./components/HodDashboard";
import AddSubject from "./components/AddSubject";
import HodAddStudent from "./components/HodAddStudent";
import EditSubject from "./components/EditSubject";

import HodSubjectDetails from "./components/HodSubjectDetails";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/hod-login" element={<HodLogin />} />
        <Route path="/add-co" element={<AddCo />} />
        <Route path="/subject-details" element={<SubjectDetails />} />
        <Route path="/hod-dashboard" element={<HodDashboard />} />
        <Route path="/add-subject" element={<AddSubject />} />
        <Route path="/hod-subject-details" element={<HodSubjectDetails />} />
        <Route path="/hod-add-student" element={<HodAddStudent />} />
        <Route path="/edit-subject" element={<EditSubject />} />
      </Routes>
    </Router>
  );
};

export default App;
