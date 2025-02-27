import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import KaraokeHostingForm from './KaraokeForm';

// Reusable UI Components
function Card({ children, className }) {
  return <div className={`border rounded-lg shadow-sm p-4 ${className}`}>{children}</div>;
}

function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

function Button({ children, onClick, variant = 'primary', className }) {
  const baseStyle = 'px-4 py-2 rounded-lg font-medium transition';
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600',
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

export default function KaraokeManager() {
  const [karaokeEvents, setKaraokeEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchKaraokeEvents();
  }, []);

  const fetchKaraokeEvents = async () => {
    try {
      const response = await axios.get('https://portfoliobackend-ih6t.onrender.com/karaoke_hosting');
      setKaraokeEvents(response.data);
    } catch (error) {
      toast.error("Failed to fetch karaoke events.");
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData(event);
    setShowForm(false); // Hide the form when editing inline
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://portfoliobackend-ih6t.onrender.com/karaoke_hosting/${id}`);
      toast.success("Karaoke event deleted successfully!");
      fetchKaraokeEvents();
    } catch (error) {
      toast.error("Failed to delete event.");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`https://portfoliobackend-ih6t.onrender.com/karaoke_hosting/${selectedEvent.id}`, formData);
      toast.success("Event updated successfully!");
      setSelectedEvent(null);
      fetchKaraokeEvents();
    } catch (error) {
      toast.error("Failed to update event.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4">
      <Button
        onClick={() => setShowForm((prev) => !prev)}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg mb-6 transition-all duration-300"
      >
        {showForm ? "Hide Hosting Form ⬆️" : "Add New Karaoke Hosting ⬇️"}
      </Button>

      {showForm && <KaraokeHostingForm onHostingSubmit={fetchKaraokeEvents} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {karaokeEvents.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="rounded-2xl shadow-lg p-4 bg-gradient-to-br from-yellow-200 via-orange-100 to-red-100 text-gray-800">
              <CardContent>
                {selectedEvent?.id === event.id ? (
                  <>
                    <h3 className="text-xl font-semibold mb-3">🎤 Edit Event</h3>
                    <input
                      name="company_name"
                      placeholder="Company Name"
                      value={formData.company_name || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-white mb-2"
                    />
                    <input
                      name="contact_name"
                      placeholder="Contact Name"
                      value={formData.contact_name || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-white mb-2"
                    />
                    <input
                      name="contact_phone"
                      placeholder="Contact Phone"
                      value={formData.contact_phone || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-white mb-2"
                    />
                    <input
                      name="location"
                      placeholder="Location"
                      value={formData.location || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-white mb-2"
                    />
                    <input
                      name="payment_amount"
                      placeholder="Payment Amount ($)"
                      type="number"
                      value={formData.payment_amount || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-white mb-2"
                    />
                    <input
                      name="frequency_date"
                      placeholder="Frequency/Date"
                      value={formData.frequency_date || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-white mb-2"
                    />
                    <textarea
                      name="contract"
                      placeholder="Contract Details"
                      value={formData.contract || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-white mb-2"
                    />
                    <textarea
                      name="notes"
                      placeholder="Notes"
                      value={formData.notes || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-white"
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <Button variant="outline" onClick={() => setSelectedEvent(null)}>Cancel</Button>
                      <Button onClick={handleUpdate}>Save Changes</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-1">{event.company_name}</h3>
                    <p>👤 Contact: {event.contact_name}</p>
                    <p>📞 Phone: {event.contact_phone}</p>
                    <p>📍 Location: {event.location}</p>
                    <p>💰 Payment: ${event.payment_amount}</p>
                    <p>📅 Frequency/Date: {event.frequency_date}</p>
                    <p>📝 Contract: {event.contract || "N/A"}</p>
                    <p>🗒️ Notes: {event.notes || "N/A"}</p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button onClick={() => handleEdit(event)} className="bg-orange-400 hover:bg-orange-500 text-white rounded-lg">Edit</Button>
                      <Button variant="destructive" onClick={() => handleDelete(event.id)}>Delete</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
