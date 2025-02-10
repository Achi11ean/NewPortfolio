import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext"; // Adjust the path accordingly
import DJNotesApp from "./DJNotes";
import Promotions from "./Promotions"; // Adjust the path based on where the file is
import "./App.css"
export default function KaraokeSignup() {
  const guidelinesRef = useRef(null);
  useEffect(() => {
    const scrollContainer = guidelinesRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 1; // Adjust speed (higher = slower)
    const scrollInterval = 50; // Time between scrolls in ms

    const scrollGuidelines = setInterval(() => {
      if (scrollContainer) {
        scrollContainer.scrollTop += scrollStep;
        scrollAmount += scrollStep;

        // If scrolled to the bottom, reset to the top
        if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
          scrollContainer.scrollTop = 0;
          scrollAmount = 0;
        }
      }
    }, scrollInterval); 
    return () => clearInterval(scrollGuidelines);
}, []);
  const [signups, setSignups] = useState([]);
  const [form, setForm] = useState({ name: "", song: "", artist: "" });
  const [editingId, setEditingId] = useState(null);
  const [issues, setIssues] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [signupsOpen, setSignupsOpen] = useState(true);
  const [flaggedArtists, setFlaggedArtists] = useState([]);

  const [deletedSignups, setDeletedSignups] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
const [showDeletedNotes, setShowDeletedNotes] = useState(false);
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

const fetchDeletedNotes = async () => {
    try {
        const response = await fetch("https://portfoliobackend-ih6t.onrender.com/djnotes/deleted");

        if (!response.ok) {
            throw new Error(`Failed to fetch deleted DJ Notes: ${response.status}`);
        }

        const data = await response.json();
        console.log("Deleted DJ Notes Data:", data); // Debugging log

        // Ensure data is valid
        if (!Array.isArray(data)) {
            console.error("Invalid response format:", data);
            return;
        }

        // Sort by creation time (newest first)
        const sortedDeletedNotes = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setDeletedNotes(sortedDeletedNotes);
    } catch (error) {
        console.error("Error fetching deleted DJ Notes:", error);
    }
};

const [showDeleted, setShowDeleted] = useState(false); // Toggle state
const fetchDeletedSignups = async () => {
    try {
        const response = await fetch("https://portfoliobackend-ih6t.onrender.com/karaokesignup/deleted");

        if (!response.ok) {
            throw new Error(`Failed to fetch deleted signups: ${response.status}`);
        }

        const data = await response.json();

        console.log("Deleted Signups Data:", data); // Debugging log

        // Ensure data is not null/undefined
        if (!Array.isArray(data)) {
            console.error("Invalid response format:", data);
            return;
        }

        // Sort by creation time
        const sortedDeletedSignups = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        setDeletedSignups(sortedDeletedSignups);
    } catch (error) {
        console.error("Error fetching deleted signups:", error);
    }
};


  const fetchFormState = async () => {
    try {
      const response = await fetch("https://portfoliobackend-ih6t.onrender.com/formstate");
      if (!response.ok) {
        throw new Error("Failed to fetch form state");
      }
      const data = await response.json();
      setShowForm(data.show_form || false); // Default to false if no value exists
      setLastUpdated(data.last_updated ? new Date(data.last_updated).toLocaleString() : "Unknown"); // Store formatted timestamp
    } catch (error) {
      console.error("Error fetching form state:", error);
    }
  };
  const sortByTime = async () => {
    try {
        const response = await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup/sort`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "sort_by_time" }), // Correct backend action
        });

        if (!response.ok) {
            throw new Error("Failed to sort signups by time.");
        }

        const result = await response.json();
        console.log("Sort Response:", result); // Debugging log

        fetchSignups(); // Refresh list to reflect sorted order
    } catch (error) {
        console.error("Error sorting by time:", error);
    }
};
const [flaggedSignups, setFlaggedSignups] = useState([]); // Store full flagged entries

const fetchFlaggedSignups = async () => {
  try {
      const response = await fetch("https://portfoliobackend-ih6t.onrender.com/karaokesignup/flagged");

      if (!response.ok) {
          throw new Error(`Failed to fetch flagged signups: ${response.status}`);
      }

      let data = await response.json();
      console.log("🚨 Flagged Signups Data:", data); // Debugging log

      setFlaggedSignups(data); // ✅ Store full flagged signup data

      // ✅ Automatically update `issues` state
      const updatedIssues = {};
      data.forEach(signup => {
          updatedIssues[signup.id] = true; // Ensure all flagged signups are marked as true
      });

      console.log("🛠 Updating Issues State for Flagged Signups:", updatedIssues);
      setIssues(prevIssues => ({ ...prevIssues, ...updatedIssues })); // ✅ Merge with existing state

  } catch (error) {
      console.error("Error fetching flagged signups:", error);
  }
};

  const [lastUpdated, setLastUpdated] = useState(null);

  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete ALL signups? This action cannot be undone!");
    if (confirmDelete) {
      const response = await fetch("https://portfoliobackend-ih6t.onrender.com/karaokesignup", { method: "DELETE" });
      if (response.ok) {
        fetchSignups(); // Refresh the list
        alert("All signups have been deleted successfully!");
      } else {
        alert("Error deleting signups. Please try again.");
      }
    }
  };
  const handleHardDeleteSoftDeleted = async () => {
    const confirmDelete = window.confirm("🚨 Are you sure you want to PERMANENTLY DELETE all soft-deleted signups? This action CANNOT be undone!");
    
    if (!confirmDelete) return;

    try {
        const response = await fetch("https://portfoliobackend-ih6t.onrender.com/karaokesignup/hard_delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Error hard deleting soft-deleted signups: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Hard delete response:", data);
        alert(`✅ ${data.message}`);

        fetchDeletedSignups(); // Refresh the deleted signups list
    } catch (error) {
        console.error("❌ Error hard deleting soft-deleted signups:", error);
        alert("❌ Failed to hard delete soft-deleted signups. Please try again.");
    }
};

  
  const [editForm, setEditForm] = useState({ name: "", song: "", artist: "" });
  const moveUpFive = async (id, index) => {
    if (index < 5) return; 

    await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "up5" }), // Corrected key
    });

    fetchSignups();
};

const moveDownFive = async (id, index) => {
    if (index >= signups.length - 5) return;

    await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "down5" }), // Corrected key
    });

    fetchSignups();
};
const moveToFirst = async (id) => {
    if (!id) {
        console.error("Invalid ID for moveToFirst:", id);
        return;
    }

    await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "to_first" }), // Matches backend
    });

    fetchSignups(); // Refresh the list
};

const moveToSecond = async (id, index) => {
    if (index <= 1) return; // Prevent unnecessary movement

    await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "up_next" }), // Correct action for backend
    });

    fetchSignups();
};
const [isRefreshing, setIsRefreshing] = useState(false);
const handleRefresh = async () => {
  console.log("🔄 Refreshing Everything...");
  
  setIsRefreshing(true); // Start animation

  // Run all fetch functions in parallel for efficiency
  await Promise.all([
    fetchSignups(),
    fetchFormState(),
    fetchDeletedSignups(),
    fetchDeletedNotes(),
    fetchFlaggedSignups()
  ]);

  setTimeout(() => setIsRefreshing(false), 1000); // Stop after 1 sec (smooth UI)
};

const [isSubmitting, setIsSubmitting] = useState(false);
  const [effects, setEffects] = useState([]);

// Move an entry up
const moveUp = async (id, index) => {
    console.log(`Attempting to move up signup with ID: ${id} at index: ${index}`);

    if (!id || id === 0) {
        console.error("Invalid ID received:", id);
        return;
    }
    
    await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "up" }),
    });

    fetchSignups();
};


const moveDown = async (id) => {
    if (!id || id === 0) {
        console.error("Invalid ID received:", id);
        return;
    }
    
    await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "down" }),
    });

    fetchSignups();
};
const fetchSignups = async (searchTerm = "") => {
  try {
      const response = await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup?search=${encodeURIComponent(searchTerm)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
          throw new Error(`Failed to fetch signups: ${response.status}`);
      }

      let data = await response.json();

      // Log each signup's is_flagged status
      console.log("🚦 Signups received:");
      data.forEach((signup, index) => {
          console.log(`🎤 #${index + 1}: ID: ${signup.id}, Name: ${signup.name}, is_flagged: ${signup.is_flagged}`);
      });

      // Ensure it's sorted by position
      data = data.sort((a, b) => a.position - b.position);

      setSignups(data);

      // ✅ Automatically update `issues` state
      const updatedIssues = {};
      data.forEach(signup => {
          updatedIssues[signup.id] = signup.is_flagged;
      });

      console.log("🛠 Updating Issues State:", updatedIssues);
      setIssues(updatedIssues); // ✅ Now the UI will reflect flags on load!
      
  } catch (error) {
      console.error("Error fetching signups:", error);
  }
};


    const toggleIssue = async (id, currentStatus) => {
        console.log(`Toggling issue for ID: ${id}, current status: ${currentStatus}`);
        try {
            const response = await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_flagged: !currentStatus }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log("Server response:", result);
    
            // Update local state immediately to reflect the change
            setIssues((prev) => ({
                ...prev,
                [id]: !currentStatus, // Toggle the issue status
            }));
    
            fetchSignups(); // Refresh the list after updating
        } catch (error) {
            console.error("Error toggling issue:", error);
        }
    };
    const toggleFormVisibility = async () => {
        const newShowForm = !showForm;
        const response = await fetch("https://portfoliobackend-ih6t.onrender.com/formstate", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ show_form: newShowForm }),
        });
      
        if (response.ok) {
          setShowForm(newShowForm); // Update state if request is successful
        } else {
          console.error("Error updating form state");
        }
      };
      
    
    // Move an entry down

  
    useEffect(() => {
        fetchSignups();
        fetchFormState();
        fetchDeletedNotes();  // ✅ Fetch deleted DJ notes on mount
    }, []);
    
  // POST: Add new signup
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Fetch all signups, including soft-deleted ones
    let allSignups = [];
    try {
        const response = await fetch("https://portfoliobackend-ih6t.onrender.com/karaokesignup/all"); // ✅ New endpoint for ALL signups
        if (response.ok) {
            allSignups = await response.json();
        } else {
            console.error("Failed to fetch all signups.");
        }
    } catch (error) {
        console.error("Error fetching all signups:", error);
    }
  
    // Check if the song has already been performed tonight
    const songAlreadySung = allSignups.some(
        (signup) =>
            signup.song.toLowerCase() === form.song.toLowerCase() &&
            signup.artist.toLowerCase() === form.artist.toLowerCase()
    );

    if (songAlreadySung) {
        const confirmProceed = window.confirm(
            "⚠️ This song has been performed tonight already! We don’t mind if you perform it again, but just wanted to give you a heads-up!\n\nDo you want to continue?"
        );
        if (!confirmProceed) return; // If they click "No", stop submission
    }
  
    // Count occurrences of the entered name (case insensitive)
    const nameCount = signups.filter(
        (signup) => signup.name.toLowerCase() === form.name.toLowerCase()
    ).length;
  
    // Prevent submission if the name appears twice already
    if (nameCount >= 2) {
        alert(`The name "${form.name}" is already used twice! Only two songs at a time per person please!`);
        return;
    }
  
    setIsSubmitting(true); // Start animation
  
    const response = await fetch("https://portfoliobackend-ih6t.onrender.com/karaokesignup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
    });

    const data = await response.json();
  
    if (response.status === 403) {
        alert(data.error);
        setIsSubmitting(false); // Stop animation if failed
        return;
    }
  
    if (response.ok) {
        fetchSignups();
        setForm({ name: "", song: "", artist: "" });
      
        // Trigger falling effects
        triggerEffects();

        setTimeout(() => setIsSubmitting(false), 1500); // Reset after 1.5s
    }
};

  const triggerEffects = () => {
    let newEffects = [];
    
    for (let i = 0; i < 15; i++) { // Generate 15 falling emojis
      newEffects.push({
        id: Math.random(),
        left: Math.random() * 100, // Random position
        duration: Math.random() * 2 + 1 // Random fall speed
      });
    }

    setEffects(newEffects);

    // Remove effects after animation completes
    setTimeout(() => setEffects([]), 3000);
  };

  
  const { user } = useAuth();

  // PATCH: Update a signup
  const handleEditSubmit = async (id) => {
    const response = await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (response.ok) {
      fetchSignups();
      setEditingId(null); // Exit edit mode
    }
  };
  const handleSoftDelete = async (id) => {
    try {
        const response = await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/soft_delete`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Failed to soft delete signup.");
        }

        console.log(`✅ Signup ID ${id} soft deleted. Fetching updated signups...`);
        await fetchSignups(); // ✅ Refresh the list after soft delete

    } catch (error) {
        console.error("❌ Error soft deleting signup:", error);
    }
};

  // DELETE: Remove a signup
  const handleDelete = async (id) => {
    await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}`, { method: "DELETE" });
    fetchSignups();
  };


  return (
<div 
  className="max-w-4xl item-center justify-center mx-auto p-4 bg-cover bg-center" 
  style={{ backgroundImage: "url('party.webp')" }}
>    <div className="relative">
      {/* 🎤 Falling sparkles & mic effects */}
      {effects.map((effect) => (
        <span
          key={effect.id}
          className="falling-effect"
          style={{
            left: `${effect.left}%`,
            animationDuration: `${effect.duration}s`
          }}
        >
          {Math.random() > 0.5 ? "✨" : "🎤"}
        </span>
      ))}
<div className="flex flex-col items-center justify-center  px-4 sm:px-8 md:px-16 lg:px-24">
  
  {/* Title */}
  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center drop-shadow-lg p-4 sm:p-6 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl inline-block font-[Aspire]">
    🎤 Jwhit Karaoke 🎶
  </h1>
  <Promotions />

  {/* Subtitle */}
  {user?.is_admin && (

  <h1
  className={`mt-16 font-extrabold mb-6 text-center text-white drop-shadow-lg 
    ${showForm ? "text-2xl xs:text-3xl sm:text-4xl md:text-5xl" : "text-xl xs:text-2xl sm:text-3xl md:text-4xl"}`}
>
  {showForm ? "🎤Sign-up 🎶" : "🛑Sign Up is currently closed, Sorry!🛑"}
</h1>
  )}

  {user?.is_admin && (

  <button
  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4"
  onClick={toggleFormVisibility}
>
  {showForm ? "Hide Sign-Up Form ⬆️" : "Show Sign-Up Form ⬇️"}
</button>

  )}
  {/* Sign-up Form */}
  <h2 className="text-2xl sm:text-3xl md:text-4xl mb-5 lg:text-5xl font-extrabold text-white text-center drop-shadow-lg mt-6 p-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-xl">
  {showForm ? "🕒 Sign ups opened at:" : "🛑 Sign ups closed at:"}
  <br />
  <span className="text-yellow-200 text-3xl sm:text-4xl md:text-5xl block mt-2">
    {lastUpdated 
      ? new Date(new Date(lastUpdated).getTime() - 5 * 60 * 60 * 1000).toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true, // Ensures AM/PM format
        })
      : "N/A"}
  </span>
</h2>


  {showForm && (

  <form 
    onSubmit={handleSubmit} 
    className="w-full max-w-md  bg-opacity-80 bg-white backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl space-y-4 border border-gray-700 flex flex-col items-center"
  >
    {/* Name Input */}
    <input
      type="text"
      placeholder="Your Name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      className="w-full px-4 py-3 bg-black text-white text-2xl text-center rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
      required
    />

    {/* Song Input */}
    <input
      type="text"
      placeholder="Song"
      value={form.song}
      onChange={(e) => setForm({ ...form, song: e.target.value })}
      className="w-full px-4 py-3 bg-black text-white text-2xl text-center rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
      required
    />

    {/* Artist Input */}
    <input
      type="text"
      placeholder="Artist"
      value={form.artist}
      onChange={(e) => setForm({ ...form, artist: e.target.value })}
      className="w-full px-4 py-3 bg-black text-white text-2xl text-center rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
      required
    />

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full mt-26 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-2xl py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
    >
      Sign Up 🎶
    </button>
  </form>
  )}
</div>
<h2 className="text-3xl underline font-bold mb-2 mt-10 text-center text-white 
               bg-black p-3 rounded-lg animate-police-siren">
  🚦 Karaoke Guidelines 🚦
</h2>

<div 
      className="max-w-lg mx-auto bg-gray-800 text-white p-4 rounded-lg shadow-lg overflow-y-auto  mb-10 max-h-64"
      ref={guidelinesRef} // 🔥 Reference the scroll container
    >
      <ul className="list-disc text-lg text-center pl-5 space-y-2">
        <li><strong>Respect:</strong> <br /> Everyone gets their moment to shine! Disrespect toward singers or staff will result in removal from the queue.</li>
        <li><strong>Two Songs at a time:</strong> <br /> To keep it fair, you can only submit two songs at one time.</li>
        <li><strong>Tips Appreciated, Not Required:</strong> <br /> Tipping is welcome but does not guarantee priority.</li>
        <li><strong>Song Availability:</strong> <br /> If your song isn't available, it will be flagged.</li>
        <li><strong>Celebrations:</strong> <br /> Let us know if it's your birthday or a special occasion!</li>
        <li><strong>Host Authority:</strong> <br /> The host may adjust the queue but will keep it fair.</li>
        <li><strong>Most Important Rule:</strong> <br /> HAVE FUN! Enjoy your time on stage and cheer for fellow performers.</li>
        <li><strong>Leave a Review:</strong> <br /> Loving the experience? Leave a review and snap a photo!</li>
      </ul>
    </div>
{/* Display Flagged Artists List */}
{flaggedSignups.length > 0 && (
  <div className="max-w-lg mx-auto bg-red-700 text-white p-4 rounded-lg shadow-lg mt-6">
    <h3 className="text-xl font-bold text-center">🚨 Flagged Signups 🚨</h3>
    <ul className="list-none text-lg text-center mt-2 space-y-2">
      {flaggedSignups.map((signup, index) => (
        <li key={signup.id} className="border-b border-gray-300 pb-2">
          <p className="text-xl font-bold">{signup.name}</p>
          <p className="text-lg">🎶 {signup.song} - {signup.artist}</p>
          <p className="text-sm text-gray-200">⏰ {new Date(signup.created_at).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  </div>
)}


    <div>
    <DJNotesApp user={user} />
    </div>

    <button
      className={`w-full mb-3 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4
        ${isRefreshing ? "bg-blue-800 animate-pulse" : "bg-blue-600 hover:bg-blue-700"}
      `}
      onClick={handleRefresh}
      disabled={isRefreshing} // Prevent multiple clicks
    >
      {isRefreshing ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="white" fill="none"></circle>
            <path d="M12 2v4M12 22v-4M2 12h4M22 12h-4" strokeWidth="4" stroke="white"></path>
          </svg>
          Refreshing...
        </span>
      ) : (
        "🔄 Refresh for latest data!"
      )}
    </button>

<input
  type="text"
  placeholder="Search by name..."
  className="border p-2 rounded w-full mb-4"
  onChange={(e) => fetchSignups(e.target.value)} 
/>


      {/* Sign-up List */}
      <div className="space-y-4">
      {signups.map(({ id, name, song, artist, position, created_at }, index) => (
           <div key={id} className={`p-4 rounded-lg shadow-md text-white ${issues[id] ? 'bg-red-600' : 'bg-gray-700'}`}>


    {/* Move Up/Down Buttons */}
    {user?.is_admin && (

    <div className="mt-2">
<button
  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md mr-2"
  onClick={() => moveUp(signups[index].id, index)} // ✅ Pass `id` instead of `index`
  disabled={index === 0}
>
  ⬆️ Move Up
</button>

<button
  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md"
  onClick={() => moveDown(signups[index].id, index)} // ✅ Pass `id` instead of `index`
  disabled={index === signups.length - 1}
>
  ⬇️ Move Down
</button>

    </div>
    )}
{editingId === id ? (
  // Edit Mode
  <div className="space-y-2">
    <input
      type="text"
      value={editForm.name}
      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
      className="w-full px-4 py-2 bg-black text-white rounded-md border border-gray-400"
      required
    />
    <input
      type="text"
      value={editForm.song}
      onChange={(e) => setEditForm({ ...editForm, song: e.target.value })}
      className="w-full px-4 py-2 bg-black text-white rounded-md border border-gray-400"
      required
    />
    <input
      type="text"
      value={editForm.artist}
      onChange={(e) => setEditForm({ ...editForm, artist: e.target.value })}
      className="w-full px-4 py-2 bg-black text-white rounded-md border border-gray-400"
      required
    />

    {/* Save and Cancel Buttons - Only for Admins */}
    {user?.is_admin && (
      <>
        <button
          className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md"
          onClick={() => handleEditSubmit(id)}
        >
          Save ✅
        </button>
        <button
          className="mt-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-md ml-2"
          onClick={() => setEditingId(null)} // Cancels editing
        >
          Cancel ❌
        </button>
      </>
    )}
  </div>
) : (
  // View Mode
  <>
  <div 
  className={`p-4 rounded-lg  transition-all ${
    issues[id] ? "bg-red-600 text-white" : "bg-transparent"
  }`}
>
<h3 className={`text-2xl font-extrabold text-white text-center transition-all 
    ${position === 0 ? "animate-pulse bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text" : ""}
    ${position === 1 ? "text-blue-400" : ""}
  `}
>
  {position === 0 ? "🎤 CURRENTLY ROCKING THE MIC: " 
  : position === 1 ? "UP NEXT:👉 " 
  : `🎶 Position #${position}`}
  <br />
  <span className="uppercase tracking-wide drop-shadow-lg">{name}</span>
</h3>

<p className="text-lg text-green-300 font-medium text-center mt-1">
  {index === 0 
    ? "🔥 You're singing now! 🔥" 
    : `🚶 ${index} ${index === 1 ? "person" : "people"} ahead of you! 🎶`}
</p>


<p className="text-xl text-purple-300 font-medium text-center mt-2">
  🎶 <span className="text-white font-extrabold">Performing:{song}</span> by <span className="text-yellow-400 font-extrabold">{artist}</span>
</p>

<p className="text-sm text-gray-400 text-center italic mt-2">
  ⏰ Signed up at: {created_at ? new Date(new Date(created_at).getTime() - 5 * 60 * 60 * 1000).toLocaleString() : "Unknown"}
</p>

    {issues[id] && (
  <p className="text-white font-bold">⚠️ We had an issue with your song. Please see the host!</p>
)}
</div>
    {/* Admin-Only Buttons */}
    {user?.is_admin && (
      <>
<div className="flex flex-wrap gap-4 justify-center mt-4">
  <button
    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
    onClick={() => {
      setEditingId(id);
      setEditForm({ name, song, artist });
    }}
  >
    Edit ✏️
  </button>

  <button
  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
  onClick={() => handleSoftDelete(id)} // ✅ Now calls soft delete function
>
  Remove ❌
</button>


  <button
    className={`text-white font-bold py-2 px-4 rounded-md ${
      issues[id] ? "bg-green-500 hover:bg-green-700" : "bg-red-500 hover:bg-red-700"
    }`}
    onClick={() => toggleIssue(id, issues[id] || false)}
  >
    {issues[id] ? "Clear Issue ✅" : "Mark Issue 🚨"}
  </button>

  <button
  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md"
  onClick={() => moveToSecond(signups[index].id, index)} // ✅ Pass `id` correctly
>
  ⏩ UP NEXT
</button>

<button
  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg"
  onClick={sortByTime}
>
  ⏳ Sort by Time
</button>

<button
  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md"
  onClick={() => moveUpFive(signups[index].id, index)} // ✅ Already correct
>
  ⬆️ Up 5
</button>

<button
  className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-md"
  onClick={() => moveDownFive(signups[index].id, index)} // ✅ Already correct
>
  ⬇️ Down 5
</button>
<button
  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
  onClick={() => moveToFirst(signups[index].id, index)} // ✅ Passes `id` correctly
>
  ⬆️ Move to First
</button>


</div>

      </>
)}</>
)}


          </div>
        ))}
    {user?.is_admin && (

        <div>
    <button
      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4"
      onClick={() => {
        console.log("Toggling Deleted Signups View...");
        setShowDeleted(!showDeleted); // Toggle state
        if (!showDeleted) fetchDeletedSignups(); // Fetch only when opening
      }}
    >
      {showDeleted ? "❌ Hide Deleted Signups" : "📜 View Deleted Signups"}
    </button>

    {/* View Deleted DJ Notes Button (Only One Instance) */}



{showDeleted && (
  <div className="max-w-lg mx-auto bg-gray-800 text-white p-4 rounded-lg shadow-lg mt-6">
    <h3 className="text-xl font-bold text-center">📜 Deleted Karaoke Signups</h3>

    {console.log("Rendering Deleted Signups:", deletedSignups)} {/* Debugging Log */}

    <ul className="list-none text-lg text-center pl-5 mt-2 space-y-2">
      {deletedSignups.length > 0 ? (
        deletedSignups.map(({ id, name, song, artist, created_at }) => (
          <li key={id} className="border-b border-gray-700 pb-2 pt-2">
            <p><strong>{name}</strong> - "{song}" by {artist}</p>
            <p className="text-sm text-gray-400">⏰ {created_at ? new Date(created_at).toLocaleString() : "Unknown"}</p>
          </li>
        ))
      ) : (
        <p className="text-center text-gray-400">No deleted signups found.</p>
      )}
    </ul>
  </div>
)}


        </div>
    )}
      </div>  
      {user?.is_admin && (

      
        <button
      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4"
      onClick={() => {
        console.log("Toggling Deleted DJ Notes View. Fetching...");
        setShowDeletedNotes(!showDeletedNotes);
        if (!showDeletedNotes) fetchDeletedNotes(); // Fetch only when opening
      }}
    >
      {showDeletedNotes ? "❌ Hide Deleted DJ Notes" : "📜 View Deleted DJ Notes"}
    </button>
      )}
      {user?.is_admin && showDeletedNotes && (
  <div className="max-w-lg mx-auto bg-gray-800 text-white p-4 rounded-lg shadow-lg mt-6">
    <h3 className="text-xl font-bold text-center">📜 Deleted DJ Notes</h3>

    {console.log("Rendering Deleted DJ Notes:", deletedNotes)} {/* Debugging Log */}

    <ul className="list-none text-lg text-center pl-5 mt-2 space-y-2">
      {deletedNotes.length > 0 ? (
        deletedNotes.map(({ id, content, created_at }) => (
          <li key={id} className="border-b border-gray-700 pb-2 pt-2">
            <p className="text-white font-medium">📝 {content}</p>
            <p className="text-sm text-gray-400">⏰ {created_at ? new Date(created_at).toLocaleString() : "Unknown"}</p>
          </li>
        ))
      ) : (
        <p className="text-center text-gray-400">No deleted DJ Notes found.</p>
      )}
    </ul>
  </div>
  
)}


{user?.is_admin && (
  
  <div>  {/* ✅ Wrap in a div */}
    <button
      className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4"
      onClick={handleDeleteAll}
    >
      🚨 DELETE ALL SINGERS 🚨
    </button>
    <button
  className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4"
  onClick={handleHardDeleteSoftDeleted}
>
  🚨🚮 Prev Singers🚨
</button>

    <button
    className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4"
    onClick={handleHardDeleteAll}
  >
    🚨 🚮  ALERTS 🚨
  </button>

  </div>
)}   


                    </div>
                    </div>

  );
}
