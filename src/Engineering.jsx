import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import EngineeringForm from './EngineeringForm';

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
      className={`border rounded-lg px-3  bg-black text-white py-2 w-full ${className}`}
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
      className={`border rounded-lg px-3 bg-black text-white py-2 w-full ${className}`}
    />
  );
}

export default function EngineeringBookingManager() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10; // Number of bookings per page
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.max(1, Math.ceil(bookings.length / bookingsPerPage));
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    fetchBookings();
  }, [currentPage]); // ✅ Now fetches bookings when page changes
  
  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://portfoliobackend-ih6t.onrender.com/engineering-bookings');
      setBookings(response.data);
      setCurrentPage((prev) => Math.min(prev, totalPages));

    } catch (error) {
      toast.error("Failed to fetch bookings");
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setFormData(booking);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://portfoliobackend-ih6t.onrender.com/engineering-bookings/${id}`);
      toast.success("Booking deleted successfully!");
      
      // ✅ Ensure we don't stay on an empty page
      setCurrentPage((prev) => {
        const newTotalPages = Math.ceil((bookings.length - 1) / bookingsPerPage);
        return prev > newTotalPages ? newTotalPages : prev;
      });
  
      fetchBookings();
    } catch (error) {
      toast.error("Failed to delete booking");
    }
  };
  

  const handleUpdate = async () => {
    try {
      await axios.patch(`https://portfoliobackend-ih6t.onrender.com/engineering-bookings/${selectedBooking.id}`, formData);
      toast.success("Booking updated successfully!");
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      toast.error("Failed to update booking");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 bg-black rounded-3xl border-white border-2 mt-3">
<h2 className="text-3xl pb-1  sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-6 text-gray-800 bg-gradient-to-r from-purple-400  to-gray-200 text-transparent bg-clip-text drop-shadow-lg animate-fade-in">
  ⚙ Engineering ⚙
  </h2>   

<div className="w-full h-3 bg-gradient-to-r from-purple-400 via-yellow-500 via-purple-500  via-blue-500 to-purple-500 rounded-full shadow-lg my-6"></div>
      <div className='justify-center flex item-center '>
      <Button
  onClick={() => setShowForm((prev) => !prev)}
  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg mb-6 transition-all duration-300"
>
  {showForm ? "Hide Booking Form ⬆️" : "Add New Booking ⬇️"}
</Button>
</div>
{showForm && <EngineeringForm onBookingSubmit={fetchBookings} />}


         <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {currentBookings.map((booking) => (
        <motion.div
          key={booking.id}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="rounded-2xl shadow-lg p-4 bg-gradient-to-br from-green-200 via-emerald-100 to-lime-100 border-8 border-blue-300 text-gray-800">
            <CardContent>
              {selectedBooking?.id === booking.id ? (
                <>
                  <h3 className="text-xl font-semibold mb-3">Edit Booking</h3>
                  <Input name="contact" placeholder="Contact" value={formData.contact || ''} onChange={handleChange} />
                  <Input name="project_name" placeholder="Project Name" value={formData.project_name || ''} onChange={handleChange} />
                  <Input name="contact_phone" placeholder="Phone Number" value={formData.contact_phone || ''} onChange={handleChange} /> 

                  <Textarea name="project_description" placeholder="Description" value={formData.project_description || ''} onChange={handleChange} />
                  <Input name="price" placeholder="Price" value={formData.price || ''} onChange={handleChange} />
                  <Input name="status" placeholder="Status" value={formData.status || ''} onChange={handleChange} />
                  <Textarea name="notes" placeholder="Additional Notes" value={formData.notes || ''} onChange={handleChange} /> 

                  <div className="flex justify-end gap-2 mt-3">
                    <Button className={"bg-yellow-300"} variant="outline" onClick={() => setSelectedBooking(null)}>Cancel</Button>
                    <Button onClick={handleUpdate}>Save Changes</Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-1">{booking.project_name}</h3>
                  <p>Contact: {booking.contact}</p>
                  <p>Phone: {booking.contact_phone || 'N/A'}</p> {/* ✅ Added */}

                  <p>Description: {booking.project_description}</p>
                  <p>Price: ${booking.price?.toFixed(2) || 'N/A'}</p>
                  <p>Status: {booking.status}</p>
                  <p>📝 Notes: {booking.notes || 'No additional notes'}</p> {/* ✅ Added */}

                  <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={() => handleEdit(booking)} className="bg-yellow-400 hover:bg-emerald-500 text-black rounded-lg">Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(booking.id)}>Delete</Button>
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
    Page {bookings.length === 0 ? 0 : currentPage} of {totalPages || 1}
  </span>

  <Button
    onClick={nextPage}
    disabled={currentPage >= totalPages || bookings.length === 0}
    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
  >
    Next ➡
  </Button>
</div>


      </div>
  );
}