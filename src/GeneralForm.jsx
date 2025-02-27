import React, { useState, useEffect } from "react";

export default function GeneralInquiryForm({ onInquirySubmit }) {
  const [formData, setFormData] = useState({
    contact_name: "",
    request: "",
    cost: "",
    notes: "",
    date: "",
  });

  const [status, setStatus] = useState("");
  const [contacts, setContacts] = useState([]);
  const [isNewContact, setIsNewContact] = useState(false);
  const [newContact, setNewContact] = useState("");
  useEffect(() => {
    fetch("https://portfoliobackend-ih6t.onrender.com/contacts")
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) => console.error("Error fetching contacts:", error));
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContactSelection = (e) => {
    const { value } = e.target;
    if (value === "new") {
      setIsNewContact(true);
      setFormData({ ...formData, contact_name: newContact });
    } else {
      setIsNewContact(false);
      setFormData({ ...formData, contact_name: value });
    }
  };
  
  const handleNewContactChange = (e) => {
    const value = e.target.value;
    setNewContact(value);
    setFormData({ ...formData, contact_name: value });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://portfoliobackend-ih6t.onrender.com/general_inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "General inquiry created successfully!") {
          setStatus("Inquiry submitted successfully!");
          setFormData({
            contact_name: "",
            request: "",
            cost: "",
            notes: "",
            date: "",
          });
          if (onInquirySubmit) onInquirySubmit(); // Refetch inquiries after submission
        } else {
          setStatus("Failed to submit inquiry. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Backend error:", error);
        setStatus("Failed to submit inquiry. Please try again later.");
      });
  };

  return (
    <div className="bg-gradient-to-r from-yellow-100 to-red-100 p-8 rounded-2xl shadow-2xl max-w-lg mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        General Inquiry Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
      <div>
  <label htmlFor="contact_name" className="block text-gray-800 text-lg font-semibold">
    Select or Enter Contact
  </label>
  <select
    name="contact_name"
    id="contact_name"
    value={isNewContact ? "new" : formData.contact_name}
    onChange={handleContactSelection}
    required
    className="w-full p-3 border rounded-2xl bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    <option value="">Select a Contact</option>
    {contacts.map((contact) => (
      <option key={contact.id} value={`${contact.first_name} ${contact.last_name}`}>
        {`${contact.first_name} ${contact.last_name}`}
      </option>
    ))}
    <option value="new">Enter New Contact</option>
  </select>

  {isNewContact && (
    <input
      type="text"
      placeholder="Enter new contact name"
      value={newContact}
      onChange={handleNewContactChange}
      className="w-full mt-3 p-3 border rounded-2xl bg-white shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
      required
    />
  )}
</div>


        <textarea
          name="request"
          placeholder="Request Details"
          value={formData.request}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-2xl bg-white shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="number"
          name="cost"
          placeholder="Estimated Cost"
          value={formData.cost}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-2xl bg-white shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="text"
          name="notes"
          placeholder="Additional Notes (Optional)"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-3 border rounded-2xl bg-white shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="date"
          name="date"
          placeholder="Preferred Date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-3 border rounded-2xl bg-white shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white py-3 rounded-2xl shadow-lg hover:from-yellow-600 hover:to-red-600 transform hover:scale-105 transition-transform duration-300"
        >
          Submit Inquiry
        </button>
      </form>
      {status && (
        <p className="mt-6 text-center text-lg font-medium text-green-600 animate-pulse">
          {status}
        </p>
      )}
    </div>
  );
}
