import React, { useState } from "react";
import emailjs from "emailjs-com";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Remove non-numeric characters
      const numericValue = value.replace(/\D/g, "");
      // Format the number as (999) 999-9999
      const formattedValue = numericValue
        .slice(0, 10)
        .replace(/(\d{3})(\d{3})(\d{1,4})/, (_, p1, p2, p3) => {
          return `(${p1}) ${p2}-${p3}`;
        });
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data to be Sent:", formData); // Log the form data

    // Send data to Flask backend
    fetch("https://portfoliobackend-ih6t.onrender.com/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Saved to backend:", data);
  
        // Send to EmailJS after backend confirmation
        emailjs
          .send(
            "service_ud7473n", // Replace with your EmailJS service ID
            "template_453lw8g", // Replace with your EmailJS template ID
            formData,
            "BDPsT3cNRMnCg-OaU" // Replace with your EmailJS public key
          )
          .then(
            (result) => {
              setStatus("Message sent successfully!");
              setFormData({
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                message: "",
              });
            },
            (error) => {
              console.error("EmailJS error:", error);
              setStatus("Failed to send the message. Please try again later.");
            }
          );
      })
      .catch((error) => {
        console.error("Backend error:", error);
        setStatus("Failed to save the message. Please try again later.");
      });
  };
  

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Message Me</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-2xl "
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-2xl "
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-gray-700">
            Phone (Optional)
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-2xl "
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-2xl"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-700">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-2xl"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-black py-2 rounded hover:bg-purple-700"
        >
          Send Message
        </button>
      </form>
      {status && <p className="mt-4 text-center text-gray-700">{status}</p>}
    </div>
  );
}
