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

  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [filter, setFilter] = useState("All");
  const categoryMap = {
    "Performance": ["Acting", "Singing", "Modeling", "Musical Production"],
    "Software": ["Software Engineering"],
    "Consultation": ["Consultation Services"],
    "Miscellaneous": ["Bartending Services", "Karaoke Host"],
  };
  const gradientBackgrounds = [
    "bg-gradient-to-r from-blue-500 to-teal-400",
    "bg-gradient-to-r from-purple-500 to-pink-400",
    "bg-gradient-to-r from-green-400 to-lime-500",
    "bg-gradient-to-r from-yellow-400 to-orange-500",
    "bg-gradient-to-r from-red-400 to-red-600",
    "bg-gradient-to-r from-indigo-400 to-blue-500",
  ];
  
  
  const filteredReviews =
  filter === "All"
    ? reviews // All Reviews
    : filter in categoryMap
    ? reviews.filter((review) => categoryMap[filter].includes(review.service))
    : reviews.filter((review) => review.service === filter);



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
        setReviews(data);
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
  
      if (!response.ok) throw new Error("Failed to add review");
  
      const newReview = await response.json();
      setReviews([...reviews, newReview.review]);
      setFormData({
        name: "",
        rating: "",
        service: "",
        description: "",
        image_url: "",
        website_url: "",
      });
  
      setShowForm(false); // Hide form
      triggerEmojis(); // Call the global emoji trigger function
    } catch (err) {
      setError(err.message);
    }
  };
  
  const { user, token } = useAuth();
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
<div
  className="relative p-8 min-h-screen bg-cover bg-center bg-no-repeat text-gray-100 flex flex-col items-center justify-start"
  style={{
    backgroundImage: `url('https://source.unsplash.com/1600x900/?feedback,customers')`,
  }}
>
<h2
  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide text-center mb-12 rainbow-text animate-fade-scale"
>
  ✨ Client Reviews & Feedback ✨
</h2>

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


      {/* Loading State */}
      {loading && (
        <div className="text-center text-lg font-semibold">
          Loading reviews...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-400 font-bold">
          {`Error: ${error}`}
        </div>
      )}
            {/* Add Review Form */}

      <button
  onClick={() => setShowForm((prev) => !prev)} // Toggle form visibility
  className="w-64  bg-gradient-to-r from-black to-red-800 text-white text-lg font-bold rounded-lg shadow-md  transition-all duration-300"
>
  {showForm ? "Hide Form" : "Share Your Experience ✨"}
</button>
<br/>
{showPopup && (
  <div
    className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
    onClick={() => setShowPopup(false)} // Close popup on background click
  >
    <div
      className="bg-white p-4 rounded-lg shadow-lg text-center"
      onClick={(e) => e.stopPropagation()} // Prevent closing on content click
    >
      <h2 className="text-xl font-semibold text-red-600 mb-2">Oops!</h2>
      <p className="text-gray-700">Please select a star rating before submitting.</p>
      <button
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        onClick={() => setShowPopup(false)}
      >
        Okay
      </button>
    </div>
  </div>
)}



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
<option value="Performance Services">Karaoke Host</option>
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
<br/>

<div className="flex flex-wrap justify-center mb-6 gap-4 overflow-x-auto">
{/* All Reviews Button */}
<button
  onClick={() => setFilter("All")}
  className={`w-40 h-6 text-sm rounded-full font-semibold transition-all duration-300 ease-in-out text-center ${
    filter === "All"
      ? "bg-gradient-to-r from-purple-500 to-orange-400 text-white shadow-lg scale-110 border-0 hover:from-purple-600 hover:to-orange-500"
      : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 border border-gray-400 hover:from-yellow-300 hover:to-teal-300 hover:scale-105"
  }`}
>
  All 📝
</button>




<button
  onClick={() => setFilter("Performance")}
  className={`w-40 h-6 text-sm rounded-full font-semibold transition-all duration-300 ease-in-out text-center ${
    filter === "Performance"
      ? "bg-gradient-to-r from-blue-500 to-indigo-400 text-white shadow-lg scale-110 border-0 hover:from-blue-600 hover:to-indigo-500"
      : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 border border-gray-400 hover:from-pink-300 hover:to-yellow-300 hover:scale-105"
  }`}
>
  Performance 🎭
</button>

{/* Software Button */}
<button
  onClick={() => setFilter("Software")}
  className={`w-40 h-6 text-sm rounded-full font-semibold transition-all duration-300 ease-in-out text-center ${
    filter === "Software"
      ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg scale-110 border-0 hover:from-green-500 hover:to-blue-600"
      : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 border border-gray-400 hover:from-pink-300 hover:to-yellow-300 hover:scale-105"
  }`}
>
  Software 👨🏻‍💻
</button>

{/* Consultation Button */}
<button
  onClick={() => setFilter("Consultation")}
  className={`w-40 h-6 text-sm rounded-full font-semibold transition-all duration-300 ease-in-out text-center ${
    filter === "Consultation"
      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-110 border-0 hover:from-yellow-500 hover:to-orange-600"
      : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 border border-gray-400 hover:from-pink-300 hover:to-yellow-300 hover:scale-105"
  }`}
>
  Consultation 👨🏻‍🔧💬
</button>

{/* Miscellaneous Button */}
<button
  onClick={() => setFilter("Miscellaneous")}
  className={`w-40 h-6 text-sm rounded-full font-semibold transition-all duration-300 ease-in-out text-center ${
    filter === "Miscellaneous"
      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-110 border-0 hover:from-pink-600 hover:to-purple-700"
      : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 border border-gray-400 hover:from-teal-200 hover:to-green-300 hover:scale-105"
  }`}
>
  Misc 🧩
</button>

</div>


      {/* Reviews Grid */}
{/* Reviews Grid */}
{!loading && !error && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
{currentReviews.map((review) => {
    const randomGradient =
      gradientBackgrounds[Math.floor(Math.random() * gradientBackgrounds.length)];

    return (
      <div
        key={review.id}
        onClick={() => setSelectedReview(review)} // Open modal on click
        className={`cursor-pointer text-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center hover:scale-105 transition-transform duration-200 ${randomGradient}`}
      >
        <h3 className="text-3xl font-bold text-white mb-1 text-center">
          {review.name}
        </h3>
        <p className="text-md text-black mb-2 italic">{review.service}</p>

        {review.image_url ? (
          <img
            src={review.image_url}
            alt="Review"
            className="w-60 h-28 rounded-full object-cover mb-2 shadow-sm"
          />
        ) : (
          <img
            src="https://www.pokemoncenter.com/wcsstore/PokemonCatalogAssetStore/images/catalog/products/P5074/710-04027/P5074_710-04027_06.jpg"
            alt="Placeholder"
            className="w-60 h-28 rounded-full object-cover mb-2 shadow-sm opacity-75"
          />
        )}

        {review.website_url?.trim() && (
          <a
            href={review.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-sm underline mb-2 hover:text-blue-600 transition"
          >
            Visit Website
          </a>
        )}

        <p className="text-sm text-gray-700 mb-2 text-center line-clamp-3">
          {review.description}
        </p>

        {user && ( // Only show if the user is logged in
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal click
              handleDelete(review.id); // Pass the review.id for deletion
            }}
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}

        <div className="flex items-center text-yellow-500">
          {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
            <span key={i} className="text-lg">★</span>
          ))}
          {review.rating % 1 >= 0.5 && <span className="text-lg">★</span>}
          {Array.from({ length: 5 - Math.ceil(review.rating) }, (_, i) => (
            <span key={`empty-${i}`} className="text-lg text-gray-300">★</span>
          ))}
        </div>

      </div>
      
      
    );
  })}
</div> 
)}
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
