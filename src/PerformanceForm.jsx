import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PerformanceForm({ existingData = null, onSuccess }) {
  const [formData, setFormData] = useState(
    existingData || {
      contact_name: "",
      new_contact: "",
      request: "",
      cost: "",
      notes: "",
      date: "",
    }
  );

  const [contacts, setContacts] = useState([]);
  const [useNewContact, setUseNewContact] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("https://portfoliobackend-ih6t.onrender.com/contacts")
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
    if (useNewContact) {
      formData.contact_name = formData.new_contact;
    }

    const apiUrl = existingData
      ? `https://portfoliobackend-ih6t.onrender.com/general_inquiries/${existingData.id}`
      : "https://portfoliobackend-ih6t.onrender.com/general_inquiries";
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
          throw new Error("Failed to save or update inquiry");
        }
        return response.json();
      })
      .then((data) => {
        if (onSuccess) {
          onSuccess(data.inquiry);
        }
        setStatus(
          existingData
            ? "Inquiry updated successfully!"
            : "Inquiry created successfully!"
        );
        if (!existingData) {
          setFormData({
            contact_name: "",
            new_contact: "",
            request: "",
            cost: "",
            notes: "",
            date: "",
          });
          setUseNewContact(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setStatus("Failed to save the inquiry. Please try again later.");
      });
  };

  return (
    <div className="rounded-lg shadow-lg mx-auto max-w-2xl">
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-8 p-10 rounded-3xl shadow-2xl bg-gradient-to-br from-teal-900 via-blue-900 to-black border-4 border-transparent bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30 animate-gradient-x"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {existingData ? "Update General Inquiry" : "Create General Inquiry"}
        </h2>
        <motion.div whileFocus={{ scale: 1.05 }} className="relative group">
          <label
            htmlFor="contact_name"
            className="block text-center text-lg font-semibold text-teal-300 group-focus-within:text-teal-400"
          >
            Select Existing Contact or Enter New
          </label>
          {!useNewContact ? (
            <>
              <select
                name="contact_name"
                id="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                required={!useNewContact}
                className="w-full p-3 bg-gray-900 text-white rounded-2xl shadow-inner focus:ring-4 focus:ring-teal-500 border border-gray-700 hover:border-teal-500 transition-all duration-300"
              >
                <option value="">Select a Contact</option>
                {contacts.map((contact) => (
                  <option
                    key={contact.id}
                    value={`${contact.first_name} ${contact.last_name}`}
                  >
                    {`${contact.first_name} ${contact.last_name}`}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setUseNewContact(true)}
                className="mt-2 w-full bg-yellow-500 text-white py-2 rounded-xl hover:bg-yellow-600"
              >
                Or Enter New Contact
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                name="new_contact"
                id="new_contact"
                value={formData.new_contact}
                onChange={handleChange}
                placeholder="Enter New Contact Name"
                className="w-full p-3 bg-gray-900 text-white rounded-2xl shadow-inner focus:ring-4 focus:ring-teal-500 border border-gray-700 hover:border-teal-500 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setUseNewContact(false)}
                className="mt-2 w-full bg-gray-500 text-white py-2 rounded-xl hover:bg-gray-600"
              >
                Back to Select Contact
              </button>
            </>
          )}
        </motion.div>

        {[
          { label: "Request Details", name: "request", type: "textarea" },
          { label: "Estimated Cost", name: "cost", type: "number" },
          { label: "Additional Notes", name: "notes", type: "textarea" },
          { label: "Inquiry Date", name: "date", type: "date" },
        ].map(({ label, name, type }) => (
          <motion.div key={name} whileFocus={{ scale: 1.05 }} className="relative group">
            <label
              htmlFor={name}
              className="block text-center text-lg font-semibold text-teal-300 group-focus-within:text-teal-400"
            >
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                name={name}
                id={name}
                value={formData[name]}
                onChange={handleChange}
                rows="4"
                required
                className="w-full p-4 bg-gray-900 text-white rounded-3xl shadow-inner focus:ring-4 focus:ring-teal-500 border border-gray-700 hover:border-teal-500 transition-all duration-300"
              />
            ) : (
              <input
                type={type}
                name={name}
                id={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full p-3 text-sm sm:text-base bg-gray-900 text-white rounded-2xl shadow-inner focus:ring-4 focus:ring-teal-500 border border-gray-700 hover:border-teal-500 transition-all duration-300"
              />
            )}
          </motion.div>
        ))}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(20, 184, 166, 0.7)" }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 rounded-3xl text-xl font-bold hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-teal-600/70"
        >
          {existingData ? "Update Inquiry" : "Create Inquiry"}
        </motion.button>
      </motion.form>
      {status && <p className="mt-4 text-center text-white">{status}</p>}
    </div>
  );
}
