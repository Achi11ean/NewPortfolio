import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export default function Promotions() {
    const { user } = useAuth();

    const [promotions, setPromotions] = useState([]);
    const [form, setForm] = useState({ event_type: "", event_date: "", location: "", image_url: "", description: "" });
    const [editingId, setEditingId] = useState(null);
    const [showPromotions, setShowPromotions] = useState(false);

    const handleEdit = (promo) => {
        setEditingId(promo.id);
        setForm({
            event_type: promo.event_type,
            event_date: promo.event_date.slice(0, 16), // Ensure datetime-local format
            location: promo.location,
            image_url: promo.image_url || "", // Ensure it's not undefined
            description: promo.description,
        });
    };
    
    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const response = await fetch("https://portfoliobackend-ih6t.onrender.com/promotions");
            const data = await response.json();
    
            if (Array.isArray(data)) {
                // ✅ Sort promotions by date (earliest event first)
                const sortedPromotions = data.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    
                setPromotions(sortedPromotions);
            } else {
                console.error("Unexpected data format:", data);
                setPromotions([]); // Ensure promotions is always an array
            }
        } catch (error) {
            console.error("Error fetching promotions:", error);
            setPromotions([]); // Set an empty array in case of failure
        }
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? "PATCH" : "POST";
        const url = editingId ? `https://portfoliobackend-ih6t.onrender.com/promotions/${editingId}` : "https://portfoliobackend-ih6t.onrender.com/promotions";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (response.ok) {
                setForm({ event_type: "", event_date: "", location: "", image_url: "", description: "" });
                setEditingId(null);
                fetchPromotions();
            }
        } catch (error) {
            console.error("Error submitting promotion:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this promotion?")) return;
        try {
            await fetch(`https://portfoliobackend-ih6t.onrender.com/promotions/${id}`, { method: "DELETE" });
            fetchPromotions();
        } catch (error) {
            console.error("Error deleting promotion:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
<div className="max-w-4xl mx-auto p-4 flex justify-center items-center">
  <button
    className="w-full relative bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white font-extrabold text-2xl 
               px-6 py-4 rounded-2xl shadow-xl transition-all duration-300 ease-in-out 
               hover:from-purple-700 hover:via-pink-600 hover:to-red-600 hover:shadow-2xl 
               transform hover:scale-105 active:scale-95 group overflow-hidden"
    onClick={() => setShowPromotions(!showPromotions)}
  >
    {/* Floating Microphone Animation */}
    <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl animate-bounce">🎤</span>

    {showPromotions ? "Hope to see you there! 🎉" : "🎶 Coming Soon!"}

    {/* Glowing Overlay Effect */}
    <span className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-transparent opacity-0 group-hover:opacity-10 transition-all duration-300"></span>

    {/* Tooltip - Now with a sleek animation */}
    <span className="absolute left-1/2 bottom-full mb-3 w-64 px-4 py-2 text-sm text-white 
                    bg-black bg-opacity-90 rounded-lg shadow-lg opacity-0 
                    group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 ease-in-out transform -translate-x-1/2">
      Click here to find out where I'm hosting or performing next!
    </span>
  </button>
</div>


            {showPromotions && user?.is_admin && (
                <form 
  onSubmit={handleSubmit} 
  className="w-full max-w-lg mx-auto p-6 bg-gradient-to-b from-blue-900 via-purple-800 to-indigo-900 
             rounded-3xl shadow-2xl border border-gray-700 backdrop-blur-lg text-white space-y-5"
>

  {/* 📸 Image Upload Link */}
  <div className="relative group text-center">
    <a
      href="https://imgur.com/upload"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block w-full font-bold text-white text-center uppercase tracking-wide rounded-2xl 
                 bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-lg transition-all duration-300 
                 ease-in-out hover:scale-105 hover:from-green-500 hover:via-green-600 hover:to-green-700 hover:shadow-2xl"
    >
      📸 Upload Photo to Imgur
    </a>

    {/* Tooltip */}
    <div
      className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 px-4 py-3 bg-gray-800 text-white 
                 text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                 pointer-events-none max-w-xs"
    >
      Don't have an image URL? Click the link! <br />
      1️⃣ Upload your image <br />
      2️⃣ Right-click on it & "Copy Image Address" <br />
      Ensure it looks like: <span className="text-green-300">"https://i.imgur.com/example.jpg"</span> ✨
    </div>
  </div>

  {/* 🎭 Event Type */}
  <div className="relative">
    <label className="block text-lg font-semibold text-gray-200 mb-1">🎭 Event Type</label>
    <input
      type="text"
      placeholder="e.g., Karaoke Night"
      value={form.event_type}
      onChange={(e) => setForm({ ...form, event_type: e.target.value })}
      className="w-full p-3 bg-gray-900 text-white rounded-xl border border-gray-700 
                 focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-400"
      required
    />
  </div>

  {/* 📅 Event Date */}
  <div className="relative">
    <label className="block text-lg font-semibold text-gray-200 mb-1">📅 Event Date & Time</label>
    <input
      type="datetime-local"
      value={form.event_date}
      onChange={(e) => setForm({ ...form, event_date: e.target.value })}
      className="w-full p-3 bg-gray-900 text-white rounded-xl border border-gray-700 
                 focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-400"
      required
    />
  </div>

  {/* 📍 Location */}
  <div className="relative">
    <label className="block text-lg font-semibold text-gray-200 mb-1">📍 Location</label>
    <input
      type="text"
      placeholder="Venue Name | Address"
      value={form.location}
      onChange={(e) => setForm({ ...form, location: e.target.value })}
      className="w-full p-3 bg-gray-900 text-white rounded-xl border border-gray-700 
                 focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-400"
      required
    />
  </div>

  {/* 🖼️ Image URL */}
  <div className="relative">
    <label className="block text-lg font-semibold text-gray-200 mb-1">🖼️ Image URL</label>
    <input
      type="text"
      placeholder="https://i.imgur.com/example.jpg"
      value={form.image_url}
      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
      className="w-full p-3 bg-gray-900 text-white rounded-xl border border-gray-700 
                 focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-400"
    />
  </div>

  {/* 📝 Description */}
  <div className="relative">
    <label className="block text-lg font-semibold text-gray-200 mb-1">📝 Event Description</label>
    <textarea
      placeholder="Tell us about the event!"
      value={form.description}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
      className="w-full p-3 bg-gray-900 text-white rounded-xl border border-gray-700 
                 focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-400 h-28 resize-none"
      required
    />
  </div>

  {/* 🚀 Submit Button */}
  <button
    type="submit"
    className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 
               hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 
               rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
  >
    {editingId ? "✨ Update Promotion" : "🚀 Add Promotion"}
  </button>

</form>

            )}
    
    {showPromotions && (
  <div className="mt-6 space-y-6 max-h-[30rem] overflow-y-auto p-4 border border-gray-600 
                  rounded-3xl bg-gray-900 bg-opacity-50 shadow-2xl backdrop-blur-lg 
                  scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
    {Array.isArray(promotions) && promotions.length > 0 ? (
      promotions.map((promo) => (
        <div 
          key={promo.id} 
          className="relative bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 p-6 
                     rounded-2xl shadow-xl hover:scale-105 transform transition-all duration-300"
        >
          {/* 🏷️ Event Title + Date */}
          <h2 className="text-2xl font-extrabold text-center text-white drop-shadow-lg">
            {promo.event_type}
          </h2>
          <p className="text-center text-lg font-semibold text-gray-300 mt-1">
            {new Date(promo.event_date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <br />
            {new Date(promo.event_date).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>

          {/* 📍 Location */}
          <h2 className="text-lg text-center font-bold text-yellow-300 mt-4">
            📍 {promo.location.split("|")[0]}
            <br />
            <span className="text-gray-300">{promo.location.split("|")[1]}</span>
          </h2>

          {/* 📸 Image */}
          {promo.image_url && (
            <div className="relative mt-4 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={promo.image_url} 
                alt="Promotion" 
                className="w-full h-48 object-cover transition-transform duration-500 ease-in-out hover:scale-110"
              />
              <div className="absolute inset-0 "></div>
            </div>
          )}

          {/* 📝 Description */}
          <div className="mt-4 max-h-24 overflow-y-auto p-3 bg-black bg-opacity-50 text-white 
                          rounded-lg shadow-inner backdrop-blur-lg border border-gray-700">
            <p className="text-center font-semibold">{promo.description}</p>
          </div>

          {/* 🔧 Admin Controls */}
          {user?.is_admin && (
            <div className="mt-4 flex justify-center gap-4">
              <button 
                className="px-4 py-2 text-lg font-bold bg-yellow-500 text-white rounded-lg shadow-md 
                           hover:bg-yellow-600 transition-all hover:scale-105"
                onClick={() => handleEdit(promo)}
              >
                ✏️ Edit
              </button>
              <button 
                className="px-4 py-2 text-lg font-bold bg-red-600 text-white rounded-lg shadow-md 
                           hover:bg-red-700 transition-all hover:scale-105"
                onClick={() => handleDelete(promo.id)}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      ))
    ) : (
      <p className="text-center text-gray-400">No promotions found.</p>
    )}
  </div>
)}

        </div>
    );
    }
