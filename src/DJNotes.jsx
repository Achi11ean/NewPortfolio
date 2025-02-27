import { useState, useEffect } from "react";

export default function DJNotesApp({ user, notes, fetchNotes }) {

  const [deletedNotes, setDeletedNotes] = useState([]);
  const [formData, setFormData] = useState({ alert_type: "", alert_details: "" });
  const [editingId, setEditingId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
const getAlertStyles = (alertType) => {
    if (alertType.startsWith("ALERT:")) {
      return `animate-police-siren animate-alert-shake text-white font-extrabold text-2xl sm:text-3xl 
              uppercase tracking-widest p-4 sm:p-6 border-4 border-red-800 
              rounded-xl shadow-[0px_0px_25px_rgba(255,0,0,0.8),0px_0px_50px_rgba(0,0,255,0.7)] 
              transform hover:scale-105 transition-all ease-in-out duration-300`;
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
      // 🌟 Spotlight effect with falling sparkles & neon siren effect
      return `relative animate-award-spotlight sparkle-effect text-yellow-900 
      border border-yellow-500 shadow-[0px_0px_20px_rgba(255,215,0,0.8),0px_0px_40px_rgba(255,255,255,0.7)] 
      transform scale-105 transition-all duration-500 ease-in-out overflow-hidden`;

    }
};


  
  
  
  const [selectedAlertId, setSelectedAlertId] = useState(null);

  const handleHardDeleteAll = async () => {
    const confirmDelete = window.confirm("Are you sure you want to PERMANENTLY DELETE ALL DJ NOTES? This action CANNOT be undone!");

    if (!confirmDelete) return;

    try {
        const response = await fetch("http://127.0.0.1:5000/djnotes/hard_delete_all", {
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
    if (notes.length > 0) {
      const currentNote = notes[currentIndex]; // Get the current note
    
      // ✅ Check if the alert type is "ALERT:" or "SPOTLIGHT"
      let displayTime =
        currentNote?.alert_type.startsWith("ALERT:") || currentNote?.alert_type.startsWith("SPOTLIGHT")
          ? 18000 // ⏳ 12 seconds for Breaking News & Spotlight
          : 6000; // ⏳ 6 seconds for all other alerts
  
      console.log(
        `🕒 Displaying Alert: ${currentNote?.alert_details} for ${displayTime / 1000} seconds`
      );
  
      const interval = setInterval(() => {
        setIsFlipping(true); // Start flip animation
  
        setTimeout(() => {
          setIsFlipping(false); // Reset animation after it completes
          setCurrentIndex((prev) => (prev + 1) % notes.length); // Change alert
        }, 3000); // Flip duration
      }, displayTime); // Dynamic display time based on alert type
  
      return () => clearInterval(interval);
    }
  }, [notes, currentIndex]);
  

  const triggerFlip = () => {
    if (notes.length > 1) {
      setIsFlipping(true); // Start flip
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
        const response = await fetch("http://127.0.0.1:5000/djnotes/deleted", {
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
                ? `http://127.0.0.1:5000/djnotes/${editingId}`  // ✅ Corrected
                : "http://127.0.0.1:5000/djnotes",
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
    await fetch(`http://127.0.0.1:5000/djnotes/${id}`, { method: "DELETE" });
    await fetchNotes();  // ✅ Refresh active notes
    await fetchDeletedNotes(); // ✅ Refresh deleted notes
};

  const handleHardDelete = async (id) => {
    await fetch(`http://127.0.0.1:5000/djnotes/${id}/hard_delete`, { method: "DELETE" });
    fetchDeletedNotes();
  };



  
  return (
    
    <div className="p-6 max-w-3xl  mx-auto">
<div className="mt-6 max-w-md mb-2 mx-auto p-6 rounded-2xl shadow-md  border-gray-700">
  {user?.is_admin && (
    <>
      <h2 className="text-center text-white text-2xl font-bold mb-4 uppercase tracking-wider">
        🚨 Manage Alerts 🚨
      </h2>

      {/* Quick Alert Buttons */}


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
      <p className="text-lg  max-h-32 overflow-auto break-words p-4 rounded-lg bg-white bg-opacity-70 border border-gray-300 shadow-inner backdrop-blur-md text-black font- font-bold tracking-wider">
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
