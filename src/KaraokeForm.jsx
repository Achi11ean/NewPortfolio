import React, { useState, useEffect } from "react";

export default function KaraokeHostingForm({ onHostingSubmit }) {
  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    contact_phone: "",
    location: "",
    payment_amount: "",
    frequency_date: "",
    contract: "",
    notes: "",
  });

  const [contacts, setContacts] = useState([]);
  const [isNewContact, setIsNewContact] = useState(false);
  const [newContact, setNewContact] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/contacts")
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
        contact_phone: selectedContact?.phone_number || "",
      });
    }
  };

  const handleNewContactChange = (e) => {
    setNewContact(e.target.value);
    setFormData({ ...formData, contact_name: e.target.value });
  };

  const handleNewContactPhoneChange = (e) => {
    setNewContactPhone(e.target.value);
    setFormData({ ...formData, contact_phone: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  
    console.log("Submitting form data:", formData); // ✅ Debugging log
  
    fetch("http://127.0.0.1:5000/karaoke_hosting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from backend:", data); // ✅ Debugging log
  
        if (data.message === "Karaoke hosting event created successfully!") {
          setStatus("🎉 Hosting event created successfully!");
          setFormData({
            company_name: "",
            contact_name: "",
            contact_phone: "",
            location: "",
            payment_amount: "",
            frequency_date: "",
            contract: "",
            notes: "",
          });
          setNewContact("");
          setIsNewContact(false);
          setNewContactPhone("");
  
          if (onHostingSubmit) onHostingSubmit(); // 🔄 Refresh hosting events
        } else {
          setStatus("❌ Failed to create event. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Backend error:", error);
        setStatus("❌ Failed to create event. Please try again.");
      });
  };
  

  return (
    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-8 mb-5 rounded-2xl shadow-2xl max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        🎤 Karaoke Hosting Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-800 text-lg font-semibold">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-2xl bg-gray-300 text-black shadow"
          />
        </div>

        <div>
          <label className="block text-gray-800 text-lg font-semibold">Select or Enter Contact</label>
          <select
            name="contact_name"
            value={isNewContact ? "new" : formData.contact_name}
            onChange={handleContactSelection}
            required
            className="w-full p-3 border rounded-2xl bg-gray-300 text-black shadow"
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
                className="w-full mt-3 p-3 border rounded-2xl bg-gray-300 text-black shadow"
                required
              />
      
            </>
          )}
        </div>

        <div>
          <label className="block text-gray-800 text-lg font-semibold">Contact Phone</label>
          <input
            type="text"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-2xl bg-gray-300 text-black shadow"
          />
        </div>

        <div>
          <label className="block text-gray-800 text-lg font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-2xl bg-gray-300 text-black shadow"
          />
        </div>

        <div>
          <label className="block text-gray-800 text-lg font-semibold">Payment Amount ($)</label>
          <input
            type="number"
            name="payment_amount"
            value={formData.payment_amount}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-2xl bg-gray-300 text-black shadow"
          />
        </div>

        <div>
          <label className="block text-gray-800 text-lg font-semibold">Frequency / Date</label>
          <input
            type="text"
            name="frequency_date"
            placeholder="e.g., Weekly, Monthly, 2025-03-15"
            value={formData.frequency_date}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-2xl bg-gray-300 text-black shadow"
          />
        </div>

        <div>
          <label className="block text-gray-800 text-lg font-semibold">Contract Details</label>
          <textarea
            name="contract"
            value={formData.contract}
            onChange={handleChange}
            placeholder="Contract details or reference"
            className="w-full p-3 border rounded-2xl bg-gray-300 text-black shadow"
          />
          
        </div>
        <div>
          <label className="block text-gray-800 text-lg font-semibold">notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Contract details or reference"
            className="w-full p-3 border rounded-2xl bg-gray-300 text-black shadow"
          />
          
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 rounded-2xl shadow-lg hover:from-orange-600 hover:to-yellow-600 transform hover:scale-105 transition-transform duration-300"
        >
          🎶 Submit Karaoke Hosting
        </button>
      </form>
      {status && <p className="mt-6 text-center text-lg font-medium text-green-600">{status}</p>}
    </div>
  );
}
