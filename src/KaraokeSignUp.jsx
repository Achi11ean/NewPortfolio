import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Adjust the path accordingly
import DJNotesApp from "./DJNotes";

export default function KaraokeSignup() {
  const [signups, setSignups] = useState([]);
  const [form, setForm] = useState({ name: "", song: "", artist: "" });
  const [editingId, setEditingId] = useState(null);
  const [issues, setIssues] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [signupsOpen, setSignupsOpen] = useState(true);
  const [deletedSignups, setDeletedSignups] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
const [showDeletedNotes, setShowDeletedNotes] = useState(false);
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

// Extract flagged artists
const flaggedArtists = [...new Set(
    signups
      .filter((signup) => {
        console.log("Checking signup:", signup); // Debugging log
        return issues[signup.id]; // Get only flagged signups
      })
      .map((signup) => {
        console.log("Flagged Artist Found:", signup.artist); // Debugging log
        return signup.artist; // Extract artist names
      })
  )];

console.log("Final Flagged Artists List:", flaggedArtists); // Debugging log

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

        // Ensure it's sorted by position
        data = data.sort((a, b) => a.position - b.position);

        setSignups(data);
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
  
    // Count occurrences of the entered name (case insensitive)
    const nameCount = signups.filter(
      (signup) => signup.name.toLowerCase() === form.name.toLowerCase()
    ).length;
  
    // Prevent submission if the name appears twice already
    if (nameCount >= 2) {
      alert(`The name "${form.name}" is already used twice! Only two song's at a time per person please! Use a different name if you are seeing this message and have not yet entered a song`);
      return;
    }
  
    const response = await fetch("https://portfoliobackend-ih6t.onrender.com/karaokesignup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
  
    const data = await response.json();
  
    if (response.status === 403) {
      alert(data.error); // Show an alert if sign-ups are closed
      return;
    }
  
    if (response.ok) {
      fetchSignups();
      setForm({ name: "", song: "", artist: "" });
    }
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

        console.log(`Signup ID ${id} marked as deleted.`); // Debugging log
        fetchSignups(); // ✅ Refresh active signups
        fetchDeletedSignups(); // ✅ Refresh deleted signups
    } catch (error) {
        console.error("Error soft deleting signup:", error);
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
>
<div className="flex flex-col items-center justify-center  px-4 sm:px-8 md:px-16 lg:px-24">
  
  {/* Title */}
  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center drop-shadow-lg p-4 sm:p-6 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl inline-block font-[Aspire]">
    🎤 Jwhit Karaoke 🎶
  </h1>

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
  {showForm ? "🕒 Karaoke Start Time:" : "🛑 Karaoke Stop Time:"}
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
    />

    {/* Song Input */}
    <input
      type="text"
      placeholder="Song"
      value={form.song}
      onChange={(e) => setForm({ ...form, song: e.target.value })}
      className="w-full px-4 py-3 bg-black text-white text-2xl text-center rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
    />

    {/* Artist Input */}
    <input
      type="text"
      placeholder="Artist"
      value={form.artist}
      onChange={(e) => setForm({ ...form, artist: e.target.value })}
      className="w-full px-4 py-3 bg-black text-white text-2xl text-center rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
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
      <div className="max-w-lg mx-auto bg-gray-800 text-white p-4 rounded-lg shadow-lg overflow-y-auto mt-10 mb-10 max-h-64">
  <h2 className="text-3xl underline font-bold mb-2 text-center">🚦Karaoke Guidelines 🚦</h2>
  <ul className="list-disc text-lg text-center pl-5 space-y-2">
    <li><strong>Respect:</strong> <br/>Everyone gets their moment to shine! Disrespect toward singers or staff will result in removal from the queue.</li>
    <li><strong>Two Songs at a time</strong>  <br/>in order to keep it fair you can only submit two songs at one time. Once you sing it will be removed from queue so you can add another song!</li>
    <li><strong>Tips Appreciated, Not Required:</strong> <br/> Tipping is welcome but does not guarantee priority in the queue.</li>
    <li><strong>Song Availability:</strong> <br/>If your song isn't available, it will be flagged. Refresh the page to check for updates. if your song disappeared it may have been flagged. </li>
    <li><strong>Celebrations:</strong>  <br/>Let us know if it's your birthday or a special occasion—we'd love to give you an epic introduction!</li>
    <li><strong>Host Authority:</strong>  <br/>The host may adjust the queue as needed but will always aim to keep it fair for everyone.</li>
    <li><strong>Most Important Rule:</strong>  <br/>HAVE FUN! Enjoy your time on stage and cheer for fellow performers.</li>
    <li><strong>Leave a Review:</strong>  <br/>Loving the experience? Leave a review and snap a photo with the host to be featured!</li>
  </ul>
</div>
{/* Display Flagged Artists List */}
{flaggedArtists.length > 0 && (
  <div className="max-w-lg mx-auto bg-red-700 text-white p-4 rounded-lg shadow-lg mt-6">
    <h3 className="text-xl font-bold text-center">🚨 Flagged Artists 🚨</h3>
    <ul className="list-disc text-lg text-center pl-5 mt-2 space-y-1">
      {flaggedArtists.map((artist, index) => {
        console.log(`Rendering Flagged Artist #${index + 1}:`, artist); // Debugging log
        return (
          <li key={index} className="font-semibold">
            {artist || "❌ Missing Artist Name"} {/* Handle undefined artist names */}
          </li>
        );
      })}
    </ul>
  </div>
)}

    <div>
    <DJNotesApp user={user} />
    </div>

    <button
  className="w-full mb-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4"
  onClick={() => {
    console.log("🔄 Refreshing Everything...");

    fetchSignups();         // Refresh Karaoke Signups
    fetchFormState();       // Refresh Form State Visibility
    fetchDeletedSignups();  // Refresh Deleted Signups
    fetchDeletedNotes();    // Refresh Deleted DJ Notes
    fetchNotes();           // Refresh Active DJ Notes
  }}
>
  🔄 Refresh for latest data!
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
    />
    <input
      type="text"
      value={editForm.song}
      onChange={(e) => setEditForm({ ...editForm, song: e.target.value })}
      className="w-full px-4 py-2 bg-black text-white rounded-md border border-gray-400"
    />
    <input
      type="text"
      value={editForm.artist}
      onChange={(e) => setEditForm({ ...editForm, artist: e.target.value })}
      className="w-full px-4 py-2 bg-black text-white rounded-md border border-gray-400"
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
    ${position === 1 ? "animate-pulse bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text" : ""}
    ${position === 2 ? "text-blue-400" : ""}
  `}
>
  {position === 1 ? "🎤 CURRENTLY ROCKING THE MIC: " 
  : position === 2 ? "UP NEXT:👉 " 
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
    )} 
</>
)}


          </div>
        ))}
    {user?.is_admin && (

        <div>
  <button
  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4"
  onClick={() => {
    console.log("Toggling Deleted Signups View. Fetching...");
    setShowDeleted(!showDeleted);
    if (!showDeleted) fetchDeletedSignups(); // Fetch only when opening
  }}
>
  {showDeleted ? "❌ Hide Deleted Signups" : "📜 View Deleted Signups"}
</button>


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
                
  <button
    className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4"
    onClick={handleDeleteAll}
  >
    🚨 DELETE ALL SIGNUPS 🚨
  </button>
  
                )}

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

                    </div>
  );
}
