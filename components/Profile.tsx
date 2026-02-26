import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, User, Briefcase, Lock, Camera } from "lucide-react";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
  const facultyId = localStorage.getItem("faculty_id");

  if (!facultyId) {
    navigate("/login");
    return;
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/profile/${facultyId}/`
      );

      const data = await response.json();

      if (response.ok) {
        setFullName(data.full_name);
        setEmail(data.email);
        setPhone(data.phone);
        setDesignation(data.designation);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  fetchProfile();
}, []);

const handleUpdatePassword = async () => {
  console.log("Button clicked");
  const facultyId = localStorage.getItem("faculty_id");

  if (!facultyId) {
    alert("User not logged in");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match");
    return;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/update-password/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faculty_id: parseInt(facultyId),
          current_password: currentPassword,
          new_password: newPassword,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Error updating password:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <div className="relative w-32 h-32 mx-auto">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={50} className="text-gray-400" />
            </div>
            <div className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer">
              <Camera size={18} className="text-white" />
            </div>
          </div>

          <h2 className="mt-4 text-xl font-semibold">Prof. {fullName}</h2>
          <p className="text-gray-500">{designation}</p>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <Mail size={16} />
              {email}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone size={16} />
              {phone}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* PERSONAL INFO CARD */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2 mt-1">
                  <User size={16} />
                  <input
                    type="text"
                    value={fullName}
                    readOnly
                    className="outline-none w-full bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Email Address</label>
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2 mt-1">
                  <Mail size={16} />
                  <input
                    type="text"
                    value={email}
                    readOnly
                    className="outline-none w-full bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Phone Number</label>
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2 mt-1">
                  <Phone size={16} />
                  <input
                    type="text"
                    value={phone}
                    readOnly
                    className="outline-none w-full bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Designation</label>
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2 mt-1">
                  <Briefcase size={16} />
                  <input
                    type="text"
                    value={designation}
                    //readOnly
                    className="outline-none w-full bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECURITY CARD */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Security & Password</h2>

            <div className="space-y-4">
              <input
  type="password"
  placeholder="Current Password"
  value={currentPassword}
  onChange={(e) => setCurrentPassword(e.target.value)}
  className="w-full border rounded-xl px-3 py-2"
/>

<input
  type="password"
  placeholder="New Password"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  className="w-full border rounded-xl px-3 py-2"
/>

<input
  type="password"
  placeholder="Confirm New Password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  className="w-full border rounded-xl px-3 py-2"
/>

              <button
               type="button" 
  onClick={handleUpdatePassword}
  className="bg-blue-900 text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-800"
>
  Update Password
</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
