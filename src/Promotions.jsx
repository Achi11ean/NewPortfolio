import { useState, useEffect } from "react";

export default function Promotions() {
    const [promotions, setPromotions] = useState([]);
    const [form, setForm] = useState({ event_type: "", event_date: "", location: "", image_url: "", description: "" });
    const [editingId, setEditingId] = useState(null);

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
            <h1 className="text-3xl font-bold text-center mb-4">🎤 Promotions 🎶</h1>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-lg space-y-4">
                <input type="text" placeholder="Event Type" value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} className="w-full p-2 border rounded" required />
                <input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="w-full p-2 border rounded" required />
                <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full p-2 border rounded" required />
                <input type="text" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full p-2 border rounded" />
                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded" required />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">{editingId ? "Update Promotion" : "Add Promotion"}</button>
            </form>

            <div className="mt-6 space-y-4">
    {Array.isArray(promotions) && promotions.length > 0 ? (
        promotions.map((promo) => (
            <div key={promo.id} className="bg-gray-100 p-4 rounded shadow-md">
                <h2 className="text-xl font-bold">{promo.event_type} - {new Date(promo.event_date).toLocaleString()}</h2>
                <p className="text-gray-700">📍 {promo.location}</p>
                {promo.image_url && <img src={promo.image_url} alt="Promotion" className="mt-2 w-full h-40 object-cover rounded" />}
                <p className="text-gray-600 mt-2">{promo.description}</p>
                <div className="mt-4 flex gap-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700" onClick={() => setEditingId(promo.id) && setForm(promo)}>Edit</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleDelete(promo.id)}>Delete</button>
                </div>
            </div>
        ))
    ) : (
        <p className="text-center text-gray-500">No promotions found.</p>
    )}
</div>

        </div>
    );
}
