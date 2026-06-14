import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchEvents } from "../services/firestore";

const LAST_CLICKED_KEY = "last_clicked_event";

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const Dashboard = () => {
  const { user, loginTime, expiryTime, logout } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [eventsLoading, setEventsLoading] = useState(true);
  const [lastClickedId, setLastClickedId] = useState(
    localStorage.getItem(LAST_CLICKED_KEY) || null
  );

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleCardClick = (id) => {
    setLastClickedId(id);
    localStorage.setItem(LAST_CLICKED_KEY, id);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="flex items-center gap-4 p-5 border-b border-gray-100">
            <img
              src={user?.photo}
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Active
            </span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <div className="px-5 py-3">
              <p className="text-xs text-gray-400 mb-0.5">Login Time</p>
              <p className="text-sm text-gray-700">{formatTime(loginTime)}</p>
            </div>
            <div className="px-5 py-3">
              <p className="text-xs text-gray-400 mb-0.5">Session Expires</p>
              <p className="text-sm text-gray-700">{formatTime(expiryTime)}</p>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-base font-semibold text-gray-800">Events</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
        </div>

        {eventsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!eventsLoading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No events found.</p>
          </div>
        )}

        {!eventsLoading && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => {
              const isHighlighted = event.id === lastClickedId;
              return (
                <div
                  key={event.id}
                  onClick={() => handleCardClick(event.id)}
                  className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition-all duration-150
                    ${isHighlighted
                      ? "border-blue-500 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm leading-snug">{event.name}</h3>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full ml-2 shrink-0">
                      {event.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">{event.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{event.location}</span>
                    <span>{event.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;