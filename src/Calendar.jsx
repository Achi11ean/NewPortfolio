import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDates = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/bookings/dates");
        const data = response.data;

        if (!Array.isArray(data)) {
          console.error("Unexpected response format:", data);
          setError("Unexpected API response");
          return;
        }

        const formattedEvents = data.map((item) => ({
          id: item.id,
          title: `${item.type}`,
          start: new Date(item.start),
          end: new Date(item.end),
          status: item.status,
          description: item.description,
          contact: item.contact,
        }));

        setEvents(formattedEvents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching booking dates:", err);
        setError("Failed to load booking dates.");
        setLoading(false);
      }
    };

    fetchBookingDates();
  }, []);

  const localizer = momentLocalizer(moment);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  if (loading) return <p className="text-center text-xl font-bold text-white">⏳ Loading calendar...</p>;
  if (error) return <p className="text-center text-red-500 text-xl font-bold">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-3xl shadow-xl border border-gray-700 relative">
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
        📅 Event Calendar
      </h2>

      {/* Responsive Calendar Wrapper */}
      <div className="relative">
        {/* Toolbar Fix: Ensure buttons wrap correctly on mobile */}
        <style>
          {`
            .rbc-toolbar {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 8px;
            }
            
            .rbc-toolbar button {
              flex: 1 1 auto;
              min-width: 45px;
              max-width: 120px;
              padding:  1px;
              font-size: 0.75rem; /* Reduced font size */
              font-weight: bold;
              border-radius: 6px;
              transition: all 0.2s ease-in-out;
              text-align: center;
            }

            .rbc-toolbar button:hover {
              background: rgba(255, 255, 255, 0.2);
            }

            .rbc-toolbar button.rbc-active {
              background: linear-gradient(to right, #ff7eb3, #ff758c);
              color: white;
            }
          `}
        </style>

        {/* Calendar Component */}
        <div className="overflow-hidden bg-white bg-opacity-20 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-lg">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            defaultView="month"
            onSelectEvent={handleEventClick}
            style={{
              height: 500,
              borderRadius: "12px",
              padding: "10px",
              color: "#333",
            }}
            eventPropGetter={(event) => {
              let backgroundColor = "#4A90E2"; // Default blue

              if (event.type === "Engineering") backgroundColor = "#4CAF50"; // Green
              if (event.type === "Performance") backgroundColor = "#E74C3C"; // Red
              if (event.status === "Pending") backgroundColor = "#F39C12"; // Orange

              return {
                style: { backgroundColor, color: "white", borderRadius: "6px", padding: "4px" },
              };
            }}
          />
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 z-50">
          <div className="w-full max-w-md sm:max-w-lg bg-gray-900 text-white p-6 rounded-2xl shadow-lg relative">
            <h3 className="text-2xl font-bold mb-4 text-center">📌 Event Details</h3>

            <p className="mb-2">
              <strong>🛠 Service Type:</strong> {selectedEvent.title}
            </p>
            <p className="mb-2">
              <strong>📅 Status:</strong> {selectedEvent.status}
            </p>

            <p className="mb-2">
              <strong>📖 Description:</strong>
            </p>
            <div className="max-h-32 overflow-y-auto bg-gray-800 p-3 rounded-lg text-sm">
              {selectedEvent.description}
            </div>

            {/* Contact Details */}
            {selectedEvent.contact && (
              <div className="mt-4">
                <p>
                  <strong>👤 Contact Name:</strong> {selectedEvent.contact.first_name} {selectedEvent.contact.last_name}
                </p>
                <p>
                  <strong>📧 Email:</strong> {selectedEvent.contact.email}
                </p>
                <p>
                  <strong>📞 Phone:</strong> {selectedEvent.contact.phone || "N/A"}
                </p>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
