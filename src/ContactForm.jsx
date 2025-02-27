import React, { useState } from "react";
import emailjs from "emailjs-com";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    first_Name: "",  
    last_Name: "",   
    phone: "",
    email: "",
    message: "",
    status: "Pending",
  });
  
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      const formattedValue = numericValue
        .slice(0, 10)
        .replace(/(\d{3})(\d{3})(\d{1,4})/, (_, p1, p2, p3) => `(${p1}) ${p2}-${p3}`);
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://portfoliobackend-ih6t.onrender.com/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Contact saved successfully!") {
          emailjs
            .send("service_ud7473n", "template_453lw8g", formData, "BDPsT3cNRMnCg-OaU")
            .then(
              () => {
                setStatus("Message sent and saved successfully!");
                setFormData({
                  first_Name: "",   
                  last_Name: "",    
                  phone: "",
                  email: "",
                  message: "",
                  status: "Pending",
                });
                
              },
              () => setStatus("Failed to send the message via email. Please try again later.")
            );
        } else {
          setStatus("Failed to save the message. Please try again later.");
        }
      })
      .catch(() => setStatus("Failed to save the message. Please try again later."));
  };

  return (
    <div className=" rounded-lg shadow-lg mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-8 p-10 rounded-3xl shadow-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-black border-4 border-transparent bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30 animate-gradient-x"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
{[
  { label: "First Name", name: "first_Name" },  // Updated to match formData
  { label: "Last Name", name: "last_Name" },    // Updated to match formData
  { label: "Phone (Optional)", name: "phone" },
  { label: "Email", name: "email" },
].map(({ label, name }) => (
  <motion.div key={name} whileFocus={{ scale: 1.05 }} className="relative group">
    <label
      htmlFor={name}
      className="block text-center text-lg font-semibold text-purple-300 group-focus-within:text-purple-400"
    >
      {label}
    </label>
    <input
      type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
      name={name}                     // 👈 Now matches formData keys
      id={name}
      value={formData[name] || ""}    // 👈 Adding fallback for safety
      onChange={handleChange}
      required={name !== "phone"}
      className="w-full p-3 text-sm sm:text-base bg-gray-900 text-white rounded-2xl shadow-inner focus:ring-4 focus:ring-purple-500 border border-gray-700 hover:border-purple-500 transition-all duration-300"
    />
  </motion.div>
))}

        <motion.div whileFocus={{ scale: 1.05 }} className="relative group">
          <label htmlFor="message" className="block text-center text-lg font-semibold text-purple-300 group-focus-within:text-purple-400">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
            className="w-full p-4 bg-gray-900 text-white rounded-3xl shadow-inner focus:ring-4 focus:ring-purple-500 border border-gray-700 hover:border-purple-500 transition-all duration-300"
          />
        </motion.div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(147, 51, 234, 0.7)" }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white py-4 rounded-3xl text-xl font-bold hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-300 shadow-lg hover:shadow-purple-600/70"
        >
          Send Message ✉️
        </motion.button>
      </motion.form>

      {status && <p className="mt-4 text-center text-white">{status}</p>}
    </div>
  );
}
