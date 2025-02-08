import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Adjust the path accordingly

export default function KaraokeSignup() {
  const [signups, setSignups] = useState([]);
  const [form, setForm] = useState({ name: "", song: "", artist: "" });
  const [editingId, setEditingId] = useState(null);
  const [issues, setIssues] = useState({});
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
// Move an entry up
    const moveUp = (index) => {
        if (index === 0) return; // Can't move first item up
        const newSignups = [...signups];
        [newSignups[index], newSignups[index - 1]] = [newSignups[index - 1], newSignups[index]];
        setSignups(newSignups);
    };
    const toggleIssue = (id) => {
        setIssues((prev) => ({
          ...prev,
          [id]: !prev[id], // Toggle issue status
        }));
      };
      
    const markIssue = (id) => {
        setIssues((prev) => ({
          ...prev,
          [id]: true, // Mark this song as having an issue
        }));
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
  }, []);

  // GET: Fetch all signups
  const fetchSignups = async () => {
    const response = await fetch("https://portfoliobackend-ih6t.onrender.com/karaokesignup");
    const data = await response.json();
    setSignups(data);
  };

  // POST: Add new signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://portfoliobackend-ih6t.onrender.com/karaokesignup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
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

  return (
    <div className="max-w-2xl mx-auto p-4">
        <h1>Welcome to Jwhit Productions Karaoke!</h1>

      <h1 className="text-3xl font-bold mb-4 text-center text-white">Karaoke Sign-up 🎤</h1>

      {/* Sign-up Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3 bg-gray-800 p-4 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 bg-black text-white rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          placeholder="Song"
          value={form.song}
          onChange={(e) => setForm({ ...form, song: e.target.value })}
          className="w-full px-4 py-2 bg-black text-white rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          placeholder="Artist"
          value={form.artist}
          onChange={(e) => setForm({ ...form, artist: e.target.value })}
          className="w-full px-4 py-2 bg-black text-white rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200"
        >
          Sign Up 🎶
        </button>
      </form>
      <div className="max-w-lg mx-auto bg-gray-800 text-white p-4 rounded-lg shadow-lg overflow-y-auto max-h-64">
  <h2 className="text-xl font-bold mb-2 text-center">Karaoke Guidelines 🎤</h2>
  <ul className="list-disc pl-5 space-y-2">
    <li><strong>Respect:</strong> Everyone gets their moment to shine! Disrespect toward singers or staff will result in removal from the queue.</li>
    <li><strong>One Song at a Time:</strong> If you enter multiple songs, your next turn may be moved to ensure fairness for all participants.</li>
    <li><strong>Tips Appreciated, Not Required:</strong> Tipping is welcome but does not guarantee priority in the queue.</li>
    <li><strong>Song Availability:</strong> If your song isn't available, it will be flagged. Refresh the page to check for updates.</li>
    <li><strong>Celebrations:</strong> Let us know if it's your birthday or a special occasion—we'd love to give you an epic introduction!</li>
    <li><strong>Host Authority:</strong> The host may adjust the queue as needed but will always aim to keep it fair for everyone.</li>
    <li><strong>Most Important Rule:</strong> HAVE FUN! Enjoy your time on stage and cheer for fellow performers.</li>
    <li><strong>Leave a Review:</strong> Loving the experience? Leave a review and snap a photo with the host to be featured!</li>
  </ul>
</div>

      {/* Sign-up List */}
      <div className="space-y-4">
      {signups.map(({ id, name, song, artist }, index) => (
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
    <p className="text-lg">
      <strong>{name}</strong> wants to sing <em>{song}</em> by {artist}
    </p>
    {issues[id] && (
  <p className="text-white font-bold">⚠️ We had an issue with your song. Please see the host!</p>
)}

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
    onClick={() => toggleIssue(id)}
  >
    {issues[id] ? 'Clear Issue ✅' : 'Mark Issue 🚨'}
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
