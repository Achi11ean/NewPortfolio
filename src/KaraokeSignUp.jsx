import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext"; // Adjust the path accordingly
import DJNotesApp from "./DJNotes";
import Promotions from "./Promotions"; // Adjust the path based on where the file is
import "./App.css";
import RandomIntroGenerator from "./RamdomIntroGenerator";
import MusicBreakAlert from "./MusicBreak";
import SingerCount from "./SingerCount";
import RandomSongGenerator from "./RandomSongGenerator";
export default function KaraokeSignup() {
  const [notes, setNotes] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const [pin, setPin] = useState(""); // User-entered PIN
  const [isPinValid, setIsPinValid] = useState(false); // Whether the entered PIN is correct
  const [adminPin, setAdminPin] = useState(""); // Admin setting a new PIN
  const [showPinInput, setShowPinInput] = useState(false); // Controls PIN entry visibility
  const [pinError, setPinError] = useState(""); // Error message for incorrect PIN
  const guidelinesRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ Loading state
  const [isReversed, setIsReversed] = useState(false);
  const djNotesRef = useRef(null);
  useEffect(() => {
    if (!autoRefresh) return; // Stop if disabled
  
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // 30 seconds
  
    return () => clearInterval(interval); // Cleanup
  }, [autoRefresh]);
  
  const toggleReverseOrder = () => {
    setIsReversed((prev) => !prev);
  };

  const [singerCounts, setSingerCounts] = useState([]);
  useEffect(() => {
    fetch(
      "https://portfoliobackend-ih6t.onrender.com/karaokesignup/singer_counts"
    )
      .then((res) => res.json())
      .then((data) => {
        setSingerCounts(data);
      })
      .catch((error) => {
        console.error("Error fetching singer counts:", error);
      });
  }, []);

  // Fetch function for singer counts
  const fetchSingerCounts = async () => {
    try {
      setIsLoading(true); // ✅ Start loading before fetching
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/karaokesignup/singer_counts"
      );
      if (!response.ok) throw new Error("Failed to fetch singer counts");

      const data = await response.json();
      setSingerCounts(data);
    } catch (error) {
      console.error("Error fetching singer counts:", error);
    } finally {
      setIsLoading(false); // ✅ Stop loading when fetch is complete
    }
  };

  useEffect(() => {
    if (singerCounts.length > 0 || singerCounts.length === 0) {
      setIsLoading(false);
    }
  }, [singerCounts]);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetch("https://portfoliobackend-ih6t.onrender.com/music-break")
      .then((res) => res.json())
      .then((data) => setShowAlert(data.show_alert))
      .catch((err) => console.error("Error fetching alert state:", err));
  }, []);
  // Toggle Music Break state
  const toggleAlert = async () => {
    try {
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/music-break",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ show_alert: !showAlert }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShowAlert(data.show_alert);
      } else {
        console.error("Failed to update music break state");
      }
    } catch (error) {
      console.error("Error toggling music break:", error);
    }
  };

  const fetchMusicBreakState = async () => {
    try {
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/music-break"
      );
      if (!response.ok) throw new Error("Failed to fetch music break state");

      const data = await response.json();
      setShowAlert(data.show_alert);
    } catch (error) {
      console.error("Error fetching music break state:", error);
    }
  };
  const [activeSingers, setActiveSingers] = useState(0);
  const [warnings, setWarnings] = useState({});
  const toggleWarning = async (id, currentStatus) => {
    try {
      console.log("🔄 Toggling warning status...");

      const response = await fetch(
        `https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_warning: !currentStatus }),
        }
      );

      if (!response.ok) {
        console.error(`❌ PATCH request failed! Status: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log("✅ Server response after update:", result);

      if (typeof result.is_warning !== "boolean") {
        console.error("❌ Unexpected response format from backend:", result);
        return;
      }

      console.log(`🚀 Backend confirmed is_warning: ${result.is_warning}`);

      // ✅ Use functional state update to ensure correct reactivity
      setWarnings((prevWarnings) => {
        const updatedWarnings = {
          ...prevWarnings,
          [id]: result.is_warning,
        };

        console.log("⚡ Updated warnings state:", updatedWarnings);
        return updatedWarnings;
      });

      console.log("⚡ Updated warnings state:", warnings);

      // ✅ Fetch fresh data to ensure UI reflects the correct status
      await fetchSignups();
    } catch (error) {
      console.error("❌ Error toggling warning:", error);
    }
  };

  useEffect(() => {
    console.log("Updated warnings state:", warnings);
  }, [warnings]);

  const handleUpdatePin = async () => {
    if (adminPin.length !== 4 || isNaN(adminPin)) {
      alert("PIN must be a 4-digit number.");
      return;
    }

    try {
      console.log("🔄 Updating PIN...");

      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/formstate/update_pin",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin_code: adminPin }),
        }
      );

      const data = await response.json();
      console.log("✅ Update PIN Response:", data);

      if (response.ok) {
        alert("✅ PIN updated successfully!");
        setAdminPin(""); // Clear input field
      } else {
        alert(`❌ Failed to update PIN: ${data.error}`);
      }
    } catch (error) {
      console.error("❌ Error updating PIN:", error);
      alert("❌ An error occurred. Please try again.");
    }
  };

  const handleEnterPin = async () => {
    try {
      console.log("🔍 Fetching form state from backend...");

      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/formstate"
      );
      if (!response.ok) {
        throw new Error(`Failed to validate PIN. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Received form state:", data);

      console.log("📌 User-entered PIN:", pin);
      console.log("🔒 Stored PIN in backend:", data.pin_code);

      if (data.pin_code === pin) {
        console.log("✅ PIN is correct! Unlocking form...");
        setIsPinValid(true);
        setShowForm(true); // ✅ Enable the form only when the correct PIN is entered
        setShowPinInput(false);
        setPinError("");
      } else {
        console.warn("❌ Incorrect PIN. Please try again.");
        setPinError("❌ Incorrect PIN. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error verifying PIN:", error);
    }
  };

  const handleSetPin = async () => {
    if (adminPin.length !== 4 || isNaN(adminPin)) {
      alert("❌ PIN must be a 4-digit number.");
      return;
    }

    try {
      console.log("🔍 Checking if a PIN already exists...");

      // Step 1: Fetch current PIN
      const checkResponse = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/formstate"
      );
      if (!checkResponse.ok) throw new Error("Failed to check existing PIN.");

      const checkData = await checkResponse.json();
      console.log("🔒 Current Stored PIN:", checkData.pin_code);

      // Step 2: If a PIN already exists, prevent setting a new one
      if (checkData.pin_code) {
        alert("⚠️ A PIN is already set. You must update or delete it first.");
        return;
      }

      // Step 3: If no PIN exists, proceed with setting a new one
      console.log("✅ No existing PIN found. Setting new PIN...");

      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/formstate/set_pin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin_code: adminPin }),
        }
      );

      const data = await response.json();
      alert(data.message);
      setAdminPin("");

      console.log("✅ PIN successfully set:", adminPin);
    } catch (error) {
      console.error("❌ Error setting PIN:", error);
      alert("❌ An error occurred while setting the PIN. Please try again.");
    }
  };

  const handleDeletePin = async () => {
    try {
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/formstate/delete_pin",
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      alert(data.message);
      setIsPinValid(false); // ✅ Reset PIN validation
      setShowForm(false); // ✅ Hide the form when PIN is deleted
    } catch (error) {
      console.error("Error deleting PIN:", error);
    }
  };

  useEffect(() => {
    const scrollContainer = guidelinesRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 1; // Adjust speed (higher = slower)
    const scrollInterval = 40; // Time between scrolls in ms

    const scrollGuidelines = setInterval(() => {
      if (scrollContainer) {
        scrollContainer.scrollTop += scrollStep;
        scrollAmount += scrollStep;

        // If scrolled to the bottom, reset to the top
        if (
          scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight
        ) {
          scrollContainer.scrollTop = 0;
          scrollAmount = 0;
        }
      }
    }, scrollInterval);
    return () => clearInterval(scrollGuidelines);
  }, []);
  const [signups, setSignups] = useState([]);
  const fetchNotes = async () => {
    console.log("📢 Fetching DJ Notes..."); // ✅ Debugging log before fetch

    try {
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/djnotesactive",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ DJ Notes received:", data); // ✅ Debugging log after fetch

      setNotes(data);
    } catch (error) {
      console.error("❌ Error fetching DJ Notes:", error);
    }
  };
  const fetchActiveSingers = async () => {
    try {
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/karaokesignup/count"
      );
      if (!response.ok) throw new Error("Failed to fetch active signups count");

      const data = await response.json();
      console.log("🎤 Active Signups Count:", data.active_count);

      setActiveSingers(data.active_count);
    } catch (error) {
      console.error("❌ Error fetching active singers count:", error);
    }
  };

  useEffect(() => {
    fetchActiveSingers(); // Now it's defined and can be used anywhere
  }, []);

  const [form, setForm] = useState({ name: "", song: "", artist: "", adjustment: 0 }); 
  const [editingId, setEditingId] = useState(null);
  const [issues, setIssues] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [signupsOpen, setSignupsOpen] = useState(true);
  const [flaggedArtists, setFlaggedArtists] = useState([]);

  const [deletedSignups, setDeletedSignups] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [showDeletedNotes, setShowDeletedNotes] = useState(false);
  const handleHardDeleteAll = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to PERMANENTLY DELETE ALL DJ NOTES? This action CANNOT be undone!"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/djnotes/hard_delete_all",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete all notes: ${response.status}`);
      }

      alert("All DJ Notes have been permanently deleted.");
      fetchDeletedNotes(); // Refresh the deleted notes list
    } catch (error) {
      console.error("Error deleting all DJ Notes:", error);
    }
  };
  const toggleIssue = async (id, currentStatus) => {
    try {
      console.log(
        `🔄 Toggling issue status for ID ${id}... Current status: ${currentStatus}`
      );

      const response = await fetch(
        `https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_flagged: !currentStatus }),
        }
      );

      if (!response.ok) {
        console.error(`❌ PATCH request failed! Status: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log("✅ Server response after update:", result);

      if (typeof result.is_flagged !== "boolean") {
        console.error("❌ Unexpected response format from backend:", result);
        return;
      }

      console.log(`🚀 Backend confirmed is_flagged: ${result.is_flagged}`);

      // ✅ Instantly update the UI state **before fetching fresh data**
      setIssues((prevIssues) => ({
        ...prevIssues,
        [id]: result.is_flagged,
      }));

      console.log("🚨 Updated Issues State:", setIssues);

      // ✅ Fetch latest data to sync with backend
      await fetchSignups(); // ✅ Ensure signups list updates
      await fetchFlaggedSignups(); // ✅ Ensure flagged list updates
    } catch (error) {
      console.error("❌ Error toggling issue:", error);
    }
  };

  const fetchDeletedNotes = async () => {
    try {
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/djnotes/deleted"
      );

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
      const sortedDeletedNotes = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setDeletedNotes(sortedDeletedNotes);
    } catch (error) {
      console.error("Error fetching deleted DJ Notes:", error);
    }
  };

  const [showDeleted, setShowDeleted] = useState(false); // Toggle state
  const fetchDeletedSignups = async () => {
    try {
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/karaokesignup/deleted"
      );

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
      const sortedDeletedSignups = data.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      setDeletedSignups(sortedDeletedSignups);
    } catch (error) {
      console.error("Error fetching deleted signups:", error);
    }
  };

  const fetchFormState = async () => {
    try {
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/formstate"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch form state");
      }

      const data = await response.json();
      console.log("FormState:", data); // Debugging log

      setShowForm(data.show_form && data.pin_code !== null); // ✅ Only show if a PIN exists
      setLastUpdated(
        data.last_updated
          ? new Date(data.last_updated).toLocaleString()
          : "Unknown"
      );
    } catch (error) {
      console.error("Error fetching form state:", error);
    }
  };

  const sortByTime = async () => {
    try {
      const response = await fetch(
        `https://portfoliobackend-ih6t.onrender.com/karaokesignup/sort`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "sort_by_time" }), // Correct backend action
        }
      );

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
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/karaokesignup/flagged"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch flagged signups: ${response.status}`);
      }

      let data = await response.json();
      console.log("🚨 Flagged Signups Data:", data); // Debugging log

      setFlaggedSignups(data); // ✅ Store full flagged signup data

      // ✅ Automatically update `issues` state
      const updatedIssues = {};
      data.forEach((signup) => {
        updatedIssues[signup.id] = true; // Ensure all flagged signups are marked as true
      });

      console.log(
        "🛠 Updating Issues State for Flagged Signups:",
        updatedIssues
      );
      setIssues((prevIssues) => ({ ...prevIssues, ...updatedIssues })); // ✅ Merge with existing state
    } catch (error) {
      console.error("Error fetching flagged signups:", error);
    }
  };

  const [lastUpdated, setLastUpdated] = useState(null);

  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete ALL signups? This action cannot be undone!"
    );
    if (confirmDelete) {
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/karaokesignup",
        { method: "DELETE" }
      );
      if (response.ok) {
        fetchSignups(); // Refresh the list
        alert("All signups have been deleted successfully!");
      } else {
        alert("Error deleting signups. Please try again.");
      }
    }
  };
  const handleHardDeleteSoftDeleted = async () => {
    const confirmDelete = window.confirm(
      "🚨 Are you sure you want to PERMANENTLY DELETE all soft-deleted signups? This action CANNOT be undone!"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/karaokesignup/hard_delete",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error hard deleting soft-deleted signups: ${response.status}`
        );
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

    await fetch(
      `https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/move`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "up5" }), // Corrected key
      }
    );

    fetchSignups();
  };

  const moveDownFive = async (id, index) => {
    if (index >= signups.length - 5) return;

    await fetch(
      `https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/move`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "down5" }), // Corrected key
      }
    );

    fetchSignups();
  };
  const moveToFirst = async (id) => {
    if (!id) {
      console.error("Invalid ID for moveToFirst:", id);
      return;
    }

    await fetch(
      `https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/move`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "to_first" }), // Matches backend
      }
    );

    fetchSignups(); // Refresh the list
  };

  const moveToSecond = async (id, index) => {
    if (index <= 1) return; // Prevent unnecessary movement

    await fetch(
      `https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/move`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "up_next" }), // Correct action for backend
      }
    );

    fetchSignups();
  };
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    console.log("🔄 Refreshing Everything...");

    setIsRefreshing(true); // Start animation

    try {
      // Run all fetch functions in parallel for efficiency
      await Promise.all([
        fetchSignups(),
        fetchFormState(),
        fetchDeletedSignups(),
        fetchDeletedNotes(),
        fetchFlaggedSignups(), // ✅ Re-fetch flagged signups to check if flags were cleared
        fetchNotes(),
        fetchActiveSingers(),
        fetchMusicBreakState(),
        fetchSingerCounts(),
      ]);

      // ✅ Ensure the UI updates if flags were cleared
      setTimeout(() => {
        setSignups((prevSignups) => {
          if (!prevSignups || prevSignups.length === 0) {
            console.warn("⚠️ No signups available! No one is performing.");
            return [];
          }

          // Sort the signups by position
          const sortedSignups = [...prevSignups].sort(
            (a, b) => a.position - b.position
          );

          console.log("📋 Sorted Signups:", sortedSignups);

          // ✅ Ensure any cleared flags are reflected in state
          const updatedIssues = {};
          sortedSignups.forEach((signup) => {
            updatedIssues[signup.id] = signup.is_flagged; // ✅ Sync flags after refresh
          });

          setIssues(updatedIssues); // ✅ Force UI update to remove flags that were cleared
          console.log("🚨 Updated Issues State after Refresh:", updatedIssues);

          // Assign correct labels
          const updatedSignups = sortedSignups.map((signup, index) => {
            let label = `🎶 Position #${index + 1}`;

            if (index === 0) {
              label = "🎤 CURRENTLY ROCKING THE MIC!";
            } else if (index === 1) {
              label = "⏭️ UP NEXT!";
            }

            console.log(
              `📝 Assigning Label: ${label} to ${signup.name} (Position: ${signup.position})`
            );

            return {
              ...signup,
              label,
            };
          });

          // Edge case: Only one singer in the list
          if (updatedSignups.length === 1) {
            updatedSignups[0].label = "🎤 CURRENTLY ROCKING THE MIC!";
            console.warn(
              `⚠️ Only one singer found: ${updatedSignups[0].name} - Automatically setting as "CURRENTLY ROCKING THE MIC!"`
            );
          }

          console.log("✅ Final Signups List:", updatedSignups);
          return updatedSignups;
        });
      }, 500); // Delay to allow data update before re-rendering
    } catch (error) {
      console.error("❌ Error refreshing data:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000); // Stop after 1 sec (smooth UI)
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [effects, setEffects] = useState([]);

  // Move an entry up
  const moveUp = async (id, index) => {
    if (!id || id === 0) {
      console.error("Invalid ID received:", id);
      return;
    }

    await fetch(
      `https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/move`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "up" }),
      }
    );

    fetchSignups();
  };

  const moveDown = async (id) => {
    if (!id || id === 0) {
      console.error("Invalid ID received:", id);
      return;
    }

    await fetch(
      `https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/move`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "down" }),
      }
    );

    fetchSignups();
  };
  const fetchSignups = async (searchTerm = "") => {
    try {
      console.log("🔄 Fetching Karaoke Signups...");
      console.log(`🔎 Searching for: "${searchTerm}"`);

      const response = await fetch(
        `https://portfoliobackend-ih6t.onrender.com/karaokesignup?search=${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch signups: ${response.status}`);
      }

      let filteredData = await response.json();
      console.log("✅ API Response (before filtering):", filteredData);

      // ✅ Manually filter if backend doesn't return filtered results
      if (searchTerm) {
        filteredData = filteredData.filter((signup) =>
          signup.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log(
          "🔍 Filtered Data (frontend filtering applied):",
          filteredData
        );
      }

      // ✅ Extract warnings and flagged issues from backend response
      const updatedWarnings = {};
      const updatedIssues = {};
      filteredData.forEach((signup) => {
        updatedWarnings[signup.id] = signup.is_warning;
        updatedIssues[signup.id] = signup.is_flagged; // ✅ Ensure flagged state updates correctly
      });

      // ✅ Fetch full list of signups for position tracking
      const fullResponse = await fetch(
        `https://portfoliobackend-ih6t.onrender.com/karaokesignup`
      );
      if (!fullResponse.ok)
        throw new Error("Failed to fetch full signup list.");

      const fullSignups = await fullResponse.json();
      fullSignups.sort((a, b) => a.position - b.position);

      // ✅ Create position map
      const positionMap = {};
      fullSignups.forEach((signup, index) => {
        positionMap[signup.id] = index;
      });

      // ✅ Assign true queue positions
      filteredData = filteredData.map((signup) => ({
        ...signup,
        true_position: positionMap[signup.id] ?? -1,
      }));

      // ✅ Sort results properly even when searching
      filteredData.sort(
        (a, b) => (a.true_position ?? 9999) - (b.true_position ?? 9999)
      );

      // ✅ Ensure the first singer gets position 0
      if (!searchTerm && filteredData.length === 1) {
        filteredData[0].position = 0;
      }

      console.log("📋 Final processed signups data:", filteredData);

      // ✅ Update state
      setSignups([...filteredData]); // ✅ Force re-render
      setWarnings({ ...updatedWarnings });
      setIssues({ ...updatedIssues }); // ✅ Ensure issues reflect the latest state

      console.log("🚨 Updated Issues State:", updatedIssues);
    } catch (error) {
      console.error("❌ Error fetching signups:", error);
    }
  };

  useEffect(() => {
    console.log("Updated Issues State:", issues);
  }, [issues]);

  // Move an entry down

  // POST: Add new signup

  const fetchRestrictedWords = async () => {
    try {
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/restricted_words"
      ); // ✅ Fetch restricted words from backend
      if (response.ok) {
        const words = await response.json();
        return words.map((word) => word.toLowerCase().trim()); // Normalize words for case-insensitive check
      } else {
        console.error("Failed to fetch restricted words.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching restricted words:", error);
      return [];
    }
  };


  const checkActiveSongsForSinger = async (singerName) => {
    try {
      const response = await fetch(
        `https://portfoliobackend-ih6t.onrender.com/karaokesignup/count?name=${encodeURIComponent(singerName)}`
      );
      if (!response.ok) throw new Error("Failed to fetch active song count");
  
      const data = await response.json();
      return data.active_count; // Returns number of active songs for the singer
    } catch (error) {
      console.error("Error fetching active song count:", error);
      return 0; // Default to 0 to avoid blocking if there's an error
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // ✅ Step 1: Check if signups are still open in the backend
      const formStateResponse = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/formstate"
      );
      if (!formStateResponse.ok) throw new Error("Failed to fetch form state.");
  
      const formState = await formStateResponse.json();
  
      if (!formState.show_form) {
        alert("⚠️ Signups are currently closed! Please check back later.");
        return; // Stop submission if signups are closed
      }
  
      // ✅ Step 2: Fetch restricted words
      const restrictedWords = await fetchRestrictedWords();
      const userInput = `${form.name} ${form.song} ${form.artist}`.toLowerCase();
      const containsRestrictedWord = restrictedWords.some((word) =>
        userInput.includes(word)
      );
  
      if (containsRestrictedWord) {
        alert(
          "🚨 Your submission contains inappropriate words! Please revise and try again."
        );
        return; // Stop submission if inappropriate words are detected
      }
  
      // ✅ Step 3: Check if the song has already been performed
      let allSignups = [];
      try {
        const response = await fetch(
          "https://portfoliobackend-ih6t.onrender.com/karaokesignup/all"
        );
        if (response.ok) {
          allSignups = await response.json();
        } else {
          console.error("Failed to fetch all signups.");
        }
      } catch (error) {
        console.error("Error fetching all signups:", error);
      }
  
      const songAlreadySung = allSignups.some(
        (signup) =>
          signup.song.toLowerCase() === form.song.toLowerCase() &&
          signup.artist.toLowerCase() === form.artist.toLowerCase()
      );
  
      if (songAlreadySung) {
        const confirmProceed = window.confirm(
          "⚠️ This song has been performed tonight already! We don’t mind if you perform it again, but just wanted to give you a heads-up!\n\nDo you want to continue?"
        );
        if (!confirmProceed) return; // Stop if the user declines
      }
  
      // ✅ Step 4: Enforce the two-song limit per person
      const activeSongs = await checkActiveSongsForSinger(form.name);

      if (activeSongs >= 2) {
        alert(
          `⚠️ ${form.name} already has two songs in queue! Only two at a time per person, please.⏰`
        );
        return; // Stop submission if they already have 2 active songs
      }
  
      // ✅ Step 5: Determine adjustment value (default 0 if not set)
      const adjustmentValue =
        form.adjustment !== undefined ? parseFloat(form.adjustment) : 0.0;
      console.log("⚖️ Adjustment Value Before Submission:", adjustmentValue);
  
      // ✅ Step 6: Proceed with submission
      setIsSubmitting(true); // Start animation
  
      const response = await fetch(
        "https://portfoliobackend-ih6t.onrender.com/karaokesignup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, adjustment: adjustmentValue }), // Include adjustment field
        }
      );
  
      const data = await response.json();
  
      if (response.status === 403) {
        alert(data.error);
        setIsSubmitting(false); // Stop animation if failed
        return;
      }
  
      if (response.ok) {
        fetchSignups(); // Refresh the list
        setForm({ name: "", song: "", artist: "", adjustment: 0.0 }); // Reset form, including adjustment
  
        // ✅ Notify user of successful submission
        alert(
          "🎉 Your song has been submitted successfully! Get ready to rock the mic!🎤"
        );
  
        // ✅ Trigger falling effects
        triggerEffects();
  
        // ✅ Scroll to DJ Notes section after submission
        setTimeout(() => {
          if (djNotesRef.current) {
            djNotesRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 800); // Slight delay for smooth transition
  
        setTimeout(() => setIsSubmitting(false), 1500); // Reset after 1.5s
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("❌ Something went wrong! Please try again.");
      setIsSubmitting(false);
    }
  };
  

  const triggerEffects = () => {
    let newEffects = [];

    for (let i = 0; i < 15; i++) {
      // Generate 15 falling emojis
      newEffects.push({
        id: Math.random(),
        left: Math.random() * 100, // Random position
        duration: Math.random() * 2 + 1, // Random fall speed
      });
    }

    setEffects(newEffects);

    // Remove effects after animation completes
    setTimeout(() => setEffects([]), 3000);
  };

  const { user } = useAuth();

  // PATCH: Update a signup
  const handleEditSubmit = async (id) => {
    const response = await fetch(
      `https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      }
    );
    if (response.ok) {
      fetchSignups();
      setEditingId(null); // Exit edit mode
    }
  };

  useEffect(() => {
    fetchSignups();
    fetchFormState();
    fetchDeletedNotes();
    fetchNotes();
    fetchActiveSingers();
  }, []);

  const handleSoftDelete = async (id) => {
    try {
      const response = await fetch(
        `https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}/soft_delete`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to soft delete signup.");
      }

      await fetchSignups(); // ✅ Refresh the list after soft delete
    } catch (error) {
      console.error("❌ Error soft deleting signup:", error);
    }
  };

  // DELETE: Remove a signup
  const handleDelete = async (id) => {
    await fetch(
      `https://portfoliobackend-ih6t.onrender.com/karaokesignup/${id}`,
      { method: "DELETE" }
    );
    fetchSignups();
  };

  return (
    <div
      className="max-w-4xl item-center justify-center mx-auto p-4 rounded-3xl shadow-lg"
      style={{
        background:
          "linear-gradient(to bottom right, purple, #1a1a2e, #16213e)", // Deep modern blue tones
      }}
    >
      <div className="relative">
        {/* 🎤 Falling sparkles & mic effects */}
        {effects.map((effect) => (
          <span
            key={effect.id}
            className="falling-effect"
            style={{
              left: `${effect.left}%`,
              animationDuration: `${effect.duration}s`,
            }}
          >
            {Math.random() > 0.5 ? "✨" : "🎤"}
          </span>
        ))}
        <div className="flex flex-col items-center justify-center  px-4 sm:px-8 md:px-16 lg:px-24">
          {/* Title */}
          <h1
            className="text-3xl sm:text-5xl md:text-6xl shadow-2xl shadow-white rounded-3xl lg:text-7xl 
               font-bold text-center drop-shadow-lg p-4 sm:p-6 
               bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 
               bg-clip-text text-transparent inline-block font-[Aspire]"
          >
            Jwhit <br />
            <span className="font-mono">⭑ Karaoke</span> ⭑
          </h1>

          <Promotions />
  
          <h2
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold 
               mb-4 sm:mb-3 mt-6 sm:mt-10 text-center text-white 
               bg-black p-2 sm:p-3 rounded-lg animate-police-siren max-w-lg mx-auto"
          >
            🚦<span className="underline font-serif "> Karaoke Guidelines</span>{" "}
            🚦
          </h2>

          <div
            className="max-w-lg mx-auto bg-gray-900 text-white p-6 rounded-2xl shadow-2xl overflow-y-auto mb-10 max-h-64 border border-yellow-400"
            ref={guidelinesRef}
          >
            <h2 className="text-2xl font-extrabold text-yellow-300 text-center mb-4 underline decoration-wavy decoration-yellow-400">
              🎤 Karaoke Guidelines
            </h2>

            <ul className="list-none text-lg  font-sans space-y-4">
              <li className="flex items-start space-x-2">
                <span className="text-red-500 text-xl">🚫</span>
                <p>
                  <strong className="underline text-red-500">Respect:</strong>{" "}
                  Everyone gets their moment to shine! Disrespect toward singers
                  or staff will result in{" "}
                  <strong className="underline">removal</strong> from the queue.
                </p>
              </li>

              <li className="flex items-start space-x-2">
                <span className="text-blue-400 text-xl">🎶</span>
                <p>
                  <strong className="underline">Two Songs at a Time:</strong> To
                  keep it fair, you can only submit two songs at once.
                </p>
              </li>

              <li className="flex items-start space-x-2">
                <span className="text-green-400 text-xl">💰</span>
                <p>
                  <strong className="underline">
                    Tips Appreciated, Not Required:
                  </strong>{" "}
                  Tipping is welcome but does not guarantee priority.
                </p>
              </li>

              <li className="flex items-start space-x-2">
                <span className="text-yellow-300 text-xl">⚠️</span>
                <p>
                  <strong className="underline">Song Availability:</strong> If
                  your song isn't available, it will be flagged.
                </p>
              </li>

              <li className="flex items-start space-x-2">
                <span className="text-pink-400 text-xl">🎉</span>
                <p>
                  <strong className="underline">Celebrations:</strong> Let us
                  know if it's your birthday or a special occasion!
                </p>
              </li>

              <li className="flex items-start space-x-2">
                <span className="text-purple-400 text-xl">🎤</span>
                <p>
                  <strong className="underline">Host Authority:</strong> The
                  host may adjust the queue but will{" "}
                  <strong className="underline">always keep it fair</strong>.
                </p>
              </li>

              <li className="flex items-start space-x-2">
                <span className="text-teal-300 text-xl">🔥</span>
                <p>
                  <strong className="underline text-yellow-300">
                    Most Important Rule:
                  </strong>{" "}
                  HAVE FUN! Enjoy your time on stage and cheer for fellow
                  performers.
                </p>
              </li>

              <li className="flex items-start space-x-2 ">
                <span className="text-gray-300 text-xl">⭐</span>
                <p>
                  <strong className="underline">Leave a Review:</strong> Loving
                  the experience? Leave a review and snap a photo!
                </p>
              </li>
            </ul>
            <div className=" text-center mb-44 p-6 bg-white rounded-3xl shadow-xl border border-gray-700 max-w-lg mx-auto">
          {/* Title */}
          <h2 className="text-md sm:text-4xl underline font-extrabold  bg-gradient-to-r from-yellow-300 via-red-500 to-pink-600  text-transparent bg-clip-text drop-shadow-xl p-3 rounded-lg shadow-md backdrop-blur-md shadow-black bg-opacity-90">
            🎤 Show Some Love! 💕
          </h2>

          <p className="text-lg text-black mt-2">
            Enjoying the show? Tips are always appreciated, and never required
            but your support sure does cheer the host up! 🙌✨
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
          </div>

          <h2
            className="text-lg sm:text-xl  md:text-3xl lg:text-4xl xl:text-5xl 
              font-extrabold text-white text-center drop-shadow-lg 
              mt-4 sm:mt-6 p-2 sm:p-4 bg-gradient-to-r 
              from-yellow-400 via-red-500 to-pink-500 rounded-xl  mx-auto"
          >
            {showForm ? "🕒 Sign ups opened at:" : "🛑 Sign ups closed at:"}
            <br />
            <span
              className="text-yellow-200 text-xl sm:text-2xl md:text-3xl lg:text-4xl 
                  block mt-2 break-words"
            >
              {lastUpdated
                ? new Date(
                    new Date(lastUpdated).getTime() - 5 * 60 * 60 * 1000
                  ).toLocaleString("en-US", {
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


          {user?.is_admin && (
            <div className="mt-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-2xl shadow-xl max-w-md mx-auto">
              {/* Input Field */}
              <div className="relative mb-4">
                <input
                  type="text"
                  maxLength="4"
                  placeholder="Enter 4-digit PIN"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full px-5 py-3 text-xl text-white bg-black bg-opacity-50 border border-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-center placeholder-gray-300 tracking-widest"
                />
                <span className="absolute right-4 top-3 text-white text-lg">
                  🔒
                </span>
              </div>

              {/* Buttons Container */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleSetPin}
                  className="px-4 py-2 text-lg font-bold text-white bg-green-500 rounded-lg shadow-md transform transition-all hover:scale-105 hover:bg-green-600 active:scale-95"
                >
                  ✅ Set PIN
                </button>

                <button
                  onClick={handleUpdatePin}
                  className="px-4 py-2 text-lg font-bold text-white bg-blue-500 rounded-lg shadow-md transform transition-all hover:scale-105 hover:bg-blue-600 active:scale-95"
                >
                  🔄 Update PIN
                </button>

                <button
                  onClick={handleDeletePin}
                  className="px-4 py-2 text-lg font-bold text-white bg-red-500 rounded-lg shadow-md transform transition-all hover:scale-105 hover:bg-red-600 active:scale-95"
                >
                  ❌ Delete PIN
                </button>
              </div>
            </div>
          )}

          {/* Subtitle */}
{/* Subtitle */}
<div className="text-center mt-6 bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-2xl shadow-xl max-w-md mx-auto">
  <h2 className="text-white font-extrabold text-2xl mb-4">
   <span className="underline"> Karaoke Sign Up:</span> <br/>
    🔑 Venue Pin
  </h2>

  {/* PIN input with tooltip */}
  <div className="relative mb-4 group">
    {/* Tooltip (Hidden until hover) */}
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
      Pin at Host table
      
    </span>

    <input
      type="text"
      maxLength="4"
      placeholder="####"
      value={pin}
      onChange={(e) => setPin(e.target.value)}
      className="w-full px-5 py-3 text-xl text-white bg-black bg-opacity-50 border border-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-center placeholder-gray-300 tracking-widest"
      disabled={isPinValid} // 🔥 Disable input instead of hiding it
    />
    <span className="absolute right-4 top-3 text-white text-lg">
      🔒
    </span>
  </div>


            <button
              onClick={handleEnterPin}
              className="w-full px-4 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md transform transition-all hover:scale-105 hover:from-green-500 hover:to-blue-600 active:scale-95"
              disabled={isPinValid} // 🔥 Disable button instead of hiding it
            >
              {isPinValid ? "✅ PIN Verified" : "🚀 Submit"}
            </button>

            {pinError && (
              <p className="mt-3 text-lg font-semibold text-red-400 animate-bounce">
                ❌ {pinError}
              </p>
            )}
          </div>

          {/* Sign-up Form */}

          {isPinValid && showForm && (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md mt-6 bg-white bg-opacity-10 backdrop-blur-lg p-6 sm:p-8 rounded-3xl border border-gray-600 flex flex-col items-center space-y-6 animate-rainbowShadow"
            >
              <RandomSongGenerator
                onSelect={(selectedSong) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    song: selectedSong.title,
                    artist: selectedSong.artist,
                  }))
                }
              />

              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white text-center tracking-wide">
                🎤 Step Up to the Mic! 🎶
              </h2>

              {/* Name Input */}
              <div className="relative w-full">
                <label
                  htmlFor="name"
                  className="block text-purple-400 text-lg sm:text-xl font-bold mb-2 text-center cursor-pointer"
                >
                  🌟 Stage Name 🌟
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="First Name, Last Initial"
                  value={form.name}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 20); // Limit to 20 characters
                    setForm({ ...form, name: value });
                  }}
                  className="w-full px-5 py-4 text-lg sm:text-xl bg-gray-900 text-white text-center rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  required
                />
              </div>

              {/* Song Input */}
              <div className="relative w-full mt-4">
                <label
                  htmlFor="song"
                  className="block text-purple-400 text-lg sm:text-xl font-bold mb-2 text-center cursor-pointer"
                >
                  🎵 Song You'll Rock 🎸
                </label>
                <input
                  id="song"
                  type="text"
                  placeholder="Enter song title"
                  value={form.song}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 100); // Limit to 100 characters
                    setForm({ ...form, song: value });
                  }}
                  className="w-full px-5 py-4 text-lg sm:text-xl bg-gray-900 text-white text-center rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  required
                />
              </div>

              {/* Artist Input */}
              <div className="relative w-full mt-4">
                <label
                  htmlFor="artist"
                  className="block text-purple-400 text-lg sm:text-xl font-bold mb-2 text-center cursor-pointer"
                >
                  🎤 Original Artist 🎧
                </label>
                <input
                  id="artist"
                  type="text"
                  placeholder="Enter artist name"
                  value={form.artist}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 50); // Limit to 50 characters
                    setForm({ ...form, artist: value });
                  }}
                  className="w-full px-5 py-4 text-lg sm:text-xl bg-gray-900 text-white text-center rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  required
                />
              </div>

              <label
  htmlFor="adjustment"
  className="block text-purple-400 text-lg sm:text-xl font-bold text-center cursor-pointer"
>
  🔑 Key Change (Optional)
</label>
<p>+/- by 1/2 step Increments (Min: -10, Max: 10)</p>
<div className="flex items-center space-x-1">
  {/* Decrease Button */}
  <button
    onClick={(e) => {
      e.preventDefault(); // Prevent form submission
      setForm((prev) => ({
        ...prev,
        adjustment: Math.max((prev.adjustment || 0) - 0.5, -10), // ✅ Ensure valid number
      }));
    }}
    className="px-4 py-3 text-lg font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all"
    disabled={form.adjustment <= -10} // ✅ Disable button at min limit
  >
    ➖
  </button>

  {/* Input Field */}
  <input
    id="adjustment"
    type="number"
    step="0.5"
    min="-10"
    max="10"
    placeholder="0"
    value={form.adjustment}
    onChange={(e) => {
      let value = parseFloat(e.target.value);
      if (isNaN(value)) value = 0;
      value = Math.max(-10, Math.min(value, 10)); // ✅ Keep within -10 to 10
      setForm({ ...form, adjustment: value });
    }}
    className="w-24 px-5 py-4 text-lg sm:text-xl bg-gray-900 text-white text-center rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
  />

  {/* Increase Button */}
  <button
    onClick={(e) => {
      e.preventDefault(); // Prevent form submission
      setForm((prev) => ({
        ...prev,
        adjustment: Math.min((prev.adjustment || 0) + 0.5, 10), // ✅ Ensure valid number
      }));
    }}
    className="px-4 py-3 text-lg font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition-all"
    disabled={form.adjustment >= 10} // ✅ Disable button at max limit
  >
    ➕
  </button>
</div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xl sm:text-2xl py-4 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 active:scale-95"
              >
                🎶 Sign Me Up! 🚀
              </button>
            </form>
          )}
        </div>

        {/* Display Flagged Artists List */}

        <div ref={djNotesRef}>
  <DJNotesApp user={user} notes={notes} fetchNotes={fetchNotes} />
</div>

        <div className="flex items-center justify-center mt-6">
          <div className="relative bg-gradient-to-b from-black to-blue-500 text-white text-center p-6 rounded-3xl shadow-xl border border-gray-300 max-w-lg mx-auto">
            <h2 className="text-xl sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-red-500 to-pink-600 drop-shadow-xl">
              🎶 Total # Singers:
            </h2>

            <div className="mt-4">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold animate-bounce">
                {activeSingers}
              </span>
              <p className="text-lg text-black font-bold sm:text-xl mt-2">
                🎤 Ready to rock the mic!
              </p>
            </div>
          </div>
        </div>

        {/* Flagged Signups  */}

        {flaggedSignups.length > 0 && (
          <div className="max-w-lg mx-auto bg-red-700 text-white p-4 rounded-lg shadow-lg mt-6">
            <h3 className="text-xl font-serif text-center">
              🚨 Please See Host: 🚨
            </h3>
            <ul className="list-none text-lg text-center mt-2 space-y-2">
              {flaggedSignups.map((signup, index) => (
                <li key={signup.id} className="border-b border-gray-300 pb-2">
                  <p className="text-xl font-bold">{signup.name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}



{user?.is_admin && (
          <SingerCount singerCounts={singerCounts} isLoading={isLoading} />
        )}
        {/* Refresh button */}

        <button
          title="Use this button to refresh the queue line easily!"
          className={`relative w-full mb-3 text-white font-bold py-4 px-8 rounded-2xl text-2xl shadow-2xl mt-4 
    transition-all duration-300 transform active:scale-90 animate-bounce
    ${
      isRefreshing
        ? "bg-gradient-to-r from-blue-700 to-blue-900 animate-pulse shadow-blue-500/50"
        : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-400/50"
    }
    before:absolute before:inset-0 before:rounded-2xl before:opacity-30 before:blur-lg 
    before:bg-blue-300 before:transition-all before:duration-500 hover:before:opacity-50
  `}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <span className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-8 w-8 text-white transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                  stroke="white"
                  fill="none"
                ></circle>
                <path
                  d="M12 2v4M12 22v-4M2 12h4M22 12h-4"
                  strokeWidth="4"
                  stroke="white"
                ></path>
              </svg>
              <span className="tracking-widest text-xl font-extrabold">
                Refreshing...
              </span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-3">
              <span className="text-3xl animate-pulse">🔄</span>
              <span className="ml-2 tracking-widest drop-shadow-lg font-extrabold text-xl">
                REFRESH QUEUE
              </span>
              <span className="text-3xl animate-pulse">🔄</span>
            </span>
          )}
        </button>
        <div className="flex justify-center gap-4 mt-4">
  {user?.is_admin && (
    <button
      className="px-8 mb-2 text-lg font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md transform transition-all hover:scale-105 active:scale-95"
      onClick={toggleReverseOrder}
    >
      🔄 {isReversed ? "Show Oldest First" : "Show Newest First"}
    </button>
  )}
  
  {user?.is_admin && (
    <button
      className={`px-8 text-lg mb-2 font-bold text-white rounded-lg shadow-md transform transition-all
        ${autoRefresh ? "bg-red-600 hover:bg-red-700" : "bg-green-500 hover:bg-green-600"} 
        hover:scale-105 active:scale-95`}
      onClick={() => setAutoRefresh(!autoRefresh)}
    >
      {autoRefresh ? "🛑 Stop Auto Refresh" : "🔄 Enable Auto Refresh"}
    </button>
  )}
</div>

        {/* Search Bar */}

        <div className="relative w-full mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name..."
            className="w-full p-3 text-lg font-semibold text-white bg-black bg-opacity-60 border border-gray-500 rounded-xl shadow-md 
               focus:ring-2 focus:ring-blue-400 focus:outline-none 
               placeholder-gray-300 transition-all duration-300"
            onChange={(e) => fetchSignups(e.target.value)}
          />
          <span className="absolute right-4 top-3 text-gray-400 text-xl pointer-events-none">
            🔎
          </span>
        </div>

        <MusicBreakAlert showAlert={showAlert} toggleAlert={toggleAlert} />
        <br/>
        {user?.is_admin && (

        <RandomIntroGenerator singerName={name} />
        )}
        {/* Sign-up List */}
        <div className="max-h-[120vh] mt-5 overflow-y-auto space-y-6">
          {(isReversed ? [...signups].reverse() : signups).map(
            (
              { id, name, song, artist, position, created_at, adjustment },
              index
            ) => (
              <div
                key={id}
                className={`p-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                  issues[id]
                    ? "bg-gradient-to-r from-red-600 to-red-800 shadow-red-500/50"
                    : "bg-gradient-to-b from-[#16213e] via-[#16213e] to-yellow-700 shadow-[0px_-4px_8px_rgba(255,255,255,0.5),0px_4px_0px_rgba(0,0,0,0)]"
                }`}
              >
                {/* Editing Screen */}

                {editingId === id ? (
                  // Edit Mode
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-black text-white rounded-md border border-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      value={editForm.song}
                      onChange={(e) =>
                        setEditForm({ ...editForm, song: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-black text-white rounded-md border border-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      value={editForm.artist}
                      onChange={(e) =>
                        setEditForm({ ...editForm, artist: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-black text-white rounded-md border border-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      required
                    />

                    {/* Save and Cancel Buttons - Only for Admins */}
                    {user?.is_admin && (
                      <>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all"
                          onClick={() => handleEditSubmit(id)}
                        >
                          Save ✅
                        </button>
                        <button
                          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all"
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
                      className={`p-4 rounded-lg transition-all ${
                        issues[id]
                          ? "bg-red-600 text-white"
                          : warnings[id]
                          ? "bg-black text-black font-bold"
                          : "bg-transparent"
                      }`}
                    >
                      <h3
                        className={`text-2xl font-extrabold text-white text-center tracking-wide drop-shadow-lg ${
                          position === 0
                            ? "animate-pulse bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text"
                            : position === 1
                            ? "text-blue-400"
                            : ""
                        }`}
                      >
                        {position === 0
                          ? "🎤 CURRENTLY ROCKING THE MIC!"
                          : position === 1
                          ? "UP NEXT!"
                          : `🎶 Position #${position}`}
                        <br />
                        <span
                          className="uppercase tracking-wider text-white overflow-x-auto whitespace-nowrap block max-w-full"
                          style={{ display: "inline-block" }}
                        >
                          {name}
                        </span>
                      </h3>

                      <p className="text-lg text-green-300 font-medium text-center mt-1">
                        {position === 0
                          ? "🔥 You're singing now! 🔥"
                          : position > 0
                          ? `🚶 ${position} ${
                              position === 1 ? "person" : "people"
                            } ahead of you! 🎶`
                          : "🔍 Position unknown"}
                      </p>

                      <p className="text-xl font-medium text-center mt-2">
                        <span className="text-pink-500 font-extrabold">
                          Performing:
                        </span>
                      </p>

                      <div className="max-h-6 overflow-y-auto text-white text-center">
                        <span>{song}</span>
                      </div>

                      <p className="text-xl font-medium text-center mt-2">
                        <span className="text-purple-300">
                          Original Artist:
                        </span>
                      </p>

                      <div className="max-h-16 overflow-y-auto text-white font-extrabold text-center">
                        <span>{artist}</span>
                      </div>

                      <p className="text-sm text-gray-400 text-center italic mt-2">
                        ⏰ Signed up at:{" "}
                        {created_at
                          ? new Date(
                              new Date(created_at).getTime() -
                                5 * 60 * 60 * 1000
                            ).toLocaleString()
                          : "Unknown"}
                      </p>

                      {issues[id] && (
                        <p className="text-white font-bold">
                          ⚠️ We had an issue with your song. Please see the
                          host!
                        </p>
                      )}
                      {adjustment !== 0 && adjustment !== null && (
                        <p className="text-lg font-bold text-yellow-300 text-center mt-2">
                          🎹 Key Change <br />
                          {adjustment > 0
                            ? `+ ${adjustment}`
                            : `- ${Math.abs(adjustment)}`}{" "}
                          Step
                        </p>
                      )}

                      {warnings &&
                        console.log("🚨 Current warnings state:", warnings)}

                      {warnings[id] && (
                        <p className="text-white font-bold bg-red-600 p-2 rounded-lg text-center mt-2">
                          ⚠️ You were called once and missed your chance! You
                          still have another shot—don't miss it! 🎤
                        </p>
                      )}
                    </div>
                    {/* Admin-Only Buttons */}
                    {user?.is_admin && (
                      <div className="mt-6 bg-gradient-to-r from-blue-900 via-pink-900 to-purple-900 p-4 rounded-2xl shadow-lg">
                        {/* Scrollable Button Container */}
                        <div className="flex gap-4 overflow-x-auto pb-2 whitespace-nowrap">
                          {/* Row 1: Edit, Remove, Toggle Issue */}
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"
                            onClick={() => {
                              setEditingId(id);
                              setEditForm({ name, song, artist });
                            }}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"
                            onClick={() => handleSoftDelete(id)}
                          >
                            ❌ Remove
                          </button>

                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg shadow-md transition-all"
                            onClick={() => moveUp(signups[index].id, index)}
                            disabled={index === 0}
                          >
                            ⬆️ Up 1
                          </button>

                          <button
                            className="bg-blue-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg shadow-md transition-all"
                            onClick={() => moveDown(signups[index].id, index)}
                            disabled={index === signups.length - 1}
                          >
                            ⬇️ Down 1
                          </button>

                          <button
                            className={`py-6 px-4 rounded-lg font-bold text-white shadow-md transition-all ${
                              warnings[id]
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-yellow-500 hover:bg-yellow-600"
                            }`}
                            onClick={() =>
                              toggleWarning(id, warnings[id] || false)
                            }
                          >
                            {warnings[id]
                              ? "✅ Clear Warning"
                              : "⚠️ Mark Warning"}
                          </button>

                          <button
                            className={`py-2 px-4 rounded-lg font-bold text-white shadow-md transition-all ${
                              issues[id]
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                            onClick={() => toggleIssue(id, issues[id] || false)}
                          >
                            {issues[id] ? "✅ Clear Issue" : "🚨 Mark Issue"}
                          </button>

                          {/* Row 2: Move to Next / First / Sorting */}
                          <button
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"
                            onClick={() =>
                              moveToSecond(signups[index].id, index)
                            }
                          >
                            ⏩ Move Up Next
                          </button>

                          <button
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"
                            onClick={() =>
                              moveToFirst(signups[index].id, index)
                            }
                          >
                            ⬆️ Move to First
                          </button>

                          <button
                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-3 py-2 rounded-lg shadow-md transition-all"
                            onClick={sortByTime}
                          >
                            ⏳ Sort by Time
                          </button>

                          {/* Row 3: Move Controls */}

                          <button
                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-3 rounded-lg shadow-md transition-all"
                            onClick={() => moveUpFive(signups[index].id, index)}
                          >
                            ⬆️ Up 5
                          </button>

                          <button
                            className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-3 rounded-lg shadow-md transition-all"
                            onClick={() =>
                              moveDownFive(signups[index].id, index)
                            }
                          >
                            ⬇️ Down 5
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          )}
        </div>
        {user?.is_admin && (
          <div className="w-full max-w-2xl mx-auto mt-6 p-6 bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl shadow-xl border border-gray-700">
            <h2 className="text-2xl sm:text-3xl text-center font-bold text-white mb-6">
              🛠 Admin Panel
            </h2>

            {/* 🔄 Toggle Deleted Signups */}
            <button
              className={`w-full py-4 text-xl font-bold rounded-xl shadow-lg transition-all duration-300 transform ${
                showDeleted
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              onClick={() => {
                setShowDeleted(!showDeleted);
                if (!showDeleted) fetchDeletedSignups();
              }}
            >
              {showDeleted
                ? "❌ Hide Deleted Signups"
                : "📜 View Deleted Signups"}
            </button>

            {/* 🗑 Deleted Signups List */}
            {showDeleted && (
              <div className="mt-6 p-5 bg-gray-900 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-white text-center">
                  📜 Deleted Karaoke Signups
                </h3>

                {/* Scrollable Container */}
                <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  <ul className="list-none mt-4 space-y-3">
                    {deletedSignups.length > 0 ? (
                      deletedSignups.map(
                        ({ id, name, song, artist, created_at }) => (
                          <li
                            key={id}
                            className="bg-gray-800 p-4 rounded-lg shadow-md"
                          >
                            <p className="text-white font-bold">{name}</p>
                            <p className="text-gray-300">
                              🎶 "{song}" by {artist}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              ⏰{" "}
                              {created_at
                                ? new Date(created_at).toLocaleString()
                                : "Unknown"}
                            </p>
                          </li>
                        )
                      )
                    ) : (
                      <p className="text-center text-gray-400">
                        No deleted signups found.
                      </p>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-6">
              {/* 🔄 Toggle Deleted DJ Notes */}
              <button
                className={`w-full py-4 text-xl font-bold rounded-xl shadow-lg transition-all duration-300 transform ${
                  showDeletedNotes
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
                onClick={() => {
                  setShowDeletedNotes(!showDeletedNotes);
                  if (!showDeletedNotes) fetchDeletedNotes();
                }}
              >
                {showDeletedNotes
                  ? "❌ Hide Deleted DJ Notes"
                  : "📜 View Deleted DJ Notes"}
              </button>

              {/* 🗑 Deleted DJ Notes List */}
              {showDeletedNotes && (
                <div className="mt-6 p-5 bg-gray-900 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-white text-center">
                    📜 Deleted DJ Notes
                  </h3>

                  {/* Scrollable Container */}
                  <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    <ul className="list-none mt-4 space-y-3">
                      {deletedNotes.length > 0 ? (
                        deletedNotes.map(({ id, alert_details, created_at }) => (
                          <li
                            key={id}
                            className="bg-gray-800 p-4 rounded-lg shadow-md"
                          >
                            <p className="text-white font-medium">
                              📝 {alert_details}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              ⏰{" "}
                              {created_at
                                ? new Date(created_at).toLocaleString()
                                : "Unknown"}
                            </p>
                          </li>
                        ))
                      ) : (
                        <p className="text-center text-gray-400">
                          No deleted DJ Notes found.
                        </p>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 space-y-4">
              {/* 🚨 Delete All Signups */}
              <button
                className="w-full py-4 text-xl font-bold bg-red-700 hover:bg-red-800 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={handleDeleteAll}
              >
                🚨 DELETE ALL SINGERS 🚨
              </button>

              {/* 🚮 Clear Previous Singers */}
              <button
                className="w-full py-4 text-xl font-bold bg-red-700 hover:bg-red-800 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={handleHardDeleteSoftDeleted}
              >
                🚨🚮 Clear Previous Singers
              </button>

              {/* 🚮 Clear Alerts */}
              <button
                className="w-full py-4 text-xl font-bold bg-red-700 hover:bg-red-800 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={handleHardDeleteAll}
              >
                🚨 🚮 Clear Alerts
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
