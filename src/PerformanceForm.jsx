import React, { useState } from "react";
import emailjs from "emailjs-com";

export default function PerformanceForm() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventName: "",
    eventType: "",
    eventDateTime: "",
    location: "",
    guests: "",
    specialRequests: "",
    priceRange: "",
  });

  const [status, setStatus] = useState("");

  const formatPhoneNumber = (value) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = numericValue
      .slice(0, 10)
      .replace(/(\d{3})(\d{3})(\d{1,4})/, (_, area, prefix, line) => {
        return `(${area}) ${prefix}-${line}`;
      });
    return formattedValue;
  };

  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "clientPhone") {
      setFormData({ ...formData, [name]: formatPhoneNumber(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formattedDateTime = formatDate(formData.eventDateTime);
  
    // Save to Flask Backend
    fetch("https://portfoliobackend-ih6t.onrender.com/performance-bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        eventDateTime: formattedDateTime, // Format the date
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Saved to backend:", data);
  
        // Send the email via EmailJS
        emailjs
          .send(
            "service_ud7473n", // Replace with your EmailJS service ID
            "template_lv1nzud", // Replace with your EmailJS template ID
            {
              clientName: formData.clientName,
              clientEmail: formData.clientEmail,
              clientPhone: formData.clientPhone,
              eventName: formData.eventName,
              eventType: formData.eventType,
              eventDateTime: formattedDateTime,
              location: formData.location,
              guests: formData.guests,
              specialRequests: formData.specialRequests,
              priceRange: formData.priceRange,
            },
            "BDPsT3cNRMnCg-OaU" // Replace with your EmailJS public key
          )
          .then(
            (result) => {
              setStatus("Booking request sent successfully!");
              setFormData({
                clientName: "",
                clientEmail: "",
                clientPhone: "",
                eventName: "",
                eventType: "",
                eventDateTime: "",
                location: "",
                guests: "",
                specialRequests: "",
                priceRange: "",
              });
            },
            (error) => {
              console.error("EmailJS error:", error);
              setStatus("Failed to send the booking request. Please try again later.");
            }
          );
      })
      .catch((error) => {
        console.error("Backend error:", error);
        setStatus("Failed to save the booking. Please try again later.");
      });
  };
  
  return (
    <div className="bg-gray-100 p-6 rounded-2xl shadow-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Performance Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Name */}
        <div>
          <label htmlFor="clientName" className="block text-center text-gray-700">
            Client Information
          </label>
          <input
            type="text"
            name="clientName"
            placeholder="First Name, Last Name"
            id="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full p-2 border text-center rounded-2xl bg-gray-800 text-white"
          />
        </div>

        {/* Client Email */}
        <div>

          <input
            type="email"
            name="clientEmail"
            placeholder="Enter Email Address "
            id="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            required
            className="w-full p-2 border text-center rounded-2xl bg-gray-800 text-white"
          />
        </div>

        {/* Client Phone */}
        <div>

          <input
            type="tel"
            name="clientPhone"
            placeholder="Enter Phone Number"
            id="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            className="w-full p-2 border text-center rounded-2xl bg-gray-800 text-white"
          />
        </div>

        {/* Event Name */}
        <div>
          <label htmlFor="eventName" className="block text-center text-gray-700">
            Event Information
          </label>
          <input
            type="text"
            name="eventName"
            placeholder="Event Name"
            id="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
            className="w-full p-2 border text-center rounded-2xl bg-gray-800 text-white"
          />
        </div>

        {/* Event Type */}
        <div>

          <select
            name="eventType"
            id="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
            className="w-full p-2 border text-center rounded-2xl bg-gray-800 text-white"
          >
            <option value="">Select a Service for the Event</option>
            <option value="Karaoke">Karaoke</option>
            <option value="DJ Services">DJ Services</option>
            <option value="Live Song Performances">Live Song Performances</option>
          </select>
        </div>

        {/* Event Date & Time */}
        <div>
          <label htmlFor="eventDateTime" className="block text-center text-gray-700">
            Event Date and Time
          </label>
          <input
            type="datetime-local"
            name="eventDateTime"
            id="eventDateTime"
            value={formData.eventDateTime}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-2xl text-center bg-gray-800 text-white"
          />
        </div>

        {/* Location */}
        <div>

          <input
            type="text"
            placeholder="Address/Location"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-2xl text-center bg-gray-800 text-white"
          />
        </div>

        {/* Number of Guests */}
        <div>
          <input
            type="number"
            placeholder="Number of Guests (approx)"
            name="guests"
            id="guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full p-2 border rounded-2xl text-center bg-gray-800 text-white"
          />
        </div>

        {/* Special Requests */}
        <div>
          <textarea
            name="specialRequests"
            placeholder="Special Requests/Accomodations: e.g. 4 microphones, special song request"
            id="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full p-2 border rounded-2xl bg-gray-800 text-white text-center"
          />
        </div>

        {/* Price Range */}
        <div>
          <label htmlFor="priceRange" className="block text-gray-700">
            Budget Limit
          </label>
          <input
            type="text"
            name="priceRange"
            id="priceRange"
            value={formData.priceRange}
            onChange={handleChange}
            placeholder="400"
            className="w-full p-2 border rounded-2xl bg-gray-800 text-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Submit Booking Request
        </button>
      </form>
      {status && <p className="mt-4 text-center text-gray-700">{status}</p>}
    </div>
  );
}
