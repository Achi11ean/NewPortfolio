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
        const response = await axios.get("https://portfoliobackend-ih6t.onrender.com/api/bookings/dates");
        const data = response.data;

        // Ensure data is an array
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
            contact: item.contact, // Include contact details
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

  if (loading) return <p>Loading calendar...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md">
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
    background: "linear-gradient(135deg, #74ebd5, #ACB6E5)", // Gradient background
    borderRadius: "12px",
    padding: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    color: "#333", // Ensure date numbers remain visible
  }}
  eventPropGetter={(event) => {
    let backgroundColor = "blue"; // Default color
    if (event.type === "Engineering") backgroundColor = "green";
    if (event.type === "Performance") backgroundColor = "red";
    if (event.status === "Pending") backgroundColor = "blue";

    return {
      style: { backgroundColor, color: "white", borderRadius: "4px" },
    };
  }}
/>

{selectedEvent && (
  <div className="mt-6 p-6 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg shadow-lg">
    <h3 className="text-2xl font-bold mb-4">Event Details</h3>

    <p>
      <strong>Service Type:</strong> {selectedEvent.title}
    </p>
    <p>
      <strong>Status:</strong> {selectedEvent.status}
    </p>
    <p>
  <strong>Description:</strong>
</p>
<div
  style={{
    maxHeight: "50px", // Limit the height to 150px
    overflowY: "auto", // Add vertical scrolling
    padding: "5px", // Add some padding for better readability
    borderRadius: "8px", // Smooth corners
  }}
>
  {selectedEvent.description}
</div>

    {selectedEvent.contact && (
      <>
        <p>
          <strong>Contact Name:</strong> {selectedEvent.contact.first_name}{" "}
          {selectedEvent.contact.last_name}
        </p>
        <p>
          <strong>Email:</strong> {selectedEvent.contact.email}
        </p>
        <p>
          <strong>Phone:</strong> {selectedEvent.contact.phone || "N/A"}
        </p>
      </>
    )}
    <button
      onClick={() => setSelectedEvent(null)}
      className="mt-6 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded"
    >
      Close
    </button>
  </div>
)}

    </div>
  );
};

export default Calendar;
