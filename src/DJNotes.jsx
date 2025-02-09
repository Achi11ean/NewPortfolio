import { useState, useEffect } from "react";

export default function DJNotesApp({ user }) {
    const [notes, setNotes] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [formData, setFormData] = useState({ alert_type: "", alert_details: "" });
  const [editingId, setEditingId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
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


  const fetchNotes = async () => {
    try {
        const response = await fetch("https://portfoliobackend-ih6t.onrender.com/djnotesactive", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch notes: ${response.status}`);
        }

        const data = await response.json();
        setNotes(data);
    } catch (error) {
        console.error("Error fetching notes:", error);
    }
};

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
    
    <div className="p-6 max-w-4xl  mx-auto">
<h1
  className={`text-3xl text-center font-extrabold py-3 rounded shadow-lg animate-pulse ${
    notes.length > 0 && notes[currentIndex].alert_type.startsWith("ALERT:")
      ? "text-white bg-red-600" // Breaking News
      : notes.length > 0 && notes[currentIndex].alert_type.startsWith("HAPPY BIRTHDAY")
      ? "text-pink-800 bg-pink-300" // Birthday Shout Out
      : notes.length > 0 && notes[currentIndex].alert_type.startsWith("HAPPY ANNIVERSARY")
      ? "text-purple-800 bg-purple-300" // Anniversary Shout Out
      : notes.length > 0 && notes[currentIndex].alert_type.startsWith("JUST MARRIED")
      ? "text-white bg-green-500" // Just Married
      : notes.length > 0 && notes[currentIndex].alert_type.startsWith("JUST DIVORCED")
      ? "text-white bg-gray-600" // Just Divorced
      : notes.length > 0 && notes[currentIndex].alert_type.startsWith("IN MEMORY")
      ? "text-white bg-black" // In Memory (solemn)
      : "text-yellow-800 bg-yellow-300" // Spotlight
  }`}
>
  {notes.length > 0 && notes[currentIndex].alert_type.startsWith("ALERT:")
    ? "🚨 BREAKING NEWS 🚨"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("HAPPY BIRTHDAY")
    ? "🎂 BIRTHDAY SHOUT OUT! 🎉"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("HAPPY ANNIVERSARY")
    ? "💖 ANNIVERSARY SHOUT OUT! 💍"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("JUST MARRIED")
    ? "💍 JUST MARRIED! 💞 🎊"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("JUST DIVORCED")
    ? "🔥 JUST DIVORCED! 🍻"
    : notes.length > 0 && notes[currentIndex].alert_type.startsWith("IN MEMORY")
    ? "🕊️ IN LOVING MEMORY 🕯️"
    : "✨ SPOTLIGHT ✨"}
</h1>

{user?.is_admin && (
  <>
    <div className="flex gap-2 mb-4">
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => moveAlertToTop("ALERT:")}>
        🔥 Bring Back Breaking News
      </button>
      <button className="bg-pink-500 text-white px-4 py-2 rounded" onClick={() => moveAlertToTop("HAPPY BIRTHDAY")}>
        🎂 Show Birthday Shout Out
      </button>
      <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={() => moveAlertToTop("HAPPY ANNIVERSARY")}>
        💖 Show Anniversary Shout Out
      </button>
      <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => moveAlertToTop("JUST MARRIED")}>
        💍 Show Just Married
      </button>
      <button className="bg-gray-600 text-white px-4 py-2 rounded" onClick={() => moveAlertToTop("JUST DIVORCED")}>
        💔 Show Just Divorced
      </button>
      <button className="bg-black text-white px-4 py-2 rounded" onClick={() => moveAlertToTop("IN MEMORY")}>
        🕊️ Show In Memory
      </button>
    </div>

    <form onSubmit={handleSubmit} className="mb-6">
    <select
  name="alert_type"
  value={formData.alert_type}
  onChange={handleChange}
  className="border p-2 rounded w-full mb-2 bg-black text-white"
  required
>
  <option value="">-- Select Alert Type --</option>
  <option value="ALERT:">🚨 Breaking News</option>
  <option value="HAPPY BIRTHDAY">🎂 Birthday Shout Out</option>
  <option value="HAPPY ANNIVERSARY">💖 Anniversary Shout Out</option>
  <option value="JUST MARRIED">💍 Just Married</option>
  <option value="JUST DIVORCED">💔 Just Divorced</option>
  <option value="IN MEMORY">🕊️ In Memory</option>
  <option value="SPOTLIGHT">Spotlight</option>

</select>
      <textarea
        name="alert_details"
        value={formData.alert_details}
        onChange={handleChange}
        placeholder="Alert Details"
        className="border p-2 rounded text-white bg-black w-full mb-2"
        required
      ></textarea>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {editingId ? "Update Note" : "Add Note"}
      </button>
    </form>
  </>
)}

      <div className="relative w-full max-w-md mx-auto mt-6">
      {notes.length > 0 && (
        <div
          className={`border p-6 rounded-lg shadow-lg bg-blue-200 text-center transform scale-105 animate-opacity ${
            isFlipping ? "animate-flip" : ""
          }`}
        >

          <div className="border p-4 rounded-lg bg-white shadow-md flex flex-col items-center">
            <p className="font-semibold text-lg">{notes[currentIndex].alert_type}</p>
            <p className="text-gray-700 italic">{notes[currentIndex].alert_details}</p>
            {user?.is_admin && (

            <div className="flex space-x-2 mt-4">
                
              <button 
                onClick={() => handleEdit(notes[currentIndex])} 
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button 
                onClick={() => handleSoftDelete(notes[currentIndex].id)} 
                className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
              >
                Soft Delete
              </button>
            </div>
            )}
            {/* Manual Navigation Buttons */}
            <div className="flex justify-between mt-4 w-full">
              <button 
                onClick={() => setCurrentIndex((prev) => (prev - 1 + notes.length) % notes.length)}
                className="text-blue-600 font-bold"
              >
                ⬅️ Previous
              </button>
              <button 
                onClick={() => setCurrentIndex((prev) => (prev + 1) % notes.length)}
                className="text-blue-600 font-bold"
              >
                Next ➡️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    

    </div>
  );
}
