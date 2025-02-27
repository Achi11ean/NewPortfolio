import React, { useState, useEffect } from "react";

export default function EngineeringForm({ onBookingSubmit }) {
  const [formData, setFormData] = useState({
    contact_name: "",
    contact_phone: "",
    project_name: "",
    project_description: "",
    price: "",
    status: "Pending",
    notes: "", // ✅ Added notes field
  });
  

  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState("");
  const [isNewContact, setIsNewContact] = useState(false);
  const [newContact, setNewContact] = useState("");
  const [newContactPhone, setNewContactPhone] = useState(""); // ✅ Stores phone for new contact

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
      setFormData({ ...formData, contact_name: newContact, contact_phone: newContactPhone });
    } else {
      setIsNewContact(false);
      const selectedContact = contacts.find(
        (contact) => `${contact.first_name} ${contact.last_name}` === value
      );
      setFormData({
        ...formData,
        contact_name: value,
        contact_phone: selectedContact ? selectedContact.phone : "",  
      });
      
      
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, ""); // Remove all non-numeric characters
  
    if (cleaned.length <= 3) {
      return `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`; // Ensures max length is 10 digits
    }
  };
  
  
  const handleNewContactPhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setNewContactPhone(formattedValue);
    setFormData((prev) => ({ ...prev, contact_phone: formattedValue }));
  };
  
  const handleNewContactChange = (e) => {
    const value = e.target.value;
    setNewContact(value);
    setFormData({ ...formData, contact_name: value, contact_phone: newContactPhone }); // ✅ Ensure phone is copied
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const submissionData = {
      contact_name: formData.contact_name,
      contact_phone: formData.contact_phone,
      project_name: formData.project_name,
      project_description: formData.project_description,
      price: formData.price,
      status: formData.status,
      notes: formData.notes,
    };
    
  
    fetch("https://portfoliobackend-ih6t.onrender.com/engineering-bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Booking saved successfully!") {
          setStatus("Booking request sent successfully!");
          setFormData({
            contact_name: "",
            contact_phone: "",
            project_name: "",
            project_description: "",
            price: "",
            status: "Pending",
            notes: "", // ✅ Reset notes field

          });
          setNewContact("");
          setNewContactPhone(""); // ✅ Reset phone field

          setIsNewContact(false);
  
          if (onBookingSubmit) {
            onBookingSubmit(); // Refresh bookings after submission
          }
        } else {
          setStatus("Failed to save booking. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Backend error:", error);
        setStatus("Failed to save booking. Please try again later.");
      });
  };
  
  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-2xl shadow-2xl max-w-lg mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Engineering Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="contact" className="block font-serif text-gray-800 text-center underline text-lg font-semibold">
            Select or Enter Contact
          </label>
          <select
  name="contact"
  id="contact"
  value={isNewContact ? "new" : formData.contact_name} // ✅ Fix here

            onChange={handleContactSelection}
            required
            className="w-full p-3 border rounded-2xl bg-black text-white shadow text-center  focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <>
              <input
                type="text"
                placeholder="Enter new contact name"
                value={newContact}
                onChange={handleNewContactChange}
                className="w-full mt-3 p-3 border rounded-2xl bg-black text-center  text-white shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="text"
                placeholder="Enter new contact phone"
                value={newContactPhone}
                onChange={handleNewContactPhoneChange}
                className="w-full mt-3 p-3 border rounded-2xl bg-black text-white shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </>
          )}
        </div>
        <div>
          <label htmlFor="project_name" className="block font-serif text-gray-800 text-center underline text-lg font-semibold">
            Project Name
          </label>
          <input
            type="text"
            name="project_name"
            id="project_name"
            value={formData.project_name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-2xl bg-black text-center text-white shadow  focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="project_description" className="block text-gray-800 text-center font-serif underline text-lg font-semibold">
            Project Description
          </label>
          <textarea
            name="project_description"
            id="project_description"
            value={formData.project_description}
            onChange={handleChange}
            placeholder="Provide a detailed description of the project"
            className="w-full p-3 border rounded-2xl bg-black text-white shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-gray-800 text-lg font-serif text-center underline font-semibold">
            Cost ($)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-3 border rounded-2xl text-center bg-black text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-gray-800 font-serif text-center underline text-lg font-semibold">
            Additional Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional information..."
            className="w-full p-3 border rounded-2xl bg-black text-white shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <button
          type="submit"
          className="w-full font-serif bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-2xl shadow-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-transform duration-300"
        >
          Submit Booking Request
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
