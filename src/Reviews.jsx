import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Update the path if needed

export default function Reviews({ triggerEmojis }) {
    const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false); // Controls emoji visibility
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const reviewsPerPage = 12; // Reviews per page
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // For pop-up message
  
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [filter, setFilter] = useState("All");
  const categoryMap = {
    "Performance": ["Acting", "Singing", "Modeling", "Musical Production", "Performance Services", "Karaoke Host"],
    "Software": ["Software Engineering"],
    "Consultation": ["Consultation Services"],
    "Miscellaneous": ["Bartending Services"],
  };
  const gradientBackgrounds = [
    "bg-gradient-to-r from-blue-500 to-teal-400",
    "bg-gradient-to-r from-purple-500 to-pink-400",
    "bg-gradient-to-r from-green-400 to-lime-500",
    "bg-gradient-to-r from-yellow-400 to-orange-500",
    "bg-gradient-to-r from-red-400 to-red-600",
    "bg-gradient-to-r from-indigo-400 to-blue-500",
  ];
  
  console.log("All Reviews:", reviews);  // ✅ Check if Karaoke Host exists
console.log("Category Map:", categoryMap);  // ✅ Verify correct mapping
console.log("Filter Selected:", filter);  // ✅ See what filter is applied

  const filteredReviews =
  filter === "All"
    ? reviews
    : filter in categoryMap
    ? reviews.filter((review) => categoryMap[filter].includes(review.service))
    : reviews.filter((review) => review.service === filter);

    console.log(reviews.map(review => review.service));


  // Form state for adding a review
  const [formData, setFormData] = useState({
    name: "",
    rating: "",
    service: "",
    description: "",
    image_url: "",
    website_url: "",
  });

  // Fetch reviews from the backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("https://portfoliobackend-ih6t.onrender.com/reviews");
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
  
        // Filter approved reviews if needed
        const approvedReviews = data.filter(review => review.is_approved);
        setReviews(approvedReviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://portfoliobackend-ih6t.onrender.com/reviews/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Include token
        },
      });
      if (!response.ok) throw new Error("Failed to delete review");
  
      // Update state to remove the deleted review
      setReviews(reviews.filter((review) => review.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Before Submission:", formData);
  
    if (!formData.rating) {
      setShowPopup(true); // Show popup if no rating is selected
      return;
    }
  
    try {
      const response = await fetch("https://portfoliobackend-ih6t.onrender.com/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      console.log("Server Response:", result); // Log response to verify data
  
      if (!response.ok) throw new Error(result.error || "Failed to add review");
  
      // Show success pop-up
      setSuccessMessage("Your review has been submitted and is pending approval!");
      setShowSuccessPopup(true);
  
      // Reset form and close it
      setFormData({
        name: "",
        rating: "",
        service: "",
        description: "",
        image_url: "",
        website_url: "",
      });
  
      setShowForm(false);
      triggerEmojis(); // Call the global emoji trigger function
    } catch (err) {
      console.error("Error Adding Review:", err);
      setError(err.message);
    }
  };
  
  
  const { user, token } = useAuth();
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
<div
  className="relative  p-8 min-h-screen bg-cover bg-center bg-no-repeat text-gray-100 flex flex-col items-center justify-start"
  style={{
    backgroundImage: `url('https://source.unsplash.com/1600x900/?feedback,customers')`,
  }}
>
  <div className="bg-white rounded-3xl">
    <h2
  className="text-center font-serif font-extrabold tracking-wide text-white 
             animate-fade-scale p-2 
             text-4xl sm:text-4xl md:text-7xl lg:text-8xl"
>
  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
    ✨ Reviews ✨
  </span>
</h2>

</div>
<button
  onClick={() => setShowForm((prev) => !prev)}
  className="mt-6 px-6 py-3 text-xl font-bold text-white uppercase 
             bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 
             hover:scale-105 hover:shadow-lg transform transition-all duration-300 rounded-2xl"
>
  {showForm ? "❌ Close Review Form" : "➕ Leave a Review"}
</button>



{showForm && (
        <div
  className="rounded-lg p-8 text-gray-800 shadow-2xl w-full max-w-3xl mx-auto bg-cover bg-center"

>
    
        <form onSubmit={handleSubmit} className="space-y-4">
            
  <div>
    
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="w-full text-black bg-gray-100 border text-center rounded-lg p-2"
      placeholder="First Name, Last Initial e.g: John D."
      required
    />
  </div>


  <div>
<select
name="service"
value={formData.service}
onChange={handleChange}
className="w-full border text-center rounded-lg p-2 bg-gray-100 text-gray-800"
required
>
<option value="" disabled>Select a service</option>
<option value="Software Engineering">Software Engineering</option>
<option value="Consultation Services">Consultation</option>
<option value="Karaoke Host">Karaoke Host</option> 
<option value="Bartending Services">Bartending</option>
<option value="Musical Production">Muscial Production</option>
<option value="Acting">Acting</option>
<option value="Singing">Singing</option>
<option value="Modeling">Modeling</option>
</select>
</div>
<div className="relative flex justify-center items-center space-x-1">
  {[1, 2, 3, 4, 5].map((star) => {
    const isHalfStar = formData.rating === star - 0.5; // Check if half-star
    const isFullStar = formData.rating >= star; // Check if full star

    return (
      <div key={star} className="relative group cursor-pointer">
        <span
          className={`text-3xl ${
            isFullStar || isHalfStar ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              rating:
                prev.rating === star - 0.5
                  ? star // If currently half, set to full
                  : prev.rating >= star
                  ? star - 0.5 // If full, set to half
                  : star - 0.5, // Default to half
            }));
          }}
        >
          {isHalfStar ? "☆" : "★"} {/* Use ☆ for half-star */}
        </span>

        {/* Custom Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md z-10">
          {isHalfStar
            ? "Half star rating: 0.5"
            : isFullStar
            ? `Full star rating: ${star}`
            : "Empty star = half rating .5"}
        </div>
      </div>
    );
  })}
</div>
  <div>
    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      rows="3"
      className="w-full text-black bg-gray-100 border text-center rounded-lg p-2"
      placeholder="Share your experience!"
      required
    ></textarea>
  </div>
  <label className="block text-white text-center text-2xl underline font-semibold">Image URL (Optional)</label>

        <div className="relative group">
        <a
  href="https://imgur.com/upload"
  target="_blank"
  rel="noopener noreferrer"
  className="relative inline-block w-full font-bold text-white text-center mb-2  uppercase rounded-lg
             bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-lg transition-all duration-300 ease-in-out 
             hover:scale-105 hover:from-green-500 hover:via-green-600 hover:to-green-700 hover:shadow-2xl
             before:absolute before:-inset-1 before:rounded-lg before:bg-green-300 before:blur-lg before:opacity-30"
>
  <span className="relative z-10">Upload Photo to Imgur</span>
</a>

  {/* Tooltip */}
  <div
    className="absolute bottom-full mb-2 w-64 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg 
               opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
    style={{ left: "50%", transform: "translateX(-50%)" }}
  >
    Don't have a URL for your image yet? Click the link. <br/> 
    1: add your image <br/> 2.  right-click on the image and "Copy Image Address" <br/> If it doesn't look like this: "https://i.imgur.com/rwfrF.jpeg" <br/> try to copy the image address  once more.
  </div>
</div>

  <div>
    <input
      type="url"
      name="image_url"
      value={formData.image_url}
      onChange={handleChange}
      className="w-full text-black bg-gray-100 border text-center rounded-lg p-2"
      placeholder="e.g., https://example.com/image.jpg"
    />
  </div>
  <div>
    <label className="block text-white underline text-2xl text-center font-semibold">Website URL (Optional)</label>
    <input
      type="url"
      name="website_url"
      value={formData.website_url}
      onChange={handleChange}
      className="w-full text-black bg-gray-100 border text-center rounded-lg p-2"
      placeholder="e.g., https://example.com"
    />
  </div>
  <button
    type="submit"
    className="w-full text-2xl py-2 bg-gradient-to-r from-green-600 via-yellow-500 to-green-600 shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700 text-white font-bold rounded-lg"
  >
    Submit Review
  </button>
</form>
</div>
)}
<p className="underline mt-2">Sort By Review Type</p>

{showEmojis && (
  <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50">
    {Array.from({ length: 20 }).map((_, index) => (
      <span
        key={index}
        className="emoji absolute"
        style={{
          left: `${Math.random() * 100}vw`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${Math.random() * 3 + 2}s`,
        }}
      >
        {Math.random() > 0.5 ? "🌟" : "💕"}
      </span>
    ))}
  </div>
)}
<div className="flex flex-wrap justify-center gap-3 mb-4 mt-3 ml-2  whitespace-nowrap">
  {[
    { label: "All 📝", value: "All", colors: "from-purple-500 to-orange-400" },
    { label: "Performance 🎭", value: "Performance", colors: "from-blue-500 to-indigo-400" },
    { label: "Software 👨🏻‍💻", value: "Software", colors: "from-green-400 to-blue-500" },
    { label: "Consultation 👨🏻‍🔧💬", value: "Consultation", colors: "from-yellow-400 to-orange-500" },
    { label: "Misc 🧩", value: "Miscellaneous", colors: "from-pink-500 to-purple-600" },
  ].map(({ label, value, colors }) => (
    <button
      key={value}
      onClick={() => setFilter(value)}
      className={`w-40 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out shadow-md text-center
        ${
          filter === value
            ? `bg-gradient-to-r ${colors} text-white shadow-lg scale-105 border-0`
            : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-400 hover:scale-105"
        }`}
    >
      {label}
    </button>
  ))}
</div>


{!loading && !error && (
  <div className="w-full py-12 px-4 md:px-8 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 rounded-xl shadow-lg">
    <h2 className="text-center text-4xl font-bold text-white mb-8">
      🌟 Community Reviews 🌟
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {currentReviews.map((review) => (
        <div
          key={review.id}
          onClick={() => setSelectedReview(review)} // Open modal on click
          className="cursor-pointer bg-blue-950/90 border border-blue-400/20 text-white rounded-lg shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200 hover:shadow-2xl"
        >
          {/* Reviewer Name */}
          <h3 className="text-xl font-bold text-white mb-2 text-center">
            {review.name}
          </h3>

          {/* Service Type */}
          <p className="text-sm text-gray-300 mb-3 italic">{review.service}</p>

          {/* Profile Image or Placeholder */}
          {review.image_url ? (
            <img
              src={review.image_url}
              alt="Review"
              className="w-28 h-28 rounded-full object-cover mb-3 border-2 border-white/40 shadow-md"
            />
          ) : (
            <img
              src="https://www.pokemoncenter.com/wcsstore/PokemonCatalogAssetStore/images/catalog/products/P5074/710-04027/P5074_710-04027_06.jpg"
              alt="Placeholder"
              className="w-28 h-28 rounded-full object-cover mb-3 border-2 border-white/40 shadow-md opacity-75"
            />
          )}

          {/* Scrollable Review Text */}
          <div className="w-full max-h-32 overflow-y-auto px-4 text-sm text-gray-200 text-center bg-blue-800/40 rounded-lg p-3 border border-blue-500/20 shadow-sm">
            {review.description}
          </div>

          {/* Website Link (If Available) */}
          {review.website_url?.trim() && (
            <a
              href={review.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-blue-300 text-sm underline hover:text-blue-400 transition"
            >
              Visit Website
            </a>
          )}

          {/* Star Ratings */}
          <div className="flex items-center text-yellow-400 mt-3">
            {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
              <span key={i} className="text-xl">★</span>
            ))}
            {review.rating % 1 >= 0.5 && <span className="text-xl">★</span>}
            {Array.from({ length: 5 - Math.ceil(review.rating) }, (_, i) => (
              <span key={`empty-${i}`} className="text-xl text-gray-600">★</span>
            ))}
          </div>

          {/* Delete Button for Admins */}
          {user && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal click
                handleDelete(review.id);
              }}
              className="mt-4 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
)}




 
<br/>



  
<div className="flex justify-center space-x-4 mt-4">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
  >
    Previous
  </button>
  <span className="font-bold text-lg">{`Page ${currentPage}`}</span>
  <button
    onClick={() => setCurrentPage((prev) => prev + 1)}
    disabled={indexOfLastReview >= filteredReviews.length}
    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
  >
    Next
  </button>
</div>


{selectedReview && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
      <button
        onClick={() => setSelectedReview(null)} // Close modal
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
      >
        ✕
      </button>
      <h3 className="text-2xl font-bold text-blue-600 mb-2 text-center">
        {selectedReview.name}
      </h3>
      <p className="text-gray-600 text-sm mb-4 italic text-center">
        {selectedReview.service}
      </p>

      {selectedReview.image_url ? (
  <img
    src={selectedReview.image_url}
    alt="Review"
    className="w-full max-w-lg h-auto mx-auto rounded-lg mb-4 shadow-lg"
  />
) : (
  <img
    src="https://www.pokemoncenter.com/wcsstore/PokemonCatalogAssetStore/images/catalog/products/P5074/710-04027/P5074_710-04027_06.jpg" 
    alt="Placeholder"
    className="w-full max-w-lg max-h-60 h-auto mx-auto rounded-lg mb-4 shadow-lg opacity-75 object-contain"
  />
)}



      {selectedReview.website_url?.trim() && (
        <a
          href={selectedReview.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center text-white text-center underline hover:text-blue-600 transition"
          >
          Visit Website
        </a>
      )}
            {/* Star Ratings */}
            <div className="flex justify-center items-center text-yellow-500 mb-4">
        {Array.from({ length: Math.floor(selectedReview.rating) }, (_, i) => (
          <span key={i} className="text-2xl">★</span> // Full stars
        ))}
        {selectedReview.rating % 1 >= 0.5 && <span className="text-2xl">★</span>} {/* Half star */}
        {Array.from({ length: 5 - Math.ceil(selectedReview.rating) }, (_, i) => (
          <span key={`empty-${i}`} className="text-2xl text-gray-300">★</span> // Empty stars
        ))}
      </div>
      <div className="overflow-y-auto max-h-[10vh] mb-4 px-2">
      <p className="text-gray-700">{selectedReview.description}</p>
    </div>
          {user && ( // Only show if the user is logged in
  <button
    onClick={() => handleDelete(selectedReview.id)} // Call handleDelete
    className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
  >
    Delete
  </button>
)}
    </div>




  </div>
)}


      {/* No Reviews Fallback */}
      {!loading && reviews.length === 0 && (
        <div className="text-center text-gray-300 text-lg">
          No reviews available at this time.
        </div>
      )}
    </div>
  );
}
