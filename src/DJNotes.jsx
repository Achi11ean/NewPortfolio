import { useState, useEffect } from "react";

export default function DJNotesApp({ user, notes, fetchNotes }) {

  const [deletedNotes, setDeletedNotes] = useState([]);
  const [formData, setFormData] = useState({ alert_type: "", alert_details: "" });
  const [editingId, setEditingId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const getAlertStyles = (alertType) => {
    if (alertType.startsWith("ALERT:")) {
      return "bg-red-600 text-white border-red-800";
    } else if (alertType.startsWith("HAPPY BIRTHDAY")) {
      return "bg-pink-300 text-pink-800 border-pink-500";
    } else if (alertType.startsWith("HAPPY ANNIVERSARY")) {
      return "bg-purple-300 text-purple-800 border-purple-500";
    } else if (alertType.startsWith("JUST MARRIED")) {
      return "bg-green-500 text-white border-green-700";
    } else if (alertType.startsWith("SINGLE")) {
      return "bg-gray-600 text-white border-gray-800";
    } else if (alertType.startsWith("JOKES")) {
      return "bg-yellow-500 text-black border-yellow-700";
    } else if (alertType.startsWith("IN MEMORY")) {
      return "bg-black text-white border-gray-500";
    } else if (alertType.startsWith("JOKES")) {
      return "bg-blue-500 text-white border-blue-700";
    } else if (alertType.startsWith("SHAME")) {
      return "bg-gradient-to-r from-red-900 via-gray-800 to-red-900 text-white border-red-700"; // New SHAME style
    } else {
      return "bg-yellow-300 text-yellow-800 border-yellow-500"; // Default (Spotlight)
    }
  };
  
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
      const interval = setInterval(() => {
        setIsFlipping(true); // Start flip animation
        setTimeout(() => {
          setIsFlipping(false); // Reset animation after it completes
          setCurrentIndex((prev) => (prev + 1) % notes.length); // Change alert
        }, 3000); // Flip duration (adjust if needed)
      }, 15000); // Change alert every 15 sec

      return () => clearInterval(interval);
    }
  }, [notes]);
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
  const moveAlertToTop = (type) => {
    setNotes((prevNotes) => {
      const matchingAlerts = prevNotes.filter((note) => note.alert_type.startsWith(type));
      const otherAlerts = prevNotes.filter((note) => !note.alert_type.startsWith(type));
  
      // Reset index to show the moved alert immediately
      if (matchingAlerts.length > 0) {
        setCurrentIndex(0);
      }
  
      return [...matchingAlerts, ...otherAlerts];
    });
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
      <div className="flex gap-3 mb-6 overflow-x-auto whitespace-nowrap p-2 bg-gray-800 rounded-lg shadow-lg">
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-base font-bold transform transition-all hover:scale-110 hover:bg-red-700" onClick={() => moveAlertToTop("ALERT:")}>
          🚨 ALERT
        </button>
        <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-base font-bold transform transition-all hover:scale-110 hover:bg-pink-600" onClick={() => moveAlertToTop("HAPPY BIRTHDAY")}>
          🎂 BIRTHDAY
        </button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-base font-bold transform transition-all hover:scale-110 hover:bg-purple-600" onClick={() => moveAlertToTop("HAPPY ANNIVERSARY")}>
          💞 ANNIVERSARY
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-base font-bold transform transition-all hover:scale-110 hover:bg-green-600" onClick={() => moveAlertToTop("JUST MARRIED")}>
          💒 MARRIED
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg text-base font-bold transform transition-all hover:scale-110 hover:bg-gray-700" onClick={() => moveAlertToTop("SINGLE")}>
          💔 SINGLE
        </button>
        <button className="bg-black text-white px-4 py-2 rounded-lg text-base font-bold transform transition-all hover:scale-110 hover:bg-gray-900" onClick={() => moveAlertToTop("IN MEMORY")}>
          🪦 MEMORY
        </button>
        <button className="bg-blue-500 text-black px-4 py-2 rounded-lg text-base font-bold transform transition-all hover:scale-110 hover:bg-yellow-600" onClick={() => moveAlertToTop("JOKES")}>
          😂 JOKES
        </button>
        <button className="bg-red-900 text-white px-4 py-2 rounded-lg text-base font-bold transform transition-all hover:scale-110 hover:bg-red-800" onClick={() => moveAlertToTop("SHAME")}>
          😡 SHAME
        </button>
      </div>

      {/* Alert Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-gray-900 rounded-2xl shadow-xl border border-gray-700">
        {/* Dropdown Selection */}
        <label className="block text-white font-bold mb-2 text-lg">📢 Select Alert Type:</label>
        <select
          name="alert_type"
          value={formData.alert_type}
          onChange={handleChange}
          className="w-full p-3 text-lg font-semibold bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          required
        >
          <option value="">-- Select Alert Type --</option>
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

<div className="mt-8 text-center  p-6 bg-black bg-opacity-10 backdrop-blur-md rounded-3xl shadow-xl border border-gray-700 max-w-lg mx-auto">
  {/* Title */}
  <h2 className="text-md sm:text-4xl underline font-extrabold  bg-gradient-to-r from-yellow-300 via-red-500 to-pink-600  text-transparent bg-clip-text drop-shadow-xl p-3 rounded-lg shadow-md backdrop-blur-md bg-opacity-90">
  🎤 Show Some Love! 💕
</h2>

  <p className="text-lg text-black mt-2">
    Enjoying the show? Tips are always appreciated, and never required but your support sure does cheer the host up! 🙌✨
  </p>

  {/* Venmo */}
  <div className="mt-5">
    <a 
      href="https://venmo.com/u/Jonathen-Whitford" 
      target="_blank" 
      rel="noopener noreferrer"
      className="block bg-blue-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
    >
      💙 Tip via Venmo
    </a>
  </div>

  {/* Cash App */}
  <div className="mt-4">
    <a 
      href="https://cash.app/$pikachu55" 
      target="_blank" 
      rel="noopener noreferrer"
      className="block bg-green-500 hover:bg-yellow-600 hover:text-white text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
    >
      💚 Tip via Cash App
    </a>
  </div>

  {/* Fun Message */}

</div>

<h1
  className={`text-lg sm:text-xl md:text-2xl lg:text-3xl 
              text-center font-extrabold py-2 sm:py-3 rounded shadow-lg 
              animate-pulse font-serif break-words px-4 mt-6 w-full max-w-4xl mx-auto
              ${
                notes.length > 0 && notes[currentIndex].alert_type.startsWith("ALERT:")
                  ? "text-white bg-red-600" 
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("JOKES")
                  ? "text-yellow-500 bg-blue-500"
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("HAPPY BIRTHDAY")
                  ? "text-pink-800 bg-pink-300" 
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("HAPPY ANNIVERSARY")
                  ? "text-purple-800 bg-purple-300" 
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("JUST MARRIED")
                  ? "text-white bg-green-500" 
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("SINGLE")
                  ? "text-white bg-gray-600" 
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("IN MEMORY")
                  ? "text-white bg-black"
                  : notes.length > 0 && notes[currentIndex].alert_type.startsWith("SHAME") 
                  ? "text-white bg-red-900"  
                  : "text-yellow-800 bg-yellow-300"
              }`}
>
  {notes.length > 0 && notes[currentIndex].alert_type.startsWith("ALERT:")
    ? "🚨 HOST ALERTS 🚨"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("JOKES")
    ? "🤡 KARA-JOKé 🤡"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("HAPPY BIRTHDAY")
    ? "🎂BIRTHDAY!🎉"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("HAPPY ANNIVERSARY")
    ? "💖 ANNIVERSARY 💍"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("JUST MARRIED")
    ? "💍 NEWLY WEDS!💞"
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
