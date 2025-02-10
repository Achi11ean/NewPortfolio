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
<button 
    className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mb-4"
    onClick={() => setShowPromotions(!showPromotions)}
>
    {showPromotions ? "Hope to see you there! 🎉" : "🎤 Coming Soon!"}
</button>
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
