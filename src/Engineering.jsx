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

export default function EngineeringBookingManager() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://portfoliobackend-ih6t.onrender.com/engineering-bookings');
      setBookings(response.data);
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
    <div>  
      <h1>Engineering</h1>
         <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {bookings.map((booking) => (
        <motion.div
          key={booking.id}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="rounded-2xl shadow-lg p-4 bg-gradient-to-br from-green-200 via-emerald-100 to-lime-100 text-gray-800">
            <CardContent>
              {selectedBooking?.id === booking.id ? (
                <>
                  <h3 className="text-xl font-semibold mb-3">Edit Booking</h3>
                  <Input name="contact" placeholder="Contact" value={formData.contact || ''} onChange={handleChange} />
                  <Input name="project_name" placeholder="Project Name" value={formData.project_name || ''} onChange={handleChange} />
                  <Textarea name="project_description" placeholder="Description" value={formData.project_description || ''} onChange={handleChange} />
                  <Input name="price" placeholder="Price" value={formData.price || ''} onChange={handleChange} />
                  <Input name="status" placeholder="Status" value={formData.status || ''} onChange={handleChange} />
                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="outline" onClick={() => setSelectedBooking(null)}>Cancel</Button>
                    <Button onClick={handleUpdate}>Save Changes</Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-1">{booking.project_name}</h3>
                  <p>Contact: {booking.contact}</p>
                  <p>Description: {booking.project_description}</p>
                  <p>Price: ${booking.price?.toFixed(2) || 'N/A'}</p>
                  <p>Status: {booking.status}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={() => handleEdit(booking)} className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-lg">Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(booking.id)}>Delete</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
      </div>
      <div className='justify-center flex item-center '>
      <Button
  onClick={() => setShowForm((prev) => !prev)}
  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg mb-6 transition-all duration-300"
>
  {showForm ? "Hide Booking Form ⬆️" : "Add New Booking ⬇️"}
</Button>
</div>
{showForm && <EngineeringForm onBookingSubmit={fetchBookings} />}
      </div>
  );
}