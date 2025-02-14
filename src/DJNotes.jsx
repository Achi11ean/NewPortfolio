import { useState, useEffect } from "react";

export default function DJNotesApp({ user, notes, fetchNotes }) {

  const [deletedNotes, setDeletedNotes] = useState([]);
  const [formData, setFormData] = useState({ alert_type: "", alert_details: "" });
  const [editingId, setEditingId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const getAlertStyles = (alertType) => {
    if (alertType.startsWith("ALERT:")) {
      return "bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white border border-red-800 shadow-lg";
    } else if (alertType.startsWith("HAPPY BIRTHDAY")) {
      return "bg-gradient-to-r from-pink-400 via-pink-300 to-pink-200 text-pink-900 border border-pink-500 shadow-md";
    } else if (alertType.startsWith("HAPPY ANNIVERSARY")) {
      return "bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 text-purple-900 border border-purple-500 shadow-md";
    } else if (alertType.startsWith("JUST MARRIED")) {
      return "bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white border border-green-700 shadow-lg";
    } else if (alertType.startsWith("SINGLE")) {
      return "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 text-white border border-gray-800 shadow-md";
    } else if (alertType.startsWith("JOKES")) {
      return "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black border border-yellow-700 shadow-md";
    } else if (alertType.startsWith("IN MEMORY")) {
      return "bg-gradient-to-r from-black via-gray-800 to-gray-700 text-white border border-gray-500 shadow-lg";
    } else if (alertType.startsWith("SHAME")) {
      return "bg-gradient-to-r from-red-900 via-gray-800 to-red-900 text-white border border-red-700 shadow-xl";
    } else {
      return "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-yellow-900 border border-yellow-500 shadow-md"; // Default (Spotlight)
    }
};

  const [selectedAlertId, setSelectedAlertId] = useState(null);

  const handleHardDeleteAll = async () => {
    const confirmDelete = window.confirm("Are you sure you want to PERMANENTLY DELETE ALL DJ NOTES? This action CANNOT be undone!");

    if (!confirmDelete) return;

    try {
        const response = await fetch("https://portfoliobackend-ih6t.onrender.com/djnotes/hard_delete_all", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete all notes: ${response.status}`);
        }

        alert("All DJ Notes have been permanently deleted.");
        fetchDeletedNotes(); // Refresh the deleted notes list
    } catch (error) {
        console.error("Error deleting all DJ Notes:", error);
    }
};

  const [isFlipping, setIsFlipping] = useState(false); // Track if the flip is happening
  const handleFlipEnd = () => {
    setIsFlipping(false); // Reset flipping state
    setCurrentIndex((prev) => (prev + 1) % notes.length); // Move to next alert
  };
  useEffect(() => {
    if (notes.length > 1) {
      const currentNote = notes[currentIndex]; // Get the current note
      let displayTime = currentNote?.position === 0 ? 12000 : 6000; // 25s for top, 15s for others
  
      // Log the note in position 0
      if (currentNote?.position === 0) {
        console.log("🔝 Alert at position 0:", currentNote);
      }
  
      const interval = setInterval(() => {
        setIsFlipping(true); // Start flip animation
        setTimeout(() => {
          setIsFlipping(false); // Reset animation after it completes
          setCurrentIndex((prev) => (prev + 1) % notes.length); // Change alert
        }, 3000); // Flip duration
      }, displayTime); // Dynamic display time based on position
  
      return () => clearInterval(interval);
    }
  }, [notes, currentIndex]);
  

  const triggerFlip = () => {
    if (notes.length > 1) {
      setIsFlipping(true); // Start flip
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      triggerFlip();
    }, 5000); // Trigger flip every 5 sec

    return () => clearInterval(interval);
  }, [notes]);
  const moveSpecificAlertToTop = async (alertId) => {
    if (!alertId) return;
  
    try {
      const response = await fetch("https://portfoliobackend-ih6t.onrender.com/djnotes/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: alertId }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to move alert to top: ${response.status}`);
      }
  
      console.log(`✅ Alert moved to top!`);
  
      fetchNotes(); // Refresh list so all users see the update
    } catch (error) {
      console.error("❌ Error moving alert to top:", error);
    }
  };
  
  const updateNotesOrderInBackend = async (updatedNotes) => {
    try {
      const response = await fetch("https://portfoliobackend-ih6t.onrender.com/djnotes/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: updatedNotes.map((note, index) => ({ id: note.id, position: index })) }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update note order: ${response.status}`);
      }
  
      console.log("✅ Notes order updated in backend!");
      fetchNotes(); // Refresh notes for all users
    } catch (error) {
      console.error("❌ Error updating note order:", error);
    }
  };
  
  
  
  useEffect(() => {
    try {
        fetchNotes();
        fetchDeletedNotes();
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}, []);




const fetchDeletedNotes = async () => {
    try {
        const response = await fetch("https://portfoliobackend-ih6t.onrender.com/djnotes/deleted", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch deleted notes: ${response.status}`);
        }

        const data = await response.json();
        setDeletedNotes(data);
    } catch (error) {
        console.error("Error fetching deleted notes:", error);
    }
};


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(
            editingId 
                ? `https://portfoliobackend-ih6t.onrender.com/djnotes/${editingId}`  // ✅ Corrected
                : "https://portfoliobackend-ih6t.onrender.com/djnotes",
            {
                method: editingId ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to ${editingId ? "update" : "create"} note: ${response.status}`);
        }
        setFormData({ alert_type: "", alert_details: "" });
        setEditingId(null);
        fetchNotes(); // Refresh list
    } catch (error) {
        console.error("Error submitting note:", error);
    }
};


  const handleEdit = (note) => {
    setFormData({ alert_type: note.alert_type, alert_details: note.alert_details });
    setEditingId(note.id);
  };
  const handleSoftDelete = async (id) => {
    await fetch(`https://portfoliobackend-ih6t.onrender.com/djnotes/${id}`, { method: "DELETE" });
    await fetchNotes();  // ✅ Refresh active notes
    await fetchDeletedNotes(); // ✅ Refresh deleted notes
};

  const handleHardDelete = async (id) => {
    await fetch(`https://portfoliobackend-ih6t.onrender.com/djnotes/${id}/hard_delete`, { method: "DELETE" });
    fetchDeletedNotes();
  };

  return (
    
    <div className="p-6 max-w-3xl  mx-auto">
<div className="mt-6 max-w-md mb-2 mx-auto p-6 rounded-2xl shadow-xl  border-gray-700">
  {user?.is_admin && (
    <>
      <h2 className="text-center text-white text-2xl font-bold mb-4 uppercase tracking-wider">
        🚨 Manage Alerts 🚨
      </h2>

      {/* Quick Alert Buttons */}
      <div className="mb-6 p-5 bg-gray-900 rounded-2xl shadow-xl border border-gray-700 max-w-md mx-auto w-full">
  <label className="block text-white font-bold mb-3 text-lg sm:text-xl flex items-center gap-2">
    🎯 Select Alert to Move to Top:
  </label>

  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
    <select
      className="w-full p-3 text-base sm:text-lg font-semibold bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all hover:border-yellow-400"
      onChange={(e) => setSelectedAlertId(e.target.value)}
      value={selectedAlertId || ""}
    >
      <option value="" disabled>-- Select an Alert --</option>
      {notes.map((note) => (
        <option key={note.id} value={note.id}>
          {note.alert_details}
        </option>
      ))}
    </select>

    <button
      className={`px-4 py-3 text-base sm:text-lg font-bold text-white rounded-lg shadow-md transition-all transform ${
        selectedAlertId
          ? "bg-blue-500 hover:scale-105 hover:bg-blue-600 active:scale-95"
          : "bg-gray-600 cursor-not-allowed"
      }`}
      onClick={() => moveSpecificAlertToTop(selectedAlertId)}
      disabled={!selectedAlertId}
    >
      ⬆️ Move to Top
    </button>
  </div>
</div>

      {/* Alert Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-gray-900 rounded-2xl shadow-xl border border-gray-700">
        {/* Dropdown Selection */}
        <label className="block text-white font-bold mb-2 text-center text-lg">📢 Select Alert Type:</label>
        <select
          name="alert_type"
          value={formData.alert_type}
          onChange={handleChange}
          className="w-full p-3 text-lg text-center font-semibold bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          required
        >
          <option value="">select alert</option>
          <option value="ALERT:">🚨 Breaking News</option>
          <option value="HAPPY BIRTHDAY">🎂 Birthday Shout Out</option>
          <option value="HAPPY ANNIVERSARY">💖 Anniversary Shout Out</option>
          <option value="JUST MARRIED">💍 Just Married</option>
          <option value="SINGLE">💔 SINGLE</option>
          <option value="IN MEMORY">🕊️ In Memory</option>
          <option value="SPOTLIGHT">✨ Spotlight</option>
          <option value="JOKES">😂 Funny Jokes</option>
          <option value="SHAME">😡 SHAME!</option>
        </select>

        {/* Alert Details Textarea */}
        <label className="block text-white font-bold mt-4 mb-2 text-lg">✍️ Alert Details:</label>
        <textarea
          name="alert_details"
          value={formData.alert_details}
          onChange={handleChange}
          placeholder="Enter the alert message here..."
          className="w-full p-3 text-lg bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none placeholder-gray-400"
          required
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 px-6 py-3 text-lg font-bold text-white bg-blue-500 rounded-lg shadow-md transform transition-all hover:scale-105 hover:bg-blue-600 active:scale-95"
        >
          {editingId ? "✏️ Update Alert" : "➕ Add Alert"}
        </button>
      </form>
    </>
  )}
</div>

<h1
  className={`text-lg sm:text-xl md:text-2xl lg:text-3xl 
              text-center font-extrabold py-2 sm:py-3 rounded shadow-lg 
              animate-pulse font-serif break-words px-4 mt-6 w-full max-w-4xl mx-auto
              ${
                notes.length > 0 && notes[currentIndex].alert_type.startsWith("ALERT:")
                  ? "text-white bg-gradient-to-r from-red-700 via-red-600 to-red-500" 
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("JOKES")
                  ? "text-black bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-300"
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("HAPPY BIRTHDAY")
                  ? "text-pink-900 bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300" 
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("HAPPY ANNIVERSARY")
                  ? "text-purple-900 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400" 
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("JUST MARRIED")
                  ? "text-white bg-gradient-to-r from-green-600 via-green-500 to-green-400" 
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("SINGLE")
                  ? "text-white bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500" 
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("IN MEMORY")
                  ? "text-white bg-gradient-to-r from-black via-gray-800 to-gray-700"
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("SHAME") 
                  ? "text-white bg-gradient-to-r from-red-900 via-gray-800 to-red-900"  
                  : "text-yellow-900 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200"
              }`}
>
  {notes.length > 0 && notes[currentIndex].alert_type.startsWith("ALERT:")
    ? "🚨 HOST ALERTS 🚨"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("JOKES")
    ? "🤡 KARA-JOKé 🤡"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("HAPPY BIRTHDAY")
    ? "🎂 BIRTHDAY! 🎉"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("HAPPY ANNIVERSARY")
    ? "💖 ANNIVERSARY 💍"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("JUST MARRIED")
    ? "💍 NEWLY WEDS! 💞"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("SINGLE")
    ? "🔥 SINGLE! 🍻"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("IN MEMORY")
    ? "🕊️ IN LOVING MEMORY 🕯️"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("SHAME") 
    ? "🗑️ SHAME ALERT 🤬" 
    : "📸 SPOTLIGHT 📸"}
</h1>




<div className="relative w-full max-w-md mx-auto mt-6">
  {notes.length > 0 && (
    <div
  className={`border-4 p-6 rounded-2xl shadow-2xl text-center transform scale-105 animate-opacity transition-all duration-500 ${
    notes.length > 0 ? getAlertStyles(notes[currentIndex].alert_type) : "bg-yellow-300 text-yellow-900 border-yellow-500"
  } hover:scale-105`}
>

      {/* Alert Content */}
      <p className="text-lg italic max-h-32 overflow-auto break-words p-4 rounded-lg bg-white bg-opacity-70 border border-gray-300 shadow-inner backdrop-blur-md text-black font-bold tracking-wide">
        {notes[currentIndex].alert_details}
      </p>

      {/* 🎉 Action Buttons - Admin Only */}
      {user?.is_admin && (
        <div className="flex justify-center space-x-4 mt-6">
          <button 
            onClick={() => handleEdit(notes[currentIndex])} 
            className="px-2  text-lg font-bold text-black bg-yellow-400 rounded-lg shadow-lg transform transition-all hover:scale-110 hover:bg-yellow-500 active:scale-95"
          >
            ✏️ Edit
          </button>

          <button 
            onClick={() => handleSoftDelete(notes[currentIndex].id)} 
            className="px-2  text-lg font-bold text-white bg-red-500 rounded-lg shadow-lg transform transition-all hover:scale-110 hover:bg-red-600 active:scale-95"
          >
            ❌ Delete
          </button>
        </div>
      )}

      {/* 🌟 Manual Navigation Buttons */}
      <div className="flex justify-between mt-4 w-full">
        <button 
          onClick={() => setCurrentIndex((prev) => (prev - 1 + notes.length) % notes.length)}
          className="text-blue-600 font-extrabold text-3xl transform transition-all hover:scale-125"
        >
          ⬅️
        </button>
        <button 
          onClick={() => setCurrentIndex((prev) => (prev + 1) % notes.length)}
          className="text-blue-600 font-extrabold text-3xl transform transition-all hover:scale-125"
        >
          ➡️
        </button>
      </div>
    </div>
  )}
</div>




    </div>
  );
}
