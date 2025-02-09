import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Adjust the path accordingly

export default function KaraokeSignup() {
  const [signups, setSignups] = useState([]);
  const [form, setForm] = useState({ name: "", song: "", artist: "" });
  const [editingId, setEditingId] = useState(null);
  const [issues, setIssues] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [signupsOpen, setSignupsOpen] = useState(true);
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
  const sortByTime = () => {
    const sortedSignups = [...signups].sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
    );
    setSignups(sortedSignups);
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
  
  const [editForm, setEditForm] = useState({ name: "", song: "", artist: "" });
  const moveUpFive = (index) => {
    if (index < 5) return; // Prevents moving higher than first position

    const newSignups = [...signups];
    const [selectedEntry] = newSignups.splice(index, 1); // Remove entry
    newSignups.splice(index - 5, 0, selectedEntry); // Insert 5 positions up

    setSignups(newSignups);
};

const moveDownFive = (index) => {
    if (index >= signups.length - 5) return; // Prevents moving lower than last position

    const newSignups = [...signups];
    const [selectedEntry] = newSignups.splice(index, 1); // Remove entry
    newSignups.splice(index + 5, 0, selectedEntry); // Insert 5 positions down

    setSignups(newSignups);
};

// Move an entry up
    const moveUp = (index) => {
        if (index === 0) return; // Can't move first item up
        const newSignups = [...signups];
        [newSignups[index], newSignups[index - 1]] = [newSignups[index - 1], newSignups[index]];
        setSignups(newSignups);
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
    const moveDown = (index) => {
        if (index === signups.length - 1) return; // Can't move last item down
        const newSignups = [...signups];
        [newSignups[index], newSignups[index + 1]] = [newSignups[index + 1], newSignups[index]];
        setSignups(newSignups);
    };
  
  useEffect(() => {
    fetchSignups();
    fetchFormState();
  }, []);

  // GET: Fetch all signups
  const fetchSignups = async () => {
    const response = await fetch("https://portfoliobackend-ih6t.onrender.com/karaokesignup");
    const data = await response.json();
    setSignups(data);

    // Extract issues from the data
    const issuesMap = {};
    data.forEach(signup => {
        issuesMap[signup.id] = signup.is_flagged;  // Ensure it reflects the DB value
    });
    setIssues(issuesMap);
};

  // POST: Add new signup
  const handleSubmit = async (e) => {
    e.preventDefault();
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

  // DELETE: Remove a signup
  const handleDelete = async (id) => {
    await fetch(`https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}`, { method: "DELETE" });
    fetchSignups();
  };
  const moveToSecond = (index) => {
    if (index <= 1) return; // If already #1 or #2, do nothing

    const newSignups = [...signups];
    const [selectedEntry] = newSignups.splice(index, 1); // Remove selected entry
    newSignups.splice(1, 0, selectedEntry); // Insert at index 1 (second position)
    
    setSignups(newSignups);
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
  🕒 Karaoke Start/Stop Timestamp: 
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
    <li><strong>One Song at a Time:</strong>  <br/>If you enter multiple songs, your next turn may be moved to ensure fairness for all participants.</li>
    <li><strong>Tips Appreciated, Not Required:</strong> <br/> Tipping is welcome but does not guarantee priority in the queue.</li>
    <li><strong>Song Availability:</strong> <br/>If your song isn't available, it will be flagged. Refresh the page to check for updates.</li>
    <li><strong>Celebrations:</strong>  <br/>Let us know if it's your birthday or a special occasion—we'd love to give you an epic introduction!</li>
    <li><strong>Host Authority:</strong>  <br/>The host may adjust the queue as needed but will always aim to keep it fair for everyone.</li>
    <li><strong>Most Important Rule:</strong>  <br/>HAVE FUN! Enjoy your time on stage and cheer for fellow performers.</li>
    <li><strong>Leave a Review:</strong>  <br/>Loving the experience? Leave a review and snap a photo with the host to be featured!</li>
  </ul>
</div>
<button
  className="w-full mb-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4"
  onClick={() => {
    fetchSignups();
    fetchFormState();
  }}
>
  🔄 Refresh Everything
</button>


      {/* Sign-up List */}
      <div className="space-y-4">
      {signups.map(({ id, name, song, artist, created_at }, index) => (
           <div key={id} className={`p-4 rounded-lg shadow-md text-white ${issues[id] ? 'bg-red-600' : 'bg-gray-700'}`}>


    {/* Move Up/Down Buttons */}
    {user?.is_admin && (

    <div className="mt-2">
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md mr-2"
        onClick={() => moveUp(index)}
        disabled={index === 0}
      >
        ⬆️ Move Up
      </button>
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md"
        onClick={() => moveDown(index)}
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
<h3 
  className={`text-2xl font-extrabold text-white text-center transition-all 
    ${index === 0 ? "animate-pulse bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text" : ""}
    ${index === 1 ? "text-blue-400" : ""}
  `}
>
  {index === 0 ? "🎤 CURRENTLY ROCKING THE MIC: " : index === 1 ? "UP NEXT:👉 " : "🎶"}
  <br />

  <span className="uppercase tracking-wide drop-shadow-lg">{name}</span>
</h3>

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
        <button
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md"
          onClick={() => {
            setEditingId(id);
            setEditForm({ name, song, artist });
          }}
        >
          Edit ✏️
        </button>
        <button
          className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md ml-2"
          onClick={() => handleDelete(id)}
        >
          Remove ❌
        </button>
        <button
  className={`mt-2 text-white font-bold py-1 px-3 rounded-md ${
    issues[id] ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'
  }`}
  onClick={() => toggleIssue(id, issues[id] || false)}
>
  {issues[id] ? 'Clear Issue ✅' : 'Mark Issue 🚨'}
</button>
<button
    className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-3 rounded-md"
    onClick={() => moveToSecond(index)}
  >
    ⏩ UP NEXT
  </button>
  <button
  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4"
  onClick={sortByTime}
>
  ⏳ Sort by Time
</button>
<button
      className="mt-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded-md"
      onClick={() => moveUpFive(index)}
    >
      ⬆️ Move Up 5
    </button>
    <button
      className="mt-2 bg-purple-700 hover:bg-purple-800 text-white font-bold py-1 px-3 rounded-md"
      onClick={() => moveDownFive(index)}
    >
      ⬇️ Move Down 5
    </button>

      </>
    )} 
</>
)}


          </div>
        ))}
      </div>
            {user?.is_admin && (
  <button
    className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-5 rounded-lg text-xl shadow-lg mt-4"
    onClick={handleDeleteAll}
  >
    🚨 DELETE ALL SIGNUPS 🚨
  </button>
                )}
                    </div>
  );
}
