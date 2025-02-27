import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import GeneralInquiryForm from './GeneralForm';
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
      className={`border rounded-lg px-3 bg-black text-white py-2 w-full ${className}`}
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

export default function GeneralInquiryManager() {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false); // 👈 Add this line
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 10; // Adjust as needed
  
  // Calculate indexes
  const indexOfLastInquiry = currentPage * inquiriesPerPage;
  const indexOfFirstInquiry = indexOfLastInquiry - inquiriesPerPage;
  const currentInquiries = inquiries.slice(indexOfFirstInquiry, indexOfLastInquiry);
  const totalPages = Math.max(1, Math.ceil(inquiries.length / inquiriesPerPage));
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  
  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get('https://portfoliobackend-ih6t.onrender.com/general_inquiries');
      console.log("Fetched Inquiries:", response.data); // ✅ Debugging
      setInquiries(response.data);
    } catch (error) {
      toast.error("Failed to fetch general inquiries");
    }
  };
  

  const handleEdit = (inquiry) => {
    setSelectedInquiry(inquiry);
    setFormData(inquiry);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://portfoliobackend-ih6t.onrender.com/general_inquiries/${id}`);
      toast.success("Inquiry deleted successfully!");
      fetchInquiries();
    } catch (error) {
      toast.error("Failed to delete inquiry");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`https://portfoliobackend-ih6t.onrender.com/general_inquiries/${selectedInquiry.id}`, formData);
      toast.success("Inquiry updated successfully!");
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (error) {
      toast.error("Failed to update inquiry");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 bg-black rounded-3xl border-white border-2 mt-3">
<h2 className="text-3xl pb-1  sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-6 text-gray-800 bg-gradient-to-r from-blue-400  to-blue-200 text-transparent bg-clip-text drop-shadow-lg animate-fade-in">
  General Inquiry
  </h2>  
  <div className="w-full h-1 bg-gradient-to-r from-purple-400 via-yellow-500 via-purple-500  via-blue-500 to-purple-500 rounded-full shadow-lg my-6"></div>
  <div className='items-center flex flex-col justify-center'>
  <Button
    onClick={() => setShowForm((prev) => !prev)}
    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg mb-6 transition-all duration-300"
  >
    {showForm ? "Hide Inquiry Form ⬆️" : "Add New Inquiry ⬇️"}
  </Button>
  {showForm && <GeneralInquiryForm onInquirySubmit={fetchInquiries} />}
</div>
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {currentInquiries.map((inquiry) => (

        <motion.div
          key={inquiry.id}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="rounded-2xl shadow-lg p-4 bg-gradient-to-br from-purple-200 via-pink-100 to-red-100 text-gray-800">
            <CardContent>
              {selectedInquiry?.id === inquiry.id ? (
                <>
                  <h3 className="text-xl font-semibold mb-3">Edit Inquiry</h3>
                  <Input name="contact_name" placeholder="Contact Name" value={formData.contact_name || ''} onChange={handleChange} />
                  <Textarea name="request" placeholder="Request" value={formData.request || ''} onChange={handleChange} />
                  <Input name="cost" placeholder="Cost" type="number" value={formData.cost || ''} onChange={handleChange} />
                  <Textarea name="notes" placeholder="Notes" value={formData.notes || ''} onChange={handleChange} />
                  <Input name="date" placeholder="Date" value={formData.date || ''} onChange={handleChange} />
                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="outline" onClick={() => setSelectedInquiry(null)}>Cancel</Button>
                    <Button onClick={handleUpdate}>Save Changes</Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-1">{inquiry.contact_name}</h3>
                  <p>📞 Phone: {inquiry.contact_phone || "N/A"}</p>

                  <p>Request: {inquiry.request}</p>
                  <p>Cost: ${inquiry.cost}</p>
                  <p>Notes: {inquiry.notes}</p>
                  <p>Date: {inquiry.date}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={() => handleEdit(inquiry)} className="bg-pink-400 hover:bg-pink-500 text-white rounded-lg">Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(inquiry.id)}>Delete</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

<div className="flex justify-center mt-6 space-x-4">
  <Button
    onClick={prevPage}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
  >
    ⬅ Previous
  </Button>

  <span className="text-white text-lg">
    Page {inquiries.length === 0 ? 0 : currentPage} of {totalPages || 1}
  </span>

  <Button
    onClick={nextPage}
    disabled={currentPage >= totalPages || inquiries.length === 0}
    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
  >
    Next ➡
  </Button>
</div>

  </div>
  );
}
