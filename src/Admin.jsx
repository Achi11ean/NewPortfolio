import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "./AuthContext";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Calendar from "./Calendar";

import {
    Chart as ChartJS,
    CategoryScale, // Important for 'category' scale (x-axis)
    LinearScale,    // y-axis
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
  // Register components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
export default function Admin() {
  const { token } = useAuth();
  const chartRef = useRef(null);
  const [currentEditingEngineering, setCurrentEditingEngineering] = useState(null);
  const [updatedEngineeringData, setUpdatedEngineeringData] = useState({});
  const [currentEditingPerformance, setCurrentEditingPerformance] = useState(null); // Track editing booking
  const [updatedPerformanceData, setUpdatedPerformanceData] = useState({}); // Store updated data
  const [currentEditingContact, setCurrentEditingContact] = useState(null);
  const [contacts, setContacts] = useState([]); // Fetch contacts if needed

  const [updatedContactData, setUpdatedContactData] = useState({});
  const handleUpdateContact = async (id) => {
    try {
      const response = await fetch(`https://portfoliobackend-ih6t.onrender.com/contacts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedContactData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update contact");
      }
  
      const updatedContact = await response.json();
  
      // Update the local state with the updated contact data
      setBookings((prev) => ({
        ...prev,
        contacts: prev.contacts.map((contact) =>
          contact.id === id ? updatedContact.contact : contact
        ),
      }));
  
      setCurrentEditingContact(null); // Exit editing mode
      setUpdatedContactData({}); // Clear the form data
    } catch (err) {
      console.error("Error updating contact:", err.message);
    }
  };
  const handleUpdateEngineeringBooking = async (id) => {
    try {
      const response = await fetch(
        `https://portfoliobackend-ih6t.onrender.com/engineering-bookings/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedEngineeringData),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update engineering booking");
      }
  
      const updatedBooking = await response.json();
  
      setBookings((prev) => ({
        ...prev,
        engineering_bookings: prev.engineering_bookings.map((booking) =>
          booking.id === id ? updatedBooking : booking
        ),
      }));
  
      setCurrentEditingEngineering(null); // Exit edit mode
    } catch (err) {
      console.error(err.message);
    }
  };
  
  const handleCancelEditEngineering = () => {
    setCurrentEditingEngineering(null);
    setUpdatedEngineeringData({});
  };
  
  const handleEditPerformanceClick = (booking) => {
    setCurrentEditingPerformance(booking.id);
    setUpdatedPerformanceData({
      contactId: booking.contact?.id || "",
      eventName: booking.event_name,
      eventType: booking.event_type,
      eventDateTime: booking.event_date_time,
      location: booking.location,
      guests: booking.guests || "",
      specialRequests: booking.special_requests || "",
      price: booking.price || "",
      status: booking.status,
    });
  };
  
  const handleCancelEditPerformance = () => {
    setCurrentEditingPerformance(null);
    setUpdatedPerformanceData({});
  };
  

  const handleUpdatePerformanceBooking = (id) => {
    fetch(`https://portfoliobackend-ih6t.onrender.com/performance-bookings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPerformanceData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update booking");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Booking updated:", data);
  
        // Update local state to reflect changes
        setBookings((prev) => ({
          ...prev,
          performance_bookings: prev.performance_bookings.map((booking) =>
            booking.id === id ? data.booking : booking
          ),
        }));
  
        // Exit edit mode and clear data
        setCurrentEditingPerformance(null);
        setUpdatedPerformanceData({});
      })
      .catch((error) => {
        console.error("Error updating booking:", error);
      });
  };
  

  const handleEditEngineeringClick = (booking) => {
    setCurrentEditingEngineering(booking.id);
    setUpdatedEngineeringData({
      project_name: booking.project_name,
      project_type: booking.project_type,
      project_start_date: booking.project_start_date.split("T")[0], // Format date for input
      project_end_date: booking.project_end_date.split("T")[0],     // Format date for input
      project_description: booking.project_description || "",
      special_requests: booking.special_requests || "",
      price: booking.price || "", // Ensure price is set to an empty string if null
      status: booking.status || "Pending", // Default to Pending if undefined
    });
  };
  
  

  const handleEditContactClick = (contact) => {
    setCurrentEditingContact(contact.id);
    setUpdatedContactData({
      first_name: contact.first_name || "",
      last_name: contact.last_name || "",
      phone: contact.phone || "",
      email: contact.email || "",
      message: contact.message || "",
      status: contact.status || "",
      price: contact.price || "",
    });
  };
  
  const handleCancelEditContact = () => {
    setCurrentEditingContact(null);
    setUpdatedContactData({});
  };
  
  
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
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

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
  
  const [revenue, setRevenue] = useState({
    contact_monthly: Array(12).fill(0),
    engineering_monthly: Array(12).fill(0),
    performance_monthly: Array(12).fill(0),
  });
  const [bookings, setBookings] = useState({
    contacts: [],
    engineering_bookings: [],
    performance_bookings: [],
  });
  const handleDeleteBooking = async (type, id) => {
    try {
      console.log("Deleting booking...");
      const urlMap = {
        contacts: `https://portfoliobackend-ih6t.onrender.com/contacts/${id}`,
        engineering_bookings: `https://portfoliobackend-ih6t.onrender.com/engineering-bookings/${id}`,
        performance_bookings: `https://portfoliobackend-ih6t.onrender.com/performance-bookings/${id}`,
      };
  
      const url = urlMap[type];
      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to delete booking:", errorData);
        throw new Error(errorData.error || "Failed to delete booking");
      }
  
      setBookings((prev) => ({
        ...prev,
        [type]: prev[type].filter((booking) => booking.id !== id),
      }));
      console.log("Booking deleted successfully!");
    } catch (err) {
      console.error("Error during booking deletion:", err.message);
      setError(err.message);
    }
  };
  

  const [newPrices, setNewPrices] = useState({}); // Tracks all new prices
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const handlePriceChange = (type, id, value) => {
    setNewPrices((prev) => ({
      ...prev,
      [`${type}-${id}`]: value, // Unique key combining type and ID
    }));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contacts
        const contactsResponse = await fetch("https://portfoliobackend-ih6t.onrender.com/contacts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const contactsData = await contactsResponse.json();
        console.log("Contacts Data:", contactsData);
  
        // Fetch engineering bookings
        const engineeringResponse = await fetch("https://portfoliobackend-ih6t.onrender.com/engineering-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const engineeringData = await engineeringResponse.json();
        console.log("Engineering Bookings Data:", engineeringData);
  
        // Fetch performance bookings
        const performanceResponse = await fetch("https://portfoliobackend-ih6t.onrender.com/performance-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const performanceData = await performanceResponse.json();
        console.log("Performance Bookings Data:", performanceData);
  
        // Validate and set bookings data
        setBookings({
          contacts: Array.isArray(contactsData) ? contactsData : [],
          engineering_bookings: Array.isArray(engineeringData) ? engineeringData : [],
          performance_bookings: Array.isArray(performanceData) ? performanceData : [],
        });
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (token) fetchData();
  }, [token]);
  
  const lineData = useMemo(() => {
    const chart = chartRef.current?.canvas?.getContext("2d");
  
    // Dynamic gradient for "Contact Earnings"
    const gradientContact = chart
      ? chart.createLinearGradient(0, 0, 0, 300)
      : null;
    if (gradientContact) {
      gradientContact.addColorStop(0, "rgba(75, 192, 192, 0.5)");
      gradientContact.addColorStop(1, "rgba(75, 192, 192, 0)");
    }
  
    // Gradient for "Engineering Earnings"
    const gradientEngineering = chart
      ? chart.createLinearGradient(0, 0, 0, 300)
      : null;
    if (gradientEngineering) {
      gradientEngineering.addColorStop(0, "rgba(54, 162, 235, 0.5)");
      gradientEngineering.addColorStop(1, "rgba(54, 162, 235, 0)");
    }
  
    // Gradient for "Performance Earnings"
    const gradientPerformance = chart
      ? chart.createLinearGradient(0, 0, 0, 300)
      : null;
    if (gradientPerformance) {
      gradientPerformance.addColorStop(0, "rgba(255, 99, 132, 0.5)");
      gradientPerformance.addColorStop(1, "rgba(255, 99, 132, 0)");
    }
  
    return {
      labels: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      datasets: [
        {
          label: "Contact Earnings",
          data: revenue.contact_monthly,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: gradientContact || "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: "Engineering Earnings",
          data: revenue.engineering_monthly,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: gradientEngineering || "rgba(54, 162, 235, 0.2)",
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: "Performance Earnings",
          data: revenue.performance_monthly,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: gradientPerformance || "rgba(255, 99, 132, 0.2)",
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    };
  }, [revenue]);
  const lineOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false, // Allows dynamic resizing
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12 },
          boxWidth: 15, // Slightly larger legend boxes
          boxHeight: 15,
        },
      },
      tooltip: {
        backgroundColor: "red",
        titleFont: { size: 12, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 12,
      },
    },
    elements: {
      line: {
        borderWidth: 3, // Thicker lines
        borderCapStyle: "round", // Rounded ends for lines
      },
      point: {
        radius: 5, // Larger points
        hoverRadius: 7,
        backgroundColor: "black", // White center for visibility
        borderWidth: 2,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove x-axis grid lines
        },
        ticks: {
          font: { size: 11 },
          color: "#333",
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.4)", // Darker grid lines with less transparency
          borderDash: [6, 3], // Balanced dash pattern: 6px dash, 3px gap
          borderWidth: 1.5, // Slightly bolder lines for visibility
          drawBorder: false, // Removes solid axis border for a clean look
        },
        ticks: {
          font: { size: 11 },
          color: "#333",
          callback: (value) => `$${value}`, // Add $ prefix for y-axis values
        },
      },
    },
  }), []);
  

  // Fetch bookings and earnings data
  useEffect(() => {
    const fetchData = async () => {
        try {
          // Fetch all contact bookings
          const contactsResponse = await fetch("https://portfoliobackend-ih6t.onrender.com/contacts", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const contactsData = await contactsResponse.json();
      
          // Fetch all engineering bookings
          const engineeringResponse = await fetch("https://portfoliobackend-ih6t.onrender.com/engineering-bookings", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const engineeringData = await engineeringResponse.json();
      
          // Fetch all performance bookings
          const performanceResponse = await fetch("https://portfoliobackend-ih6t.onrender.com/performance-bookings", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const performanceData = await performanceResponse.json();
      
          // Fetch total earnings
          const earningsResponse = await fetch("https://portfoliobackend-ih6t.onrender.com/bookings/monthly-earnings", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const earningsData = await earningsResponse.json();
      
          // Set all data
          setBookings({
            contacts: contactsData,
            engineering_bookings: engineeringData,
            performance_bookings: performanceData,
          });
          setRevenue(earningsData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
      
    if (token) {
      fetchData();
    }
  }, [token]);

  const filteredBookings = useMemo(() => {
    const filterData = (data) =>
      data.filter((item) => {
        const nameMatch =
          searchParams.name === "" ||
          (item.client_name || `${item.first_name || ""} ${item.last_name || ""}`)
            .toLowerCase()
            .includes(searchParams.name.toLowerCase());
  
        const phoneMatch =
          searchParams.phone === "" ||
          item.client_phone?.includes(searchParams.phone) ||
          item.phone?.includes(searchParams.phone);
  
        const statusMatch =
          searchParams.status === "" || item.status === searchParams.status;
  
        return nameMatch && phoneMatch && statusMatch;
      });
  
    return {
      contacts: filterData(bookings.contacts),
      engineering_bookings: filterData(bookings.engineering_bookings),
      performance_bookings: filterData(bookings.performance_bookings),
    };
  }, [bookings, searchParams]);
  
  
  const handleStatusUpdate = async (type, id, newStatus, newPrice) => {
    try {
      console.log("Starting status update...");
      console.log("Type:", type);
      console.log("ID:", id);
      console.log("New Status:", newStatus);
      console.log("New Price:", newPrice); // Log new price for debugging
  
      const urlMap = {
        contacts: `https://portfoliobackend-ih6t.onrender.com/contacts/${id}`,
        performance_bookings: `https://portfoliobackend-ih6t.onrender.com/performance-bookings/${id}`,
        engineering_bookings: `https://portfoliobackend-ih6t.onrender.com/engineering-bookings/${id}`,
      };
  
      const stateMap = {
        contacts: "contacts",
        performance_bookings: "performance_bookings",
        engineering_bookings: "engineering_bookings",
      };
  
      const url = urlMap[type];
      const stateKey = stateMap[type];
  
      console.log("URL to PATCH:", url);
      console.log("State Key:", stateKey);
  
      // Prepare request body
      const requestBody = { status: newStatus };
      if (newPrice !== undefined && newPrice !== "") {
        requestBody.price = parseFloat(newPrice);
      }
      
      console.log("Request Body:", requestBody);
  
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      console.log("Response Status:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update status:", errorData);
        throw new Error(errorData.error || "Failed to update status");
      }
  
      const updatedData = await response.json();
      console.log("Server Response:", updatedData);
  
      // Update the local state
      setBookings((prev) => ({
        ...prev,
        [stateKey]: prev[stateKey].map((booking) =>
          booking.id === id
            ? { ...booking, status: newStatus, price: newPrice || booking.price }
            : booking
        ),
      }));
      console.log("Local state updated successfully!");
    } catch (err) {
      console.error("Error during status update:", err.message);
      setError(err.message);
    }
  };
  
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;





  
  return (
    <div className="p-6">
<div className="bg-white p-6 rounded-lg shadow-md">
  <h1 className="text-4xl sm:text-6xl lg:text-8xl text-center font-extrabold mb-6 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-md font-[Aspire]">
    Admin Dashboard
  </h1>
</div>


      <section className="mb-6">
  <Calendar token={token} />
</section>

      {/* Revenue Totals */}
      <div className="mb-6">



  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Contact Earnings */}
    <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-pink-300 to-pink-500 text-white">
      <h3 className="text-xl  font-semibold mb-2">Contact Earnings</h3>
      <p className="text-3xl font-bold">
        ${revenue.contact_monthly?.reduce((a, b) => a + b, 0) || 0}
      </p>
    </div>

    {/* Engineering Earnings */}
    <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-300 to-blue-500 text-white">
      <h3 className="text-xl font-semibold mb-2">Engineering Earnings</h3>
      <p className="text-3xl font-bold">
        ${revenue.engineering_monthly?.reduce((a, b) => a + b, 0) || 0}
      </p>
    </div>

    {/* Performance Earnings */}
    <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-yellow-300 to-yellow-500 text-white">
      <h3 className="text-xl font-semibold mb-2">Performance Earnings</h3>
      <p className="text-3xl font-bold">
        ${revenue.performance_monthly?.reduce((a, b) => a + b, 0) || 0}
      </p>
    </div>

    {/* Grand Total */}
    <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-400 to-green-600 text-white">
      <h3 className="text-xl font-semibold mb-2">Grand Total</h3>
      <p className="text-3xl font-bold">
        $
        {[
          ...(revenue.contact_monthly || []),
          ...(revenue.engineering_monthly || []),
          ...(revenue.performance_monthly || []),
        ].reduce((a, b) => a + b, 0) || 0}
      </p>
    </div>
  </div>
</div>

      {/* Line Chart */}
      <div
  style={{
    background: "linear-gradient(90deg, #ffb3c6, #ffd8b1, #fcf4a3, #b3e6b5, #b3d9ff, #e0b3ff)", // Pastel rainbow
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)", // Deeper shadow
    position: "relative",
    overflow: "hidden",
    color: "#333",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.02)";
    e.currentTarget.style.boxShadow = "0px 12px 24px rgba(0, 0, 0, 0.3)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.15)";
  }}
>
  {/* Subtle Pattern Overlay */}
  <div
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%25' height='100%25'%3E%3Ccircle cx='5' cy='5' r='5' fill='%23ffffff20' /%3E%3C/svg%3E\")",
    backgroundSize: "20px 20px",
    opacity: 0.6,
    pointerEvents: "none",
  }}
/>
  <h2 className="text-2xl font-semibold mb-4">Monthly Revenue Overview</h2>
  <div style={{ width: "100%", height: "300px" }}>
    <Line ref={chartRef} data={lineData} options={lineOptions} />
  </div>
</div>


      {/* Bookings Section */}
      <div>
{/* Search Inputs */}
<div className="mb-6 p-4 border rounded shadow">
  <h2 className="text-2xl font-semibold mb-2">Search Bookings</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <input
      type="text"
      name="name"
      placeholder="Search by Name"
      value={searchParams.name}
      onChange={handleInputChange}
      className="border p-2 rounded bg-black text-white w-full"
    />
    <input
      type="text"
      name="phone"
      placeholder="Search by Phone"
      value={searchParams.phone}
      onChange={handleInputChange}
      className="border p-2 rounded bg-black text-white w-full"
    />
    <select
      name="status"
      value={searchParams.status}
      onChange={handleInputChange}
      className="border p-2 rounded w-full"
    >
      <option value="">All Statuses</option>
      <option value="Pending">Pending</option>
      <option value="Booked">Booked</option>
      <option value="Booked & Paid">Booked & Paid</option>
      <option value="Completed">Completed</option>
    </select>
  </div>
</div>


        {/* Contacts */}
        <section className="mb-6">
  <h3 className="text-2xl font-medium mb-4">Contact Bookings</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
  {filteredBookings.contacts.map((contact) => (
  <div
    key={contact.id}
    style={{
      background: generateRandomGradient(), // Dynamic gradient
      color: "white", // Ensures text is readable
      borderRadius: "12px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "400px", // Consistent height
    }}
  >
    {/* Conditional Rendering: Edit Mode or Normal Mode */}
    {currentEditingContact === contact.id ? (
      <div className="space-y-2 overflow-y-auto  h-48 mb-4 pr-2">
        <input
          type="text"
          name="first_name"
          value={updatedContactData.first_name || contact.first_name}
          onChange={(e) =>
            setUpdatedContactData((prev) => ({
              ...prev,
              first_name: e.target.value,
            }))
          }
          placeholder="First Name"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="last_name"
          value={updatedContactData.last_name || contact.last_name}
          onChange={(e) =>
            setUpdatedContactData((prev) => ({
              ...prev,
              last_name: e.target.value,
            }))
          }
          placeholder="Last Name"
          className="border p-2 rounded w-full"
        />
<input
  type="text"
  name="phone"
  value={updatedContactData.phone || contact.phone}
  onChange={(e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Remove non-numeric characters
      const numericValue = value.replace(/\D/g, "");
      // Format the number as (999) 999-9999
      const formattedValue = numericValue
        .slice(0, 10)
        .replace(/(\d{3})(\d{3})(\d{1,4})/, (_, p1, p2, p3) => {
          return `(${p1}) ${p2}-${p3}`;
        });
      setUpdatedContactData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setUpdatedContactData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }}
  placeholder="Phone"
  className="border p-2 rounded w-full"
/>

        <input
          type="email"
          name="email"
          value={updatedContactData.email || contact.email}
          onChange={(e) =>
            setUpdatedContactData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          placeholder="Email"
          className="border p-2 rounded w-full"
        />
                <input
          type="message"
          name="message"
          value={updatedContactData.message || contact.message}
          onChange={(e) =>
            setUpdatedContactData((prev) => ({
              ...prev,
              message: e.target.value,
            }))
          }
          placeholder="message"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={() => handleUpdateContact(contact.id)}
          className="bg-green-500 text-white px-3 py-1 rounded mt-2 hover:bg-green-600"
        >
          Save
        </button>
        <button
          onClick={handleCancelEditContact}
          className="bg-gray-500 text-white px-3 py-1 rounded mt-2 hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    ) : (
      <div>
        {/* Booking Details */}
        <div className="space-y-2 overflow-y-auto text-black h-48 mb-4 pr-2">
          <p>
            <strong>Name:</strong> {contact.first_name || "No First Name"}{" "}
            {contact.last_name || "No Last Name"}
          </p>
          <p>
            <strong>Email:</strong> {contact.email || "No Email"}
          </p>
          <p>
            <strong>Phone:</strong> {contact.phone || "No Phone"}
          </p>
          <p>
            <strong>Message:</strong> {contact.message || "No Message"}
          </p>
          <p>
            <strong>Status:</strong> {contact.status}
          </p>
          <p>
            <strong>Price:</strong> ${contact.price || "N/A"}
          </p>
          <p>
            <strong>Created At:</strong> {formatDate(contact.created_at)}
          </p>
        </div>
        {/* Input and Status Controls */}
        <div className="flex flex-col gap-2 mt-auto">
          <input
            type="number"
            placeholder="Update Price"
            value={newPrices[`contacts-${contact.id}`] || contact.price || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              handlePriceChange("contacts", contact.id, newValue);
            }}
            className="border bg-black text-white p-2 rounded w-full"
          />
          <select
            value={contact.status}
            onChange={(e) =>
              handleStatusUpdate(
                "contacts",
                contact.id,
                e.target.value,
                newPrices[`contacts-${contact.id}`]
              )
            }
            className="border p-2 bg-black text-white rounded w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Booked">Booked</option>
            <option value="Booked & Paid">Booked & Paid</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button
          onClick={() => setCurrentEditingContact(contact.id)}
          className="bg-yellow-500 text-white px-3 py-1 rounded mt-2 hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteBooking("contacts", contact.id)}
          className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    )}
  </div>
))}

  </div>
</section>
<section className="mb-6">
  <h3 className="text-2xl font-medium mb-4">Engineering Bookings</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
    {filteredBookings.engineering_bookings.map((booking, index) => (
      <div
        key={`engineering-${booking.id}-${index}`} // Unique key with prefix and index
        style={{
          background: generateRandomGradient(), // Dynamic gradient
          color: "white", // Ensures readability
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "400px", // Adjusted for additional fields
        }}
      >
        {currentEditingEngineering === booking.id ? (
          <div className="space-y-2 overflow-y-auto  h-48 mb-4">
            <input
              type="text"
              name="project_name"
              value={updatedEngineeringData.project_name || booking.project_name}
              onChange={(e) =>
                setUpdatedEngineeringData((prev) => ({
                  ...prev,
                  project_name: e.target.value,
                }))
              }
              placeholder="Project Name"
              className="border p-2 rounded w-full"
            />
<select
  name="project_type"
  value={updatedEngineeringData.project_type || booking.project_type}
  onChange={(e) =>
    setUpdatedEngineeringData((prev) => ({
      ...prev,
      project_type: e.target.value,
    }))
  }
  className="w-full p-2 border rounded-xl bg-gray-800 text-white"
>
  <option value="">Select a Service Type</option>
  <option value="New Website">New Website</option>
  <option value="Dynamic Application">Dynamic Application</option>
  <option value="Enterprise Solution">Enterprise Solution</option>
</select>

            <textarea
              name="project_description"
              value={
                updatedEngineeringData.project_description || booking.project_description
              }
              onChange={(e) =>
                setUpdatedEngineeringData((prev) => ({
                  ...prev,
                  project_description: e.target.value,
                }))
              }
              placeholder="Project Description"
              className="border p-2 rounded w-full"
            />
            <textarea
              name="special_requests"
              value={
                updatedEngineeringData.special_requests || booking.special_requests
              }
              onChange={(e) =>
                setUpdatedEngineeringData((prev) => ({
                  ...prev,
                  special_requests: e.target.value,
                }))
              }
              placeholder="Special Requests"
              className="border p-2 rounded w-full"
            />
            <input
              type="date"
              name="project_start_date"
              value={
                updatedEngineeringData.project_start_date ||
                booking.project_start_date.split("T")[0]
              }
              onChange={(e) =>
                setUpdatedEngineeringData((prev) => ({
                  ...prev,
                  project_start_date: e.target.value,
                }))
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="date"
              name="project_end_date"
              value={
                updatedEngineeringData.project_end_date ||
                booking.project_end_date.split("T")[0]
              }
              onChange={(e) =>
                setUpdatedEngineeringData((prev) => ({
                  ...prev,
                  project_end_date: e.target.value,
                }))
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              name="price"
              value={updatedEngineeringData.price || booking.price || ""}
              onChange={(e) =>
                setUpdatedEngineeringData((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              placeholder="Price"
              className="border p-2 rounded w-full"
            />
            <select
              name="status"
              value={updatedEngineeringData.status || booking.status}
              onChange={(e) =>
                setUpdatedEngineeringData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="border p-2 rounded w-full"
            >
              <option value="Pending">Pending</option>
              <option value="Booked">Booked</option>
              <option value="Booked & Paid">Booked & Paid</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              onClick={() => handleUpdateEngineeringBooking(booking.id)}
              className="bg-green-500 text-white px-3 py-1 rounded mt-2 hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={handleCancelEditEngineering}
              className="bg-gray-500 text-white px-3 py-1 rounded mt-2 hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            {/* Booking Details */}
            <div className="space-y-2 overflow-y-auto text-black h-48 mb-4">
              <p>
                <strong>Client Name:</strong>{" "}
                {booking.contact?.first_name || "N/A"}{" "}
                {booking.contact?.last_name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {booking.contact?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {booking.contact?.phone || "N/A"}
              </p>
              <p>
                <strong>Project Name:</strong> {booking.project_name}
              </p>
              <p>
                <strong>Project Type:</strong> {booking.project_type}
              </p>
              <p>
                <strong>Start Date:</strong> {formatDate(booking.project_start_date)}
              </p>
              <p>
                <strong>End Date:</strong> {formatDate(booking.project_end_date)}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {booking.project_description || "N/A"}
              </p>
              <p>
                <strong>Special Requests:</strong>{" "}
                {booking.special_requests || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              <p>
                <strong>Price:</strong> ${booking.price || "N/A"}
              </p>
              <p>
                <strong>Created At:</strong> {formatDate(booking.created_at)}
              </p>
            </div>

            {/* Input and Status Controls */}
            <div className="flex flex-col gap-2 mt-auto">
              <input
                type="number"
                placeholder="Update Price"
                value={
                  newPrices[`engineering_bookings-${booking.id}`] ||
                  booking.price ||
                  ""
                }
                onChange={(e) => {
                  const newValue = e.target.value;
                  handlePriceChange("engineering_bookings", booking.id, newValue);
                }}
                className="border p-2 bg-black text-white rounded w-full"
              />
              <select
                value={booking.status}
                onChange={(e) =>
                  handleStatusUpdate(
                    "engineering_bookings",
                    booking.id,
                    e.target.value,
                    newPrices[`engineering_bookings-${booking.id}`]
                  )
                }
                className="border p-2 bg-black text-white rounded w-full"
              >
                <option value="Pending">Pending</option>
                <option value="Booked">Booked</option>
                <option value="Booked & Paid">Booked & Paid</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button
              onClick={() => handleEditEngineeringClick(booking)}
              className="bg-yellow-500 text-white px-3 py-1 rounded mt-2 hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() =>
                handleDeleteBooking("engineering_bookings", booking.id)
              }
              className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
</section>




 {/* Performance Bookings */}
<section className="mb-6">
  <h3 className="text-2xl font-medium mb-4">Performance Bookings</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
    {filteredBookings.performance_bookings.map((booking, index) => (
      <div
        key={`performance-${booking.id}-${index}`} // Unique key with prefix and index
        style={{
          background: generateRandomGradient(), // Dynamic gradient
          color: "white", // Ensures readability
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "400px", // Adjusted for additional fields
        }}
      >
        {currentEditingPerformance === booking.id ? (
          <div className="space-y-2 overflow-y-auto h-48 mb-4">

            <input
              type="text"
              name="eventName"
              value={updatedPerformanceData.eventName || booking.event_name}
              onChange={(e) =>
                setUpdatedPerformanceData((prev) => ({
                  ...prev,
                  eventName: e.target.value,
                }))
              }
              placeholder="Event Name"
              className="border p-2 rounded w-full"
            />
            <select
              name="eventType"
              value={updatedPerformanceData.eventType || booking.event_type}
              onChange={(e) =>
                setUpdatedPerformanceData((prev) => ({
                  ...prev,
                  eventType: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-xl bg-gray-800 text-white"
            >
              <option value="">Select an Event Type</option>
              <option value="Karaoke">Karaoke</option>
              <option value="DJ Services">DJ Services</option>
              <option value="Live Song Performances">Live Song Performances</option>
            </select>
            <textarea
              name="specialRequests"
              value={updatedPerformanceData.specialRequests || booking.special_requests}
              onChange={(e) =>
                setUpdatedPerformanceData((prev) => ({
                  ...prev,
                  specialRequests: e.target.value,
                }))
              }
              placeholder="Special Requests"
              className="border p-2 rounded w-full"
            />
            <input
              type="datetime-local"
              name="eventDateTime"
              value={
                updatedPerformanceData.eventDateTime || booking.event_date_time
              }
              onChange={(e) =>
                setUpdatedPerformanceData((prev) => ({
                  ...prev,
                  eventDateTime: e.target.value,
                }))
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              name="price"
              value={updatedPerformanceData.price || booking.price || ""}
              onChange={(e) =>
                setUpdatedPerformanceData((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              placeholder="Price"
              className="border p-2 rounded w-full"
            />
            <select
              name="status"
              value={updatedPerformanceData.status || booking.status}
              onChange={(e) =>
                setUpdatedPerformanceData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="border p-2 rounded w-full"
            >
              <option value="Pending">Pending</option>
              <option value="Booked">Booked</option>
              <option value="Booked & Paid">Booked & Paid</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              onClick={() => handleUpdatePerformanceBooking(booking.id)}
              className="bg-green-500 text-white px-3 py-1 rounded mt-2 hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={handleCancelEditPerformance}
              className="bg-gray-500 text-white px-3 py-1 rounded mt-2 hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            {/* Booking Details */}
            <div className="space-y-2 overflow-y-auto text-black h-48 mb-4">
              <p>
                <strong>Contact:</strong>{" "}
                {booking.contact?.first_name || "N/A"}{" "}
                {booking.contact?.last_name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {booking.contact?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {booking.contact?.phone || "N/A"}
              </p>
              <p>
                <strong>Event Name:</strong> {booking.event_name}
              </p>
              <p>
                <strong>Event Type:</strong> {booking.event_type}
              </p>
              <p>
              <strong>Date & Time:</strong> {formatDate(booking.event_date_time)}
              </p>
              <p>
                <strong>Location:</strong> {booking.location}
              </p>
              <p>
                <strong>Guests:</strong> {booking.guests || "N/A"}
              </p>
              <p>
                <strong>Special Requests:</strong>{" "}
                {booking.special_requests || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              <p>
                <strong>Price:</strong> ${booking.price || "N/A"}
              </p>
              <p>
                <strong>Created At:</strong> {formatDate(booking.created_at)}
              </p>
            </div>

            {/* Input and Status Controls */}
            <div className="flex flex-col gap-2 mt-auto">
              <input
                type="number"
                placeholder="Update Price"
                value={
                  newPrices[`performance_bookings-${booking.id}`] ||
                  booking.price ||
                  ""
                }
                onChange={(e) => {
                  const newValue = e.target.value;
                  handlePriceChange("performance_bookings", booking.id, newValue);
                }}
                className="border p-2 bg-black text-white rounded w-full"
              />
              <select
                value={booking.status}
                onChange={(e) =>
                  handleStatusUpdate(
                    "performance_bookings",
                    booking.id,
                    e.target.value,
                    newPrices[`performance_bookings-${booking.id}`]
                  )
                }
                className="border p-2 bg-black text-white rounded w-full"
              >
                <option value="Pending">Pending</option>
                <option value="Booked">Booked</option>
                <option value="Booked & Paid">Booked & Paid</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button
              onClick={() => handleEditPerformanceClick(booking)}
              className="bg-yellow-500 text-white px-3 py-1 rounded mt-2 hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() =>
                handleDeleteBooking("performance_bookings", booking.id)
              }
              className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
</section>

<section className="mb-6">
  <h3 className="text-2xl font-medium mb-4">Pending Reviews</h3>
  {reviewsError && <p className="text-red-500">{reviewsError}</p>}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
    {pendingReviews.length === 0 ? (
      <p>No pending reviews found.</p>
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


      </div>
      
    </div>
  );
}
