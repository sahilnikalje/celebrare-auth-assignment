import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, loginTime, expiryTime, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-6 border-b border-gray-100">
            <img
              src={user?.photo}
              alt={user?.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <Row label="Login Status" value={<span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>} />
            <Row label="Login Time" value={formatTime(loginTime)} />
            <Row label="Session Expires" value={formatTime(expiryTime)} />
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Session automatically expires 24 hours after login
        </p>
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between px-6 py-3.5">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm text-gray-800">{value}</span>
  </div>
);

export default Dashboard;