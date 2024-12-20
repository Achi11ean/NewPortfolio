import React, { useState } from "react";
import emailjs from "emailjs-com";

export default function EngineeringForm() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    projectName: "",
    projectManager: "",
    projectType: "",
    projectStartDate: "",
    projectEndDate: "",
    projectDescription: "",
    projectTimeline: "",
    projectScope: "",
    specialRequests: "",
    budgetRange: "",
    price: "",
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
  
    const formattedStartDate = formatDate(formData.projectStartDate);
    const formattedEndDate = formatDate(formData.projectEndDate);
  
    // Save to Flask Backend
    fetch("https://portfoliobackend-ih6t.onrender.com/engineering-bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        projectStartDate: formattedStartDate,
        projectEndDate: formattedEndDate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Saved to backend:", data);
  
        // Send the email using EmailJS
        emailjs
          .send(
            "service_ud7473n", // Replace with your EmailJS service ID
            "template_kh68swe", // Replace with your EmailJS template ID
            {
              clientName: formData.clientName,
              clientEmail: formData.clientEmail,
              clientPhone: formData.clientPhone,
              projectName: formData.projectName,
              projectManager: formData.projectManager,
              projectType: formData.projectType,
              projectStartDate: formattedStartDate,
              projectEndDate: formattedEndDate,
              projectDescription: formData.projectDescription,
              specialRequests: formData.specialRequests,
              price: `$${formData.price}`,
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
                projectName: "",
                projectManager: "",
                projectType: "",
                projectStartDate: "",
                projectEndDate: "",
                projectDescription: "",
                projectTimeline: "",
                projectScope: "",
                specialRequests: "",
                budgetRange: "",
                price: "",
              });
            },
            (error) => {
              console.error("EmailJS error:", error);
              setStatus("Failed to send the email. Please try again later.");
            }
          );
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
        {/* Client Name */}
        <div>
          <label htmlFor="clientName" className="block text-gray-700">
            Client Name
          </label>
          <input
            type="text"
            name="clientName"
            id="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>

        {/* Client Email */}
        <div>
          <label htmlFor="clientEmail" className="block text-gray-700">
            Client Email
          </label>
          <input
            type="email"
            name="clientEmail"
            id="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>

        {/* Client Phone */}
        <div>
          <label htmlFor="clientPhone" className="block text-gray-700">
            Client Phone
          </label>
          <input
            type="tel"
            name="clientPhone"
            id="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-800 text-gray-700"
          />
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
            className="w-full p-2 border rounded bg-gray-800 text-black"
          />
        </div>

        {/* Project Manager */}
        <div>
          <label htmlFor="projectManager" className="block text-gray-700">
            Project Manager
          </label>
          <input
            type="text"
            name="projectManager"
            id="projectManager"
            value={formData.projectManager}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-800 text-black"
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
            className="w-full p-2 border rounded bg-gray-800 text-black"
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
            className="w-full p-2 border rounded bg-gray-800 text-black"
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
            className="w-full p-2 border rounded bg-gray-800 text-black"
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
            className="w-full p-2 border rounded bg-gray-800 text-black"
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
            className="w-full p-2 border rounded bg-gray-800 text-black"
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
            className="w-full p-2 border rounded bg-gray-800 text-black"
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
