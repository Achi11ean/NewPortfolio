import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

function Input({ label, ...props }) {

  
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-6 py-3 font-semibold rounded-lg shadow transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
}


export default function MileageTracker() {
  const [mileages, setMileages] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingMileage, setEditingMileage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [locations, setLocations] = useState([]); // For dropdown locations
  const fetchLocations = async () => {
    try {
      const response = await axios.get("https://portfoliobackend-ih6t.onrender.com/karaoke_hosting");
      console.log("Fetched karaoke hosting data:", response.data); // <-- Check what you get here
      const uniqueLocations = [...new Set(response.data.map((item) => item.location))];
      console.log("Unique locations:", uniqueLocations); // <-- See if locations are correct
      setLocations(uniqueLocations);
    } catch (error) {
      toast.error("Failed to fetch locations.");
    }
  };
  
  const fetchMileages = async () => {
    try {
      const response = await axios.get("https://portfoliobackend-ih6t.onrender.com/mileage");
      setMileages(response.data);
    } catch (error) {
      toast.error("Failed to fetch mileage records.");
    }
  };

  useEffect(() => {
    fetchMileages();
    fetchLocations(); // Fetch locations on component load
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const preparedData = {
      ...formData,
      distance_driven: parseFloat(formData.distance_driven),
      is_round_trip: !!formData.is_round_trip,  // Ensure boolean
    };
  
    try {
      if (editingMileage) {
        await axios.patch(`https://portfoliobackend-ih6t.onrender.com/mileage/${editingMileage.id}`, preparedData);
        toast.success("Mileage record updated successfully!");
      } else {
        await axios.post("https://portfoliobackend-ih6t.onrender.com/mileage", preparedData);
        toast.success("Mileage record created successfully!");
      }
      await fetchMileages();
      setFormData({});
      setEditingMileage(null);
      setShowForm(false);
    } catch (error) {
      console.error("❌ Error saving mileage:", error);
      toast.error("Failed to save mileage record.");
    }
  };
  
  const handleEdit = (mileage) => {
    setEditingMileage(mileage);
    setFormData(mileage);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://portfoliobackend-ih6t.onrender.com/mileage/${id}`);
      toast.success("Mileage record deleted successfully!");
      fetchMileages();
    } catch (error) {
      toast.error("Failed to delete mileage record.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  

  return (
    <div className="p-6 mt-4 mb-3 bg-black justify-center items-center border-2 rounded-3xl ">
<h2 className="text-3xl  sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-6 text-gray-800 bg-gradient-to-r from-blue-500 via-green-500 to-teal-500 text-transparent bg-clip-text drop-shadow-lg animate-fade-in">
  🚗 Mileage  🚗
</h2>
<div className="flex justify-center mt-6">
  <Button
    onClick={() => setShowForm(!showForm)}
    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold 
               text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 
               hover:scale-105 hover:shadow-blue-500/50 hover:from-indigo-600 hover:to-blue-700 
               border border-blue-300 backdrop-blur-lg"
  >
    {showForm ? "⬆️ Hide Form" : "⬇️ Add Mileage Record"}
  </Button>
</div>


      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-gray-50 p-6 max-w-2xl rounded-2xl shadow-inner"
        >
          <Input
            label="Expense Name"
            name="expense_name"
            value={formData.expense_name || ""}
            onChange={handleChange}
            required
          />
          <Input
            label="Date"
            type="date"
            name="date"
            value={formData.date || ""}
            onChange={handleChange}
            required
          />
{/* Start Location Input with Datalist */}
<div className="w-full mb-4">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Start Location
  </label>
  <input
    list="startLocationOptions"
    name="start_location"
    value={formData.start_location || ""}
    onChange={handleChange}
    placeholder="Select or enter a location"
    className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <datalist id="startLocationOptions">
    {locations.map((loc, idx) => (
      <option key={idx} value={loc} />
    ))}
  </datalist>
</div>

{/* End Location Input with Datalist */}
<div className="w-full mb-4">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    End Location
  </label>
  <input
    list="endLocationOptions"
    name="end_location"
    value={formData.end_location || ""}
    onChange={handleChange}
    placeholder="Select or enter a location"
    className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  <datalist id="endLocationOptions">
    {locations.map((loc, idx) => (
      <option key={idx} value={loc} />
    ))}
  </datalist>
</div>

          <Input
            label="Distance Driven (miles)"
            type="number"
            name="distance_driven"
            value={formData.distance_driven || ""}
            onChange={handleChange}
            required
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="is_round_trip"
              checked={formData.is_round_trip || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_round_trip: e.target.checked,
                })
              }
              className="mr-2"
            />
            <label className="text-gray-700">Round Trip?</label>
          </div>
          <Textarea
            label="Notes"
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
          />
          <Button type="submit">{editingMileage ? "Update" : "Create"}</Button>
        </form>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto">
        {mileages.map((mileage) => (
          <motion.div
            key={mileage.id}
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-gradient-to-br from-green-200 via-yellow-100 to-blue-100 rounded-2xl shadow-lg border"
          >
            <h4 className="text-xl text-center font-semibold text-gray-800 mb-2">
              {mileage.expense_name}
            </h4>
            <p className="text-gray-700 font-bold mb-1">
  📅 Date:  {new Date(mileage.date).toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit" 
  })}
</p>

            <p className="text-gray-700 font-bold mb-1">
              🎬 From: {mileage.start_location} <br/> 🏁To: {mileage.end_location}
            </p>
            <p className="text-gray-700 font-bold mb-1">
              🚗 Distance: {mileage.distance_driven} miles
            </p>
            <p className="text-gray-700 font-bold mb-1">
              💲 Reimbursement: ${mileage.calculated_mileage}
            </p>
            <div className="max-h-32 overflow-y-auto p-2 rounded-3xl bg-gray-100 ">
  <p className="text-gray-600 font-bold italic">
    📝 {mileage.notes || "No notes available."}
  </p>
</div>

<div className="flex justify-end gap-4 mt-4">
  {/* ✏️ Edit Button */}
  <Button
    onClick={() => handleEdit(mileage)}
    className="px-6 py-3 rounded-full text-white font-bold transition-all duration-300 
               bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg
               hover:scale-110 hover:shadow-yellow-500/50 hover:from-yellow-500 hover:to-yellow-600 
               border border-yellow-300 backdrop-blur-lg"
  >
    ✏️ Edit
  </Button>

  {/* 🗑️ Delete Button */}
  <Button
    onClick={() => handleDelete(mileage.id)}
    className="px-6 py-3 rounded-full text-white font-bold transition-all duration-300 
               bg-gradient-to-r from-red-400 to-red-500 shadow-lg
               hover:scale-110 hover:shadow-red-500/50 hover:from-red-500 hover:to-red-600 
               border border-red-300 backdrop-blur-lg"
  >
    🗑️ Delete
  </Button>
</div>

          </motion.div>
        ))}
      </div>
    </div>
  );
}
