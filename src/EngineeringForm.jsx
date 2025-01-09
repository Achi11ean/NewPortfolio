import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";

export default function EngineeringForm() {
  const [formData, setFormData] = useState({
    contactId: "", // Add contactId
    projectName: "",
    projectType: "",
    projectStartDate: "",
    projectEndDate: "",
    projectDescription: "",
    specialRequests: "",
    price: "",
  });

  const [contacts, setContacts] = useState([]); // Store list of contacts
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Fetch contacts from the backend
    fetch("http://127.0.0.1:5000/contacts")
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) => console.error("Error fetching contacts:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save to Flask Backend
    fetch("http://127.0.0.1:5000/engineering-bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Saved to backend:", data);

        // Reset form and show success message
        setFormData({
          contactId: "",
          projectName: "",
          projectType: "",
          projectStartDate: "",
          projectEndDate: "",
          projectDescription: "",
          specialRequests: "",
          price: "",
        });
        setStatus("Booking request sent successfully!");
      })
      .catch((error) => {
        console.error("Backend error:", error);
        setStatus("Failed to save booking. Please try again later.");
      });
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Engineering Booking</h2>
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

        {/* Project Name */}
        <div>
          <label htmlFor="projectName" className="block text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            name="projectName"
            id="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-xl bg-gray-800 text-white"
          />
        </div>

        {/* Project Type */}
        <div>
          <label htmlFor="projectType" className="block text-gray-700">
            Service Type
          </label>
          <select
            name="projectType"
            id="projectType"
            value={formData.projectType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-xl bg-gray-800 text-white"
          >
            <option value="">Select a Service Type</option>
            <option value="New Website">New Website</option>
            <option value="Dynamic Application">Dynamic Application</option>
            <option value="Enterprise Solution">Enterprise Solution</option>
          </select>
        </div>

        {/* Project Start Date */}
        <div>
          <label htmlFor="projectStartDate" className="block text-gray-700">
            Project Start Date
          </label>
          <input
            type="date"
            name="projectStartDate"
            id="projectStartDate"
            value={formData.projectStartDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-xl bg-gray-800 text-white"
          />
        </div>

        {/* Project End Date */}
        <div>
          <label htmlFor="projectEndDate" className="block text-gray-700">
            Project End Date
          </label>
          <input
            type="date"
            name="projectEndDate"
            id="projectEndDate"
            value={formData.projectEndDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-xl bg-gray-800 text-white"
          />
        </div>

        {/* Project Description */}
        <div>
          <label htmlFor="projectDescription" className="block text-gray-700">
            Project Description
          </label>
          <textarea
            name="projectDescription"
            id="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            placeholder="Provide a detailed description of the project"
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-gray-700">
            Budget Limit
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-800 text-white"
            required
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
            placeholder="Any additional requirements or requests"
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Booking Request
        </button>
      </form>
      {status && <p className="mt-4 text-center text-gray-700">{status}</p>}
    </div>
  );
}
