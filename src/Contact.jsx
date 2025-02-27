import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

// Custom UI Components
function Card({ children, className }) {
  return <div className={`border rounded-lg shadow-sm p-4 ${className}`}>{children}</div>;
}

function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

function Button({ children, onClick, variant = 'primary', className }) {
  const baseStyle = 'px-4 py-2 rounded-lg font-medium transition';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-300 text-gray-700',
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Input({ name, value, onChange, placeholder, className }) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded-lg px-3 py-2 w-full ${className}`}
    />
  );
}

function Textarea({ name, value, onChange, placeholder, className }) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded-lg px-3 py-2 w-full ${className}`}
    />
  );
}

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(4); // You can change 6 to any number you like
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(contacts.length / contactsPerPage);

// Handlers for pagination buttons
const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
        const response = await axios.get('https://portfoliobackend-ih6t.onrender.com/contacts');
        const fetchedContacts = Array.isArray(response.data) ? response.data : [];
      setContacts(fetchedContacts);
    } catch (error) {
      toast.error("Failed to fetch contacts");
    }
  };

  const handleEdit = (contact) => {
    console.log(contact); // 👈 Check the key names returned from backend
    setSelectedContact(contact);
    setFormData({
      first_name: contact.first_name,  // 👈 Ensure this matches the backend key
      last_name: contact.last_name,    // 👈 Ensure this matches the backend key
      email: contact.email,
      phone: contact.phone,
      status: contact.status,
      message: contact.message,
    });
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://portfoliobackend-ih6t.onrender.com/contacts/${id}`);
      toast.success("Contact deleted successfully!");
      fetchContacts();
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        message: formData.message,
      };
      await axios.patch(`https://portfoliobackend-ih6t.onrender.com/contacts/${selectedContact.id}`, updatedData);
      toast.success("Contact updated successfully!");
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      toast.error("Failed to update contact");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    
    <div className="p-6 mt-4 mb-3 bg-black justify-center items-center border-2 rounded-3xl ">
    <h2 className="text-3xl  sm:text-4xl md:text-5xl font-serif lg:text-6xl font-extrabold text-center mb-6 text-gray-800 bg-gradient-to-r from-blue-500 via-white to-teal-500 text-transparent bg-clip-text drop-shadow-lg animate-fade-in">
       Client Inquiries
    </h2>
    <div className="w-full h-1 bg-white rounded-full shadow-lg my-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
{currentContacts.map((contact) => (
  <motion.div
    key={contact.id}
    whileHover={{ scale: 1.02, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)" }}
    transition={{ type: "spring", stiffness: 200 }}
  >
    <Card className="rounded-2xl shadow-lg p-4 bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-100 text-gray-800 transform hover:-translate-y-1 transition-all duration-300">
      <CardContent>
        {selectedContact?.id === contact.id ? (
          // 🔧 Inline Editing Form
          <>
            <h3 className="text-xl font-semibold mb-3 text-amber-700">🍁 Edit Contact</h3>
            <div className="grid grid-cols-1 gap-3">
              <Input
                name="first_name"
                placeholder="First Name"
                value={formData.first_name || ''}
                onChange={handleChange}
                className="bg-white border-amber-300 focus:ring-amber-400"
              />
              <Input
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name || ''}
                onChange={handleChange}
                className="bg-white border-amber-300 focus:ring-amber-400"
              />
              <Input
                name="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={handleChange}
                className="bg-white border-amber-300 focus:ring-amber-400"
              />
              <Input
                name="phone"
                placeholder="Phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="bg-white border-amber-300 focus:ring-amber-400"
                required
              />
              <Textarea
                name="message"
                placeholder="Message"
                value={formData.message || ''}
                onChange={handleChange}
                className="bg-white border-amber-300 focus:ring-amber-400"
              />
              <select
  name="status"
  value={formData.status || ''}
  onChange={handleChange}
  className="bg-white border-amber-300 focus:ring-amber-400 rounded-lg px-3 py-2 w-full"
>
  <option value="Pending">Pending</option>
  <option value="Intro Consultation">Intro Consultation</option>

  <option value="In Progress">In Progress</option>
  <option value="Completed">Completed</option>
  <option value="Cancelled">Cancelled</option>
</select>

              <div className="flex justify-end gap-2 mt-3">
                <Button variant="outline" onClick={() => setSelectedContact(null)}>
                  🍂 Cancel
                </Button>
                <Button onClick={handleUpdate} className="bg-amber-500 hover:bg-amber-600">
                  🍁 Save
                </Button>
              </div>
            </div>
          </>
        ) : (
          // 🎯 Display Contact Info (View Mode)
          <>
            <h3 className="text-lg font-semibold mb-1 text-amber-700">
              {contact.first_name} {contact.last_name}
            </h3>
            <div className="text-sm opacity-90 leading-snug space-y-1">
              <p>📧 <span className="font-medium">{contact.email}</span></p>
              <p>📞 <span className="font-medium">{contact.phone || "N/A"}</span></p>
              <p>📝 <span className="italic text-amber-800">"{contact.message}"</span></p>
              <p className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                contact.status === "Pending" ? "bg-yellow-300 text-yellow-800" : "bg-green-300 text-green-800"
              }`}>
                {contact.status}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => handleEdit(contact)}
                className="bg-amber-400 hover:bg-amber-500 text-white shadow-md rounded-lg"
              >
                ✏️ Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(contact.id)}
                className="bg-red-400 hover:bg-red-500 text-white rounded-lg"
              >
                🗑️ Delete
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  </motion.div>
))}
</div>



<div className="flex justify-center items-center  gap-4 mt-6">
  <Button variant="outline" onClick={prevPage} disabled={currentPage === 1}>
    ⬅️ Previous
  </Button>
  <span className="text-lg font-medium text-gray-700">
    Page {currentPage} of {totalPages}
  </span>
  <Button variant="outline" onClick={nextPage} disabled={currentPage === totalPages}>
    Next ➡️
  </Button>
</div>


 
    </div>
    
  );
}