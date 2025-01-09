import React, { useState, useEffect } from "react";

export default function PerformanceForm({ existingData = null, onSuccess }) {
  const [formData, setFormData] = useState(
    existingData || {
      contactId: "", // New field for selecting a contact
      eventName: "",
      eventType: "",
      eventDateTime: "",
      location: "",
      guests: "",
      specialRequests: "",
      price: "",
      status: "Pending", // Default status
    }
  );

  const [contacts, setContacts] = useState([]); // Store list of contacts
  const [status, setStatus] = useState("");

  // Fetch contacts from the backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/contacts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        return response.json();
      })
      .then((data) => setContacts(data))
      .catch((error) => console.error("Error fetching contacts:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine the API endpoint and method
    const apiUrl = existingData
      ? `http://127.0.0.1:5000/performance-bookings/${existingData.id}`
      : "http://127.0.0.1:5000/performance-bookings";
    const method = existingData ? "PATCH" : "POST";

    fetch(apiUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save or update booking");
        }
        return response.json();
      })
      .then((data) => {
        if (onSuccess) {
          onSuccess(data.booking); // Callback to refresh the list or update the UI
        }
        setStatus(
          existingData
            ? "Booking updated successfully!"
            : "Booking created successfully!"
        );
        if (!existingData) {
          setFormData({
            contactId: "",
            eventName: "",
            eventType: "",
            eventDateTime: "",
            location: "",
            guests: "",
            specialRequests: "",
            price: "",
            status: "Pending",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setStatus("Failed to save the booking. Please try again later.");
      });
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {existingData ? "Update Performance Booking" : "Create Performance Booking"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Contact */}
        <div>
          <label htmlFor="contactId" className="block text-gray-700">
            Select Contact
          </label>
          <select
            name="contactId"
            id="contactId"
            value={formData.contactId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-xl bg-gray-800 text-white"
          >
            <option value="">Select a Contact</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {`${contact.first_name} ${contact.last_name}`}
              </option>
            ))}
          </select>
        </div>

        {/* Event Name */}
        <div>
          <label htmlFor="eventName" className="block text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            name="eventName"
            id="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-xl bg-gray-800 text-white"
          />
        </div>

        {/* Event Type */}
        <div>
          <label htmlFor="eventType" className="block text-gray-700">
            Event Type
          </label>
          <select
            name="eventType"
            id="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-xl bg-gray-800 text-white"
          >
            <option value="">Select an Event Type</option>
            <option value="Karaoke">Karaoke</option>
            <option value="DJ Services">DJ Services</option>
            <option value="Live Song Performances">Live Song Performances</option>
          </select>
        </div>

        {/* Event Date & Time */}
        <div>
          <label htmlFor="eventDateTime" className="block text-gray-700">
            Event Date and Time
          </label>
          <input
            type="datetime-local"
            name="eventDateTime"
            id="eventDateTime"
            value={formData.eventDateTime}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-xl bg-gray-800 text-white"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-xl bg-gray-800 text-white"
          />
        </div>

        {/* Number of Guests */}
        <div>
          <label htmlFor="guests" className="block text-gray-700">
            Number of Guests
          </label>
          <input
            type="number"
            name="guests"
            id="guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full p-2 border rounded-xl bg-gray-800 text-white"
          />
        </div>

        {/* Special Requests */}
        <div>
          <label htmlFor="specialRequests" className="block text-gray-700">
            Special Requests
          </label>
          <textarea
            name="specialRequests"
            id="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full p-2 border rounded-xl bg-gray-800 text-white"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded-xl bg-gray-800 text-white"
          />
        </div>

        {/* Status */}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {existingData ? "Update Booking" : "Create Booking"}
        </button>
      </form>
      {status && <p className="mt-4 text-center text-gray-700">{status}</p>}
    </div>
  );
}
