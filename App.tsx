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
import BatchPage from "./components/BatchPage";
import PrincipalLogin from "./components/PrincipalLogin";
import PrincipalDashboard from "./components/PrincipalDashboard";
import HodSubjectDetails from "./components/HodSubjectDetails";
import CoDetails from "./components/CoDetails";
import SelectSubjectForMarks from "./components/SelectSubjectForMarks";
import CoManagement from "./components/CoManagement";
import AddPOPSO from "./components/AddPOPSO";
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
        <Route path="/batch" element={<BatchPage />} />
        <Route path="/principal-login" element={<PrincipalLogin />} />
        <Route path="/test" element={<h1>TEST WORKING</h1>} />
        <Route path="/principal-dashboard" element={<PrincipalDashboard />} />
        <Route path="/co-details" element={<CoDetails />} />
        <Route path="/co-management" element={<CoManagement />} />
        <Route path="/add-po-pso" element={<AddPOPSO />} />

        <Route
          path="/select-subject-marks"
          element={<SelectSubjectForMarks />}
        />
      </Routes>
    </Router>
  );
};

export default App;
