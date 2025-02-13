import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import "./Gallery.css"; // Custom animations/styles

const Gallery = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user && user.is_admin; // Check for admin role
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchPhotoType, setSearchPhotoType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [photoType, setPhotoType] = useState("");
  const photosPerPage = 12;

  const fetchPhotos = () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (searchCategory) queryParams.append("category", searchCategory);
    if (searchPhotoType) queryParams.append("photo_type", searchPhotoType);

    // Construct the URL properly without trailing "?"
    const queryString = queryParams.toString();
    const url = queryString
      ? `http://127.0.0.1:5000/gallery?${queryString}`
      : `http://127.0.0.1:5000/gallery`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch photos.");
        }
        return res.json();
      })
      .then((data) => {
        setPhotos(data);
        setMessage("");
      })
      .catch((err) => {
        console.error("Error fetching photos:", err);
        setMessage("Failed to fetch photos.");
      })
      .finally(() => setLoading(false));
  };
  const handleUpload = (e) => {
    e.preventDefault();

    const newPhoto = {
      image_url: file,
      caption,
      category,
      photo_type: photoType,
    };

    fetch("http://127.0.0.1:5000/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newPhoto),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to upload photo.");
        }
        return res.json();
      })
      .then((data) => {
        setPhotos((prev) => [...prev, data.photo]);
        setMessage("Photo uploaded successfully!");
        setFile("");
        setCaption("");
        setCategory("");
        setPhotoType("");
        setShowUploadForm(false); // Close the form
      })
      .catch((err) => {
        console.error("Error uploading photo:", err);
        setMessage("Failed to upload photo.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    fetch(`http://127.0.0.1:5000/gallery/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(() => {
        setPhotos((prev) => prev.filter((photo) => photo.id !== id));
        setMessage("Photo deleted successfully!");
      })
      .catch(() => setMessage("Error deleting photo."));
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const paginatedPhotos = photos.slice(
    (currentPage - 1) * photosPerPage,
    currentPage * photosPerPage
  );

  useEffect(() => {
    fetchPhotos();
  }, [searchCategory, searchPhotoType]);

  return (
    <div
      className="relative text-white min-h-screen p-6 overflow-hidden"
      style={{
        backgroundImage: `url('stage.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center top 5px",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Falling Sparkles */}
      {Array.from({ length: 50 }).map((_, index) => (
        <div
          key={index}
          className="sparkle"
          style={{
            left: `${Math.random() * 100}vw`, // Randomize horizontal position
            animationDelay: `${Math.random() * 5}s`, // Randomize animation start
            animationDuration: `${3 + Math.random() * 5}s`, // Randomize animation speed
          }}
        ></div>
      ))}

      {/* Existing Content */}
      <div className="curtain left"></div>
      <div className="curtain right"></div>
      <h1
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-center mt-20 mb-6 text-white animate-fade-scale"
        style={{ fontFamily: "'Aspire', sans-serif" }}
      >
        ✨ Photo Gallery ✨
      </h1>

      {/* Search Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {/* Filter by Category with Tooltip */}
        <div className="relative group">
          <input
            type="text"
            placeholder="Filter by Category"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="border rounded p-2 text-gray-700 bg-gray-800"
          />
          <div
            className="absolute bottom-full mb-2 w-52 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            Search by category names, e.g., "Volunteer", "Modeling", "Software
            Engineering".
          </div>
        </div>

        {/* Filter by Photo Type with Tooltip */}
        <div className="relative group">
          <input
            type="text"
            placeholder="Filter by Photo Type"
            value={searchPhotoType}
            onChange={(e) => setSearchPhotoType(e.target.value)}
            className="border rounded p-2 text-white bg-gray-800"
          />
          <div
            className="absolute bottom-full mb-2 w-52 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            Search by photo types, e.g., "Portrait", "Landscape", "Candid".
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center">Loading photos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative group rounded-lg shadow-lg overflow-hidden"
            >
              {/* Delete Button (Admin Only) */}
              {isAdmin && (
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 z-10 bg-red-600 text-white px-2 py-1 rounded shadow hover:bg-red-700"
                  style={{ zIndex: 10 }} // Inline z-index for higher visibility
                >
                  Delete
                </button>
              )}
              <img
                src={photo.image_url}
                alt={photo.caption}
                className="w-full h-48 object-cover cursor-pointer transition-transform group-hover:scale-110"
                onClick={() => setSelectedPhoto(photo)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-center p-2 opacity-0 group-hover:opacity-100 transition">
                <p>{photo.category || "Uncategorized"}</p>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-center p-2 opacity-0 group-hover:opacity-100 transition">
                  <p className="truncate text-white px-2" title={photo.caption}>
                    {photo.caption || "No Caption"}
                  </p>
                  <p className="text-white">
                    {photo.category || "Uncategorized"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from(
          { length: Math.ceil(photos.length / photosPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      {/* Modal for Selected Photo */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          {/* Modal Content */}
          <div className="relative bg-gray-800 p-6 max-w-3xl w-[90%] max-h-[90vh] overflow-y-auto flex flex-col rounded-lg shadow-lg">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
              aria-label="Close"
            >
              &times;
            </button>

            {/* Image */}
            <div className="flex items-center justify-center">
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.caption}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            {/* Caption & Details */}
            <div className="text-center mt-4 text-white">
              <div className="text-md font-bold max-h-24 overflow-y-auto break-words px-2">
                {selectedPhoto.caption}
              </div>
              <p className="mt-2">
                Category: {selectedPhoto.category || "Uncategorized"}
              </p>
              <p>Type: {selectedPhoto.photo_type || "No Type"}</p>
            </div>
          </div>
        </div>
      )}

      <br />
      {/* Message Display */}
      {message && (
        <p className="text-green-400 text-center mt-4 font-bold">{message}</p>
      )}
      <br />
      {/* Admin Upload Form */}
      {isAdmin && (
        <div className="max-w-md mx-auto bg-gray-700 p-6 rounded-lg shadow-md mb-8">
          <button
            onClick={() => setShowUploadForm((prev) => !prev)} // Toggle the form visibility
            className="relative w-full py-3 px-6 text-2xl font-bold text-white uppercase tracking-wider 
                 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 
                 hover:from-purple-600 hover:via-red-500 hover:to-yellow-400 
                 rounded-lg overflow-hidden transition-transform duration-500 ease-in-out 
                 transform hover:scale-105 hover:shadow-2xl"
          >
            <span className="relative z-10">
              {showUploadForm ? "Close Upload Form" : "Add to Gallery"}
            </span>
          </button>

          {message && (
            <p className="mb-4 text-center text-green-600 font-semibold">
              {message}
            </p>
          )}

          {showUploadForm && (
            <form onSubmit={handleUpload} className="mt-2 space-y-4">
              <div className="relative group">
                <a
                  href="https://imgur.com/upload"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-block w-full font-bold text-white text-center mb-2 uppercase rounded-lg
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
                  Don't have a URL for your image yet? Click the link. <br />
                  1. Add your image <br />
                  2. Right-click on the image and "Copy Image Address" <br />
                  If it doesn't look like this:
                  "https://i.imgur.com/example.jpg" <br />
                  try copying the address again.
                </div>
              </div>

              <input
                type="url"
                placeholder="Image URL"
                value={file}
                onChange={(e) => setFile(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
              <input
                type="text"
                placeholder="Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                placeholder="Photo Type"
                value={photoType}
                onChange={(e) => setPhotoType(e.target.value)}
                className="w-full border rounded p-2"
              />

              <button
                type="submit"
                className="relative w-full py-3 px-6 font-bold text-white uppercase rounded-lg 
                     bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 
                     hover:from-red-500 hover:via-yellow-400 hover:to-red-500 
                     shadow-lg transition-all duration-300 ease-in-out 
                     transform hover:scale-105 hover:shadow-2xl group"
              >
                <span className="relative z-10">Upload Photo</span>
                <div
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-300 via-red-400 to-yellow-300 
                       opacity-30 blur-lg group-hover:opacity-50 group-hover:blur-2xl pointer-events-none"
                ></div>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
