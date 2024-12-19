import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "./AuthContext";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";


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
  const [searchParams, setSearchParams] = useState({
    name: "",
    phone: "",
    status: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
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
        const contactsResponse = await fetch("https://portfoliobackend-ih6t.onrender.com/contacts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const engineeringResponse = await fetch("https://portfoliobackend-ih6t.onrender.com/engineering-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const performanceResponse = await fetch("https://portfoliobackend-ih6t.onrender.com/performance-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contactsData = await contactsResponse.json();
        const engineeringData = await engineeringResponse.json();
        const performanceData = await performanceResponse.json();

        setBookings({
          contacts: contactsData,
          engineering_bookings: engineeringData,
          performance_bookings: performanceData,
        });
      } catch (err) {
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
      <h1 className="text-3xl text-center font-bold mb-4">Admin Dashboard</h1>

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
      className="border p-2 rounded w-full"
    />
    <input
      type="text"
      name="phone"
      placeholder="Search by Phone"
      value={searchParams.phone}
      onChange={handleInputChange}
      className="border p-2 rounded w-full"
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
    height: "320px", // Consistent height
  }}
>

        {/* Booking Details with Scroll */}
        <div className="space-y-2 overflow-y-auto text-black h-40 mb-4 pr-2">
          <p>
            <strong>Name:</strong> {contact.first_name || "No First Name"} {contact.last_name || "No Last Name"}
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
            className="border p-2 rounded w-full"
          />
          <select
            value={contact.status}
            onChange={(e) =>
              handleStatusUpdate("contacts", contact.id, e.target.value, newPrices[`contacts-${contact.id}`])
            }
            className="border p-2 rounded w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Booked">Booked</option>
            <option value="Booked & Paid">Booked & Paid</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button
  onClick={() => handleDeleteBooking("contacts", contact.id)}
  className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-700"
>
  Delete
</button>

      </div>
    ))}
  </div>
</section>


{/* Engineering Bookings */}
<section className="mb-6">
  <h3 className="text-2xl font-medium mb-4">Engineering Bookings</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
  {filteredBookings.engineering_bookings.map((booking) => (
  <div
  key={booking.id}
  style={{
    background: generateRandomGradient(), // Dynamic gradient
    color: "white", // Ensures readability
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "320px", // Consistent height for all cards
  }}
>
        {/* Booking Details */}
        <div className="space-y-2 overflow-y-auto text-black h-40 mb-4">
          <p><strong>Client Name:</strong> {booking.client_name}</p>
          <p><strong>Email:</strong> {booking.client_email}</p>
          <p><strong>Phone:</strong> {booking.client_phone || "N/A"}</p>
          <p><strong>Project Name:</strong> {booking.project_name}</p>
          <p><strong>Project Manager:</strong> {booking.project_manager || "N/A"}</p>
          <p><strong>Project Type:</strong> {booking.project_type}</p>
          <p><strong>Start Date:</strong> {booking.project_start_date}</p>
          <p><strong>End Date:</strong> {booking.project_end_date}</p>
          <p><strong>Description:</strong> {booking.project_description || "N/A"}</p>
          <p><strong>Special Requests:</strong> {booking.special_requests || "N/A"}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Price:</strong> ${booking.price || "N/A"}</p>
          <p><strong>Created At:</strong> {booking.created_at}</p>
        </div>

        {/* Input and Status Controls */}
        <div className="flex flex-col gap-2 mt-auto">
          <input
            type="number"
            placeholder="Update Price"
            value={newPrices[`engineering_bookings-${booking.id}`] || booking.price || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              handlePriceChange("engineering_bookings", booking.id, newValue);
            }}
            className="border p-2 rounded w-full"
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
            className="border p-2 rounded w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Booked">Booked</option>
            <option value="Booked & Paid">Booked & Paid</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button
  onClick={() => handleDeleteBooking("engineering_bookings", booking.id)}
  className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-700"
>
  Delete
</button>

      </div>
    ))}
  </div>
</section>


        {/* Performance Bookings */}
{/* Performance Bookings */}
<section className="mb-6">
  <h3 className="text-2xl font-medium mb-4">Performance Bookings</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
  {filteredBookings.performance_bookings.map((booking) => (
        <div
  key={booking.id}
  style={{
    background: generateRandomGradient(), // Dynamic gradient background
    color: "white", // Ensures text remains readable
    borderRadius: "12px", // Rounded corners
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "320px", // Consistent card height
  }}
>
        {/* Booking Details with Scroll */}
        <div className="space-y-2 text-black overflow-y-auto h-40 mb-4">
          <p><strong>Client Name:</strong> {booking.client_name}</p>
          <p><strong>Email:</strong> {booking.client_email}</p>
          <p><strong>Phone:</strong> {booking.client_phone || "N/A"}</p>
          <p><strong>Event Name:</strong> {booking.event_name}</p>
          <p><strong>Event Type:</strong> {booking.event_type}</p>
          <p><strong>Date & Time:</strong> {booking.event_date_time}</p>
          <p><strong>Location:</strong> {booking.location}</p>
          <p><strong>Guests:</strong> {booking.guests || "N/A"}</p>
          <p><strong>Special Requests:</strong> {booking.special_requests || "N/A"}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Price:</strong> ${booking.price || "N/A"}</p>
          <p><strong>Created At:</strong> {booking.created_at}</p>
        </div>

        {/* Input and Status Controls */}
        <div className="flex flex-col gap-2 mt-auto">
          <input
            type="number"
            placeholder="Update Price"
            value={newPrices[`performance_bookings-${booking.id}`] || booking.price_range || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              handlePriceChange("performance_bookings", booking.id, newValue);
            }}
            className="border p-2 rounded w-full"
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
            className="border p-2 rounded w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Booked">Booked</option>
            <option value="Booked & Paid">Booked & Paid</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button
  onClick={() => handleDeleteBooking("performance_bookings", booking.id)}
  className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-700"
>
  Delete
</button>

      </div>
    ))}
  </div>
</section>

      </div>
      
    </div>
  );
}
