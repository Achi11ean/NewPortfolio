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
                setPromotions(data);
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
<div className="max-w-4xl mx-auto p-4">
    <button 
        className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mb-4 relative group"
        onClick={() => setShowPromotions(!showPromotions)}
        title="Click here to find out where I'm hosting or performing next!"
    >
        {showPromotions ? "Hope to see you there! 🎉" : "🎤 Coming Soon!"}

        {/* Tooltip (Visible on Hover) */}
        <span className="absolute left-1/2 bottom-full mb-2 w-64 px-3 py-2 bg-gray-900 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transform -translate-x-1/2 transition-opacity duration-300">
            Click here to find out where I'm hosting or performing next!
        </span>
    </button>
</div>

            {showPromotions && user?.is_admin && (
                <form onSubmit={handleSubmit} className="bg-blue-300 p-4 rounded shadow-lg space-y-4">
                                  <div className="relative group">
                <a
                  href="https://imgur.com/upload"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-block w-full font-bold text-white text-center mb-2 uppercase rounded-lg
                       bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-lg transition-all duration-300 ease-in-out 
                       hover:scale-105 hover:from-green-500 hover:via-green-600 hover:to-green-700 hover:shadow-2xl
                       before:absolute before:-inset-1 before:rounded-lg before:bg-green-300 before:blur-lg before:opacity-30"
                >
                  <span className="relative z-10">Upload Photo to Imgur</span>
                </a>

                {/* Tooltip */}
                <div
                  className="absolute bottom-full mb-2 w-64 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ left: "50%", transform: "translateX(-50%)" }}
                >
                  Don't have a URL for your image yet? Click the link. <br />
                  1. Add your image <br />
                  2. Right-click on the image and "Copy Image Address" <br />
                  If it doesn't look like this:
                  "https://i.imgur.com/example.jpg" <br />
                  try copying the address again.
                </div>
              </div>
                    <input type="text" placeholder="Event Type" value={form.event_type} 
                        onChange={(e) => setForm({ ...form, event_type: e.target.value })} 
                        className="w-full p-2 border rounded" required />
                    
                    <input type="datetime-local" value={form.event_date} 
                        onChange={(e) => setForm({ ...form, event_date: e.target.value })} 
                        className="w-full p-2 border rounded" required />
    
                    <input type="text" placeholder="Location" value={form.location} 
                        onChange={(e) => setForm({ ...form, location: e.target.value })} 
                        className="w-full p-2 border rounded" required />
    
                    <input type="text" placeholder="Image URL" value={form.image_url} 
                        onChange={(e) => setForm({ ...form, image_url: e.target.value })} 
                        className="w-full p-2 border rounded" />
    
                    <textarea placeholder="Description" value={form.description} 
                        onChange={(e) => setForm({ ...form, description: e.target.value })} 
                        className="w-full p-2 border rounded" required />
    
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
                        {editingId ? "Update Promotion" : "Add Promotion"}
                    </button>
                </form>
            )}
    
            {showPromotions && (
                <div className="mt-6 space-y-4 max-h-96 overflow-y-auto p-2 border border-gray-600 rounded-lg scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
                    {Array.isArray(promotions) && promotions.length > 0 ? (
                        promotions.map((promo) => (
                            <div key={promo.id} className="bg-blue-800 rounded-xl p-4 shadow-md">
                                <h2 className="text-xl font-bold text-center">
                                    Event: {promo.event_type} - When: {new Date(promo.event_date).toLocaleString()}
                                </h2>
                                <p className="text-white-700 text-lg text-center font-bold">📍Where: {promo.location}</p>
                                {promo.image_url && <img src={promo.image_url} alt="Promotion" className="mt-2 w-full h-40 object-cover rounded" />}
                                <div className="max-h-16 overflow-auto p-2 bg-gray-800 text-white rounded-lg">
                                    <p className="text-white text-center font-bold">{promo.description}</p>
                                </div>
                                {user?.is_admin && (
                                    <div className="mt-4 flex gap-2">
                                        <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700" onClick={() => handleEdit(promo)}>
                                            Edit
                                        </button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleDelete(promo.id)}>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No promotions found.</p>
                    )}
                </div>
            )}
        </div>
    );
    }
