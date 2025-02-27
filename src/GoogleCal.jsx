import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "302872606044-uv3vjerbmuoplb5k2pb9qluquic20t72.apps.googleusercontent.com";
const API_KEY = "AIzaSyC-oL00ud_IeoNCsdmTuomXITTCypyJbEE";
const SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

export default function GoogleCalendarManager() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [eventNotes, setEventNotes] = useState(""); // New state for notes
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const [events, setEvents] = useState([]);
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventLocation, setEventLocation] = useState(""); // Optional field
  const [isCreating, setIsCreating] = useState(false);
  const [companyData, setCompanyData] = useState([]); // Store company names from backend
  const [selectedCompany, setSelectedCompany] = useState(""); // User's selected or entered name
  const [editingEvent, setEditingEvent] = useState(null); // Track event being edited
  const editEvent = (event) => {
    setEditingEvent(event); // Store the selected event
    setSelectedCompany(event.summary || ""); // Prefill company name
    setEventLocation(event.location || ""); // Prefill location
    setEventNotes(event.description || ""); // Prefill notes
  
    // Extract date and time from event start & end
    const startDate = new Date(event.start.dateTime);
    setEventDate(startDate.toISOString().split("T")[0]); // Extract YYYY-MM-DD
    setEventStartTime(startDate.toTimeString().slice(0, 5)); // Extract HH:MM
  
    const endDate = new Date(event.end.dateTime);
    setEventEndTime(endDate.toTimeString().slice(0, 5)); // Extract HH:MM
  };
  
  const fetchCompanyData = async () => {
    try {
      const response = await fetch("https://portfoliobackend-ih6t.onrender.com/karaoke_hosting"); // Adjust API URL if needed
      const data = await response.json();
      setCompanyData(data); // Store the entire company object, including location
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };
  
  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [DISCOVERY_DOC],
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen((status) => {
            setIsSignedIn(status);
            if (status) listUpcomingEvents();
          });

          if (authInstance.isSignedIn.get()) {
            listUpcomingEvents();
          }
        });
    };
    gapi.load("client:auth2", initClient);
    fetchCompanyData(); // Fetch company names and locations on page load

  }, []);

  const handleAuthClick = () => gapi.auth2.getAuthInstance().signIn();
  const handleSignOutClick = () => gapi.auth2.getAuthInstance().signOut();

  const listUpcomingEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then((response) => setEvents(response.result.items || []));
  };



  const duplicateBiWeeklyForTwoMonths = async (event) => {
    try {
      const originalStart = new Date(event.start.dateTime);
      const originalEnd = new Date(event.end.dateTime);
  
      let newStart = new Date(originalStart);
      let newEnd = new Date(originalEnd);
  
      for (let i = 0; i < 4; i++) { // Create 4 bi-weekly duplicates (every 14 days)
        newStart.setUTCDate(newStart.getUTCDate() + 14);
        newEnd.setUTCDate(newEnd.getUTCDate() + 14);
  
        const newEvent = {
          summary: event.summary,
          location: event.location || "",
          description: event.description || "",
          start: { dateTime: newStart.toISOString() },
          end: { dateTime: newEnd.toISOString() },
        };
  
        await gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: newEvent,
        });
      }
  
      alert("Event duplicated bi-weekly for 2 months! 🎉");
      listUpcomingEvents(); // Refresh the event list
    } catch (error) {
      console.error("Error duplicating event:", error);
      alert("Failed to duplicate events. Please try again.");
    }
  };
  
  const handleCompanyChange = (e) => {
    const selectedName = e.target.value;
    setSelectedCompany(selectedName);
  
    // Find the corresponding company and update location
    const selectedCompanyObj = companyData.find((c) => c.company_name === selectedName);
    setEventLocation(selectedCompanyObj ? selectedCompanyObj.location : ""); // Auto-fill location
  };
  const duplicateEvent = async (event) => {
    try {
      const originalStart = new Date(event.start.dateTime);
      const originalEnd = new Date(event.end.dateTime);
  
      // Ensure correct addition of 7 days, even if crossing months
      const newStart = new Date(originalStart);
      newStart.setUTCDate(newStart.getUTCDate() + 7);
  
      const newEnd = new Date(originalEnd);
      newEnd.setUTCDate(newEnd.getUTCDate() + 7);
  
      // Create new event with the updated date
      const newEvent = {
        summary: event.summary,
        location: event.location || "",
        description: event.description || "",
        start: { dateTime: newStart.toISOString() },
        end: { dateTime: newEnd.toISOString() },
      };
  
      await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: newEvent,
      });
  
      alert("Event duplicated successfully! 🎉");
      listUpcomingEvents(); // Refresh the event list
    } catch (error) {
      console.error("Error duplicating event:", error);
      alert("Failed to duplicate event. Please try again.");
    }
  };
  
  const duplicateWeeklyForMonth = async (event) => {
    try {
      const originalStart = new Date(event.start.dateTime);
      const originalEnd = new Date(event.end.dateTime);
  
      let newStart = new Date(originalStart);
      let newEnd = new Date(originalEnd);
  
      for (let i = 0; i < 4; i++) { // Create 4 weekly duplicates
        newStart.setUTCDate(newStart.getUTCDate() + 7);
        newEnd.setUTCDate(newEnd.getUTCDate() + 7);
  
        const newEvent = {
          summary: event.summary,
          location: event.location || "",
          description: event.description || "",
          start: { dateTime: newStart.toISOString() },
          end: { dateTime: newEnd.toISOString() },
        };
  
        await gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: newEvent,
        });
      }
  
      alert("Event duplicated weekly for a month! 🎉");
      listUpcomingEvents(); // Refresh the event list
    } catch (error) {
      console.error("Error duplicating event:", error);
      alert("Failed to duplicate events. Please try again.");
    }
  };
  
  const createEvent = async () => {
    if (!selectedCompany || !eventDate || !eventStartTime || !eventEndTime) {
      alert("Please enter a title, date, start time, and end time.");
      return;
    }
  
    setIsCreating(true);
  
    const startDateTime = new Date(`${eventDate}T${eventStartTime}`);
    const endDateTime = new Date(`${eventDate}T${eventEndTime}`);
  
    if (endDateTime <= startDateTime) {
      alert("End time must be later than start time.");
      setIsCreating(false);
      return;
    }
  
    const eventDetails = {
      summary: selectedCompany,
      location: eventLocation || "",
      start: { dateTime: startDateTime.toISOString() },
      end: { dateTime: endDateTime.toISOString() },
      description: eventNotes.length > 0 ? eventNotes : undefined,
    };
  
    try {
      if (editingEvent) {
        // 🛠 Updating an existing event
        await gapi.client.calendar.events.update({
          calendarId: "primary",
          eventId: editingEvent.id,
          resource: eventDetails,
        });
  
        alert("Event updated successfully! ✏️");
  
        // ✅ Update state immediately to reflect changes
        setEvents((prevEvents) =>
          prevEvents.map((ev) =>
            ev.id === editingEvent.id ? { ...ev, ...eventDetails } : ev
          )
        );
      } else {
        // ➕ Creating a new event
        const response = await gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: eventDetails,
        });
  
        alert("Event created successfully! 🎉");
  
        // ✅ Add new event to state immediately
        setEvents((prevEvents) => [...prevEvents, response.result]);
      }
  
      // ✅ Refresh event list from API
      listUpcomingEvents();
  
      // ✅ Reset form fields
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Please try again.");
    }
  
    setIsCreating(false);
  };
  
  // Reset form after editing or creating an event
  const resetForm = () => {
    setEditingEvent(null);
    setSelectedCompany("");
    setEventDate("");
    setEventStartTime("");
    setEventEndTime("");
    setEventLocation("");
    setEventNotes("");
  };
  

  const deleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await gapi.client.calendar.events.delete({
        calendarId: "primary",
        eventId: eventId,
      });

      listUpcomingEvents();
    }
  };
  const openFullCalendar = () => {
    window.open("https://calendar.google.com/calendar/u/0/r", "_blank");
  };
  return (
    <div className="   min-h-screen flex flex-col mt-3 items-center">


{!isSignedIn ? (
  // Show Sign In button if the user is not signed in
  <button
    onClick={handleAuthClick}
    className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
  >
    Sign In with Google
  </button>
) : (
  <div className="w-full max-w-6xl">
    {/* Sign Out Button */}
    <div className="flex justify-end mb-4">
      <button
        onClick={handleSignOutClick}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
      >
        Sign Out
      </button>
    </div>

    {/* 📅 Event Creation + Calendar */}
    <div className=" border-2 border-white bg-gradient-to-br from-green-800 to-green-500 p-6 rounded-lg shadow-lg">
      <button
        onClick={() => setShowCreateEvent(!showCreateEvent)}
        className="bg-yellow-500 text-black font-bold px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition mb-4"
      >
        {showCreateEvent ? "Hide Event Creator" : "Create a New Event"}
      </button>

      {showCreateEvent && (
        <div className="bg-gradient-to-br from-green-800 to-green-500 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Create a New Event</h3>

          <label className="block text-center text-white font-bold">Company Name:</label>
          <select
            className="border p-2 bg-yellow-800/40 rounded w-full mb-3"
            value={selectedCompany}
            onChange={handleCompanyChange}
          >
            <option value="">-- Select a Company --</option>
            {companyData.map((company, index) => (
              <option key={index} value={company.company_name}>
                {company.company_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Or Enter a New Company Name"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="border  bg-yellow-800/40 p-2 rounded w-full mb-3"
          />

          <input
            type="text"
            placeholder="Location (Auto-Filled)"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            className="border p-2 bg-yellow-800/40 rounded w-full mb-3"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="border p-2 bg-yellow-800/40 rounded w-full"
            />
            <input
              type="time"
              value={eventStartTime}
              onChange={(e) => setEventStartTime(e.target.value)}
              className="border p-2 bg-yellow-800/40 rounded w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <input
              type="time"
              value={eventEndTime}
              onChange={(e) => setEventEndTime(e.target.value)}
              className="border bg-yellow-800/40 p-2 rounded w-full"
            />
          </div>

          <textarea
            placeholder="Enter any notes (optional)"
            value={eventNotes}
            onChange={(e) => setEventNotes(e.target.value)}
            className="border p-2 bg-yellow-800/40 rounded w-full mt-3"
          ></textarea>

          <button
            onClick={createEvent}
            disabled={isCreating}
            className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            {isCreating ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
          </button>
          
        </div>
      )}

      {/* 🗓️ Embedded Google Calendar */}

      <iframe
        src="https://calendar.google.com/calendar/embed?src=jwhit.pro%40gmail.com&ctz=America%2FNew_York"
        style={{ border: "1px solid #ccc", width: "100%", height: "400px" }}
        frameBorder="0"
        scrolling="no"
        className="rounded-lg shadow-md"
      ></iframe>
    </div>
    <button
        onClick={openFullCalendar}
        className="w-full border-2 border-white bg-green-600/40 text-white font-bold px-4 underline  shadow-md hover:bg-blue-700 transition"
      >
        📅 Open Full Calendar
      </button>

    {/* 📆 Upcoming Events */}
    <div className="text-center max-w-3xl mx-auto justify-center items-center flex flex-col">
    <h3 className="text-3xl font-extrabold mb-1 text-white mt-10 bg-gradient-to-r from-green-600 via-green-500 to-green-400 
               shadow-lg shadow-green-500/50 rounded-2xl p-5 
               border-2 border-white/20 backdrop-blur-md 
               transition-all duration-300 transform hover:scale-105">
  🌟 Upcoming Bookings 🌟
</h3>

      <div className="space-y-4 max-h-[400px] overflow-y-auto w-full bg-white p-4 rounded-lg shadow-md">
        {events.length === 0 ? (
          <p className="text-gray-500">No upcoming events.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-gray-100 p-4 rounded-lg shadow-md relative">
                <h4 className="text-lg font-semibold text-gray-800">{event.summary}</h4>
                <p className="text-gray-600">📍 {event.location || "No location"}</p>
                <p className="text-gray-600">
                  📅 {new Date(event.start.dateTime).toLocaleString()} -{" "}
                  {new Date(event.end.dateTime).toLocaleString()}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => duplicateEvent(event)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-sm hover:bg-blue-600 transition"
                  >
                    ➕ Weekly x1
                  </button>

                  <button
                    onClick={() => duplicateWeeklyForMonth(event)}
                    className="bg-purple-500 text-white px-3 py-1 rounded-lg shadow-sm hover:bg-purple-600 transition"
                  >
                    📆 Weekly for 1Mo
                  </button>

                  <button
                    onClick={() => duplicateBiWeeklyForTwoMonths(event)}
                    className="bg-orange-500 text-white px-3 py-1 rounded-lg shadow-sm hover:bg-orange-600 transition"
                  >
                    📆 Bi-Weekly for 2Mo
                  </button>

                  <button
                    onClick={() => editEvent(event)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow-sm hover:bg-yellow-600 transition"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-sm hover:bg-red-600 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}
<div className="w-full h-2 bg-gradient-to-r from-pink-500 via-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-full shadow-lg my-6"></div>

    </div>
  );
  
}
