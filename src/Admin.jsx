import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "./AuthContext";
import ContactManager from "./Contact";
import EngineeringBookingManager from "./Engineering";
import GeneralInquiryManager from "./General";
import KaraokeManager from "./KaraokeManager";
import MileageTracker from "./Mileage";
import ExpenseTracker from "./Expenses";
import Income from "./Income"
import GoogleCalendarManager from "./GoogleCal";
export default function Admin() {
  const { token } = useAuth();



  const [showMileageTracker, setShowMileageTracker] = useState(false);
  const [showKaraokeManager, setShowKaraokeManager] = useState(false);
  const [showContactManager, setShowContactManager] = useState(false);
  const [showEngineeringBookingManager, setShowEngineeringBookingManager] = useState(false);
  const [showGeneralInquiryManager, setShowGeneralInquiryManager] = useState(false);
  const [showIncome, setShowIncome] = useState(false);
  const [showExpenseTracker, setShowExpenseTracker] = useState(false);
  const [showPendingReviews, setShowPendingReviews] = useState(false); // ✅ Toggle State
  const [activeSection, setActiveSection] = useState(null);

  
  const generateRandomGradient = () => {
    const colors = [
      "#ffb3c6", "#ffd8b1", "#fcf4a3", "#b3e6b5", "#b3d9ff", "#e0b3ff", "#ffc3a0",
      "#f7d794", "#85e3ff", "#b9fbc0", "#ff9a8b", "#ffdde1", "#c3bef7", "#f8c3df",
    ];
  


    // Pick two random colors for a gradient
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    const color2 = colors[Math.floor(Math.random() * colors.length)];
  
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  };
  const [editingReview, setEditingReview] = useState(null);
  const [editFormData, setEditFormData] = useState({});
    // Handle input changes for editing form
    const handleEditInputChange = (e) => {
      const { name, value } = e.target;
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    // Enable editing mode
    const handleEditClick = (review) => {
      setEditingReview(review.id);
      setEditFormData({
        name: review.name,
        rating: review.rating,
        service: review.service,
        description: review.description,
        website_url: review.website_url || "",
        image_url: review.image_url || "",

      });
    };
    const handleEditSubmit = async (id) => {
      try {
        const response = await fetch(`https://portfoliobackend-ih6t.onrender.com/reviews/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFormData),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update review");
        }
  
        setPendingReviews((prev) =>
          prev.map((review) =>
            review.id === id ? { ...review, ...editFormData } : review
          )
        );
  
        setEditingReview(null); // Exit editing mode
      } catch (err) {
        (err.message);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditFormData({});
  };
  const [pendingReviews, setPendingReviews] = useState([]);
  const [reviewsError, setReviewsError] = useState("");

  const [searchParams, setSearchParams] = useState({
    name: "",
    phone: "",
    status: "",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long", // Full weekday name
      year: "numeric",
      month: "long", // Full month name
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // AM/PM format
    });
  };
  const fetchPendingReviews = async () => {
    try {
      const response = await fetch("https://portfoliobackend-ih6t.onrender.com/reviews/pending");

      
      const data = await response.json();
  
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setPendingReviews(data);
      } else {
        setPendingReviews([]); // Default to an empty array
      }
      setReviewsError("");
    } catch (err) {
      setReviewsError("Failed to fetch pending reviews.");
      setPendingReviews([]); // Reset to empty array on error
    }
  };
  useEffect(() => {
    fetchPendingReviews(); // Call the function when the component mounts
  }, []);
  

  const handleApproveReview = async (id) => {
    try {
      await fetch(`https://portfoliobackend-ih6t.onrender.com/reviews/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (err) {
      setReviewsError("Failed to approve review.");
    }
  };
  
  const handleDeleteReview = async (id) => {
    try {
      await fetch(`https://portfoliobackend-ih6t.onrender.com/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (err) {
      setReviewsError("Failed to delete review.");
    }
  };

  


  




  
  return (
    <div className="">
<div className="bg-gradient-to-b from-gray-900 to-gray-800    rounded-3xl shadow-2xl border-4 border-gray-700 relative">
  {/* Subtle Glow Effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-20 blur-2xl"></div>

  {/* Title */}
  <h1 className="text-2xl sm:text-6xl lg:text-8xl text-center font-extrabold mb-3 mt-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-xl font-serif animate-text-glow">
    Jwhit Dashboard
  </h1>

  {/* Floating Gradient Accent */}
  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-yellow-500 to-pink-500 opacity-50 rounded-full blur-3xl"></div>
</div>
<GoogleCalendarManager/>
<div className="flex justify-center items-center ">

<div className="flex flex-col items-center justify-center  overflow-y-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-800 p-4 rounded-lg w-full max-w-lg border-8  bg-black border-3 border-white shadow-lg">
  {/* Buttons with uniform width */}
  <h2 className="font-bold text-xl mb-2 underline">JWhit Command Center</h2>
  <button
  onClick={() => setActiveSection(activeSection === "mileage" ? null : "mileage")}
  className="w-full max-w-[250px] px-6 py-3 mb-2 rounded-3xl border-2 border-white  text-white font-bold shadow-md transition-all duration-300 
               bg-gradient-to-r from-pink-400 to-purple-500 hover:scale-105 hover:from-purple-500 hover:to-pink-400"
  >
    🚗 Mileage Tracker
  </button>

  <button
  onClick={() => setActiveSection(activeSection === "karaoke" ? null : "karaoke")}
  className="w-full max-w-[250px] px-6 py-3 rounded-3xl mb-2 text-white border-2 border-white  font-bold shadow-md transition-all duration-300 
               bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 hover:from-orange-500 hover:to-yellow-400"
  >
    🎤 Karaoke 
  </button>

  <button
  onClick={() => setActiveSection(activeSection === "contact" ? null : "contact")}
  className="w-full max-w-[250px] px-6 py-3 rounded-3xl mb-2 text-white border-2 border-white  font-bold shadow-md transition-all duration-300 
               bg-gradient-to-r from-blue-400 to-cyan-500 hover:scale-105 hover:from-cyan-500 hover:to-blue-400"
  >
    📞 Contact 
  </button>

  <button
  onClick={() => setActiveSection(activeSection === "engineering" ? null : "engineering")}
  className="w-full max-w-[250px] px-6 py-3 rounded-3xl mb-2 text-white border-2 border-white  font-bold shadow-md transition-all duration-300 
               bg-gradient-to-r from-green-400 to-teal-500 hover:scale-105 hover:from-teal-500 hover:to-green-400"
  >
    ⚙️ Engineering 
  </button>

  <button
  onClick={() => setActiveSection(activeSection === "general" ? null : "general")}
  className="w-full max-w-[250px] px-6 py-3 rounded-3xl mb-2 text-white border-2 border-white  font-bold shadow-md transition-all duration-300 
               bg-gradient-to-r from-red-400 to-pink-500 hover:scale-105 hover:from-pink-500 hover:to-red-400"
  >
    📨 General 
  </button>

  <button
  onClick={() => setActiveSection(activeSection === "income" ? null : "income")}
  className="w-full max-w-[250px] px-6 py-3 rounded-3xl mb-2 text-white border-2 border-white  font-bold shadow-md transition-all duration-300 
               bg-gradient-to-r from-lime-400 to-green-500 hover:scale-105 hover:from-green-500 hover:to-lime-400"
  >
    💰 Income
  </button>

  <button
  onClick={() => setActiveSection(activeSection === "expense" ? null : "expense")}
    className="w-full max-w-[250px] px-6 py-3 rounded-3xl mb-2 text-white font-bold border-2 border-white  shadow-md transition-all duration-300 
               bg-gradient-to-r from-gray-400 to-gray-600 hover:scale-105 hover:from-gray-600 hover:to-gray-400"
  >
    🧾 Expense 
  </button>

  <button
  onClick={() => {
    setActiveSection(activeSection === "reviews" ? null : "reviews");
    fetchPendingReviews(); // Ensure it fetches reviews when opened
  }}

  className="w-full max-w-[250px] px-6 py-3 rounded-3xl mb-2 text-white font-bold border-2 border-white  shadow-md transition-all duration-300 
               bg-gradient-to-r from-yellow-400 to-green-500 hover:scale-105 hover:from-yellow-500 hover:to-green-400"
  >
    {showPendingReviews ? "➖ Pending Reviews" : "➕ Pending Reviews"}
  </button>

  {/* Conditional Components */}

</div>
</div>
{activeSection === "mileage" && <MileageTracker />}
{activeSection === "karaoke" && <KaraokeManager />}
{activeSection === "contact" && <ContactManager />}
{activeSection === "engineering" && <EngineeringBookingManager />}
{activeSection === "general" && <GeneralInquiryManager />}
{activeSection === "income" && <Income />}
{activeSection === "expenses" && <ExpenseTracker />}
      <div>




      {activeSection === "reviews" && (

<section className="mb-6  text-center">
  {reviewsError && <p className="text-red-500">{reviewsError}</p>}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
    {pendingReviews.length === 0 ? (
      <p className="font-bold">No pending reviews currently.</p>
    ) : (
      pendingReviews.map((review) => (
<div
  key={review.id}
  style={{
    background: generateRandomGradient(), // Dynamic gradient for each card
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    padding: "16px",
    border: "6px solid white", // White border
    color: "gray", // Ensures text readability
  }}
>

          {editingReview === review.id ? (
            // Edit Mode: Render form for editing
            <div>
              <h4 className="font-bold mb-2">Edit Review</h4>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditInputChange}
                placeholder="Name"
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="number"
                name="rating"
                value={editFormData.rating}
                onChange={handleEditInputChange}
                placeholder="Rating"
                className="w-full mb-2 p-2 border rounded"
              />
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditInputChange}
                placeholder="Description"
                className="w-full mb-2 p-2 border rounded"
              />
              <input
  type="text"
  name="image_url"
  value={editFormData.image_url || ""}
  onChange={handleEditInputChange}
  placeholder="Image URL"
  className="w-full mb-2 p-2 border rounded"
/>

              <input
                type="text"
                name="website_url"
                value={editFormData.website_url}
                onChange={handleEditInputChange}
                placeholder="Website URL"
                className="w-full mb-2 p-2 border rounded"
              />

              {/* Save and Cancel Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditSubmit(review.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Normal Mode: Display review details
            <>
              <h4 className="font-bold mb-2">{review.name}</h4>
              <p>
                <strong>Rating:</strong> {review.rating}
              </p>
              <p>
                <strong>Service:</strong> {review.service}
              </p>
              <p>
                <strong>Description:</strong> {review.description}
              </p>
              {review.image_url && (
                <img
                  src={review.image_url}
                  alt="Review"
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              {review.website_url && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={review.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Visit Site
                  </a>
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleApproveReview(review.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleEditClick(review)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))
    )}
  </div>
</section>
      )}

      </div>
      
    </div>
  );
}
