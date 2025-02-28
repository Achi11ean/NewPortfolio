import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
export default function IncomeOverview() {
  const [incomeData, setIncomeData] = useState([]);
  const [groupedIncome, setGroupedIncome] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [editingIncome, setEditingIncome] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [newCompany, setNewCompany] = useState(""); // Track user-entered company
  const [taxBreakdown, setTaxBreakdown] = useState(null); // Store tax results
  const [enteredAmount, setEnteredAmount] = useState(""); // Track entered amount for tax calculation
  const [totalTaxes, setTotalTaxes] = useState(0); // New state for total taxes
  const [showForm, setShowForm] = useState(false); // ✅ Track form visibility

  const calculateTaxes = () => {
    const amount = parseFloat(newIncome.amount); // Ensure using newIncome.amount

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid income amount.");
      return;
    }

    const selfEmploymentTax = amount * 0.153; // 15.3% Self-Employment Tax
    const selfEmploymentDeduction = selfEmploymentTax / 2;
    const taxableIncome = amount - selfEmploymentDeduction;

    const federalTax = taxableIncome * 0.12; // Assuming 12% Federal Tax Bracket
    const stateTax = taxableIncome * 0.03; // 3% Connecticut State Tax
    const totalTax = selfEmploymentTax + federalTax + stateTax;

    const formattedTotalTax = totalTax.toFixed(2); // Format total tax

    setTaxBreakdown({
      selfEmploymentTax: selfEmploymentTax.toFixed(2),
      federalTax: federalTax.toFixed(2),
      stateTax: stateTax.toFixed(2),
      totalTax: formattedTotalTax,
    });

    // ✅ Ensure taxes update correctly
    setNewIncome((prev) => ({
      ...prev,
      taxes: formattedTotalTax, // Store total taxes owed
    }));

    toast.success("Tax calculation applied!");
  };

  useEffect(() => {
    fetchIncomeData();
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(
        "https://portfoliobackend-ih6t.onrender.com/karaoke_hosting"
      );
      setCompanyData(response.data);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const [editFormData, setEditFormData] = useState({
    income_name: "",
    amount: "",
    date: "",
    taxes: "",
  });

  const handleEditClick = (income) => {
    console.log("Editing income object:", income); // Debugging log

    setEditingIncome(income.id || null); // ✅ Only set if it's an existing record

    setEditFormData({
      income_name: income.income_name || "", // ✅ Use correct field name
      amount: income.amount || "",
      date: income.date || "",
      taxes: income.taxes || "",
    });
};

  
  const handleUpdateIncome = async () => {
    console.log("Attempting to update income with ID:", editingIncome); // Debugging log
  
    if (!editFormData.income_name || !editFormData.amount || !editFormData.date) {
      toast.error("Please fill out all required fields.");
      return;
    }
  
    try {
      const endpoint = editingIncome
        ? `https://portfoliobackend-ih6t.onrender.com/income/${editingIncome}`
        : `https://portfoliobackend-ih6t.onrender.com/income`; // ✅ Allow PATCH without an ID
  
      const response = await axios.patch(endpoint, {
        income_name: editFormData.income_name,
        amount: parseInt(editFormData.amount, 10),
        date: editFormData.date,
        taxes: editFormData.taxes ? parseInt(editFormData.taxes, 10) : null,
      });
  
      console.log("Update response:", response.data); // Debugging log
      toast.success(
        editingIncome
          ? "Income updated successfully!"
          : "New income record created!"
      );
  
      setEditingIncome(null);
      setEditFormData({ income_name: "", amount: "", date: "", taxes: "" });
      fetchIncomeData(); // Refresh income list
    } catch (error) {
      console.error(
        "Failed to update income:",
        error.response?.data || error.message
      );
      toast.error("Failed to update income.");
    }
  };
  

  const handleDeleteIncome = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income record?"))
      return;

    try {
      await axios.delete(
        `https://portfoliobackend-ih6t.onrender.com/income/${id}`
      );
      toast.success("Income deleted successfully!");
      fetchIncomeData(); // Refresh income list
    } catch (error) {
      toast.error("Failed to delete income.");
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    console.log("Submitting form. Editing Income:", editingIncome); // Debugging log

    if (editingIncome === null) {
      console.log("Calling handleAddIncome()...");
      await handleAddIncome();
    } else {
      console.log("Calling handleUpdateIncome()...");
      await handleUpdateIncome();
    }
};


  const [newIncome, setNewIncome] = useState({
    income_name: "",
    amount: "",
    date: "",
    taxes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (editingIncome) {
      // Update edit form data when editing
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      // Update new income form when adding a new record
      setNewIncome((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddIncome = async () => {
    if (!newIncome.income_name || !newIncome.amount || !newIncome.date) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://portfoliobackend-ih6t.onrender.com/income",
        {
          income_name: newIncome.income_name,
          amount: parseInt(newIncome.amount, 10), // Convert amount to integer
          date: newIncome.date, // Ensure it's in "YYYY-MM-DD" format
          taxes: newIncome.taxes ? parseInt(newIncome.taxes, 10) : null, // Convert taxes to integer if present
        }
      );

      toast.success("Income added successfully!");
      setNewIncome({ income_name: "", amount: "", date: "", taxes: "" }); // Reset form
      fetchIncomeData(); // Refresh income list
    } catch (error) {
      toast.error("Failed to add income.");
    }
  };

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const fetchIncomeData = async () => {
    try {
      const response = await axios.get(
        "https://portfoliobackend-ih6t.onrender.com/income/aggregate"
      );
  
      console.log("Fetched income data response:", response.data); // ✅ Debugging log
  
      if (!response.data || !Array.isArray(response.data.income_details)) {
        console.error("Unexpected data format:", response.data);
        toast.error("Unexpected data format from server.");
        return;
      }
  
      // ✅ Ensure `date` is always in correct format and `null` dates are replaced with an empty string
      const updatedIncomeDetails = response.data.income_details.map((item) => ({
        ...item,
        date: item.date ? item.date : "", // Convert null/undefined dates to empty string for the input field
        amount: parseFloat(item.amount) || 0, // Ensure `amount` is always a valid number
        taxes: item.taxes !== null && item.taxes !== undefined ? parseFloat(item.taxes).toFixed(2) : null, // Ensure valid tax values
      }));
  
      // ✅ Apply tax calculations if taxes are missing for Engineering Bookings
      const incomeWithTaxes = updatedIncomeDetails.map((item) => {
        if (item.source === "Engineering Booking" && (!item.taxes || item.taxes === null)) {
          let storedPrice = item.amount || 0;
  
          const selfEmploymentTax = storedPrice * 0.153; // 15.3% Self-Employment Tax
          const selfEmploymentDeduction = selfEmploymentTax / 2;
          const taxableIncome = storedPrice - selfEmploymentDeduction;
  
          const federalTax = taxableIncome * 0.12; // 12% Federal Tax
          const stateTax = taxableIncome * 0.03; // 3% State Tax
          const totalTax = selfEmploymentTax + federalTax + stateTax;
  
          return {
            ...item,
            taxes: totalTax.toFixed(2), // ✅ Store calculated tax
            taxBreakdown: {
              selfEmploymentTax: selfEmploymentTax.toFixed(2),
              federalTax: federalTax.toFixed(2),
              stateTax: stateTax.toFixed(2),
              totalTax: totalTax.toFixed(2),
            },
          };
        }
        return item; // Keep other items unchanged
      });
  
      // ✅ Sort income records by date from newest to oldest
      const sortedIncome = incomeWithTaxes.sort((a, b) => new Date(b.date) - new Date(a.date));
  
      setIncomeData(sortedIncome);
  
      // ✅ Group income by source
      const grouped = sortedIncome.reduce((acc, curr) => {
        const source = curr.source || "Unknown Source";
        acc[source] = (acc[source] || 0) + curr.amount; // Sum amounts for each source
        return acc;
      }, {});
  
      setGroupedIncome(grouped);
  
      // ✅ Calculate total income
      const total = sortedIncome.reduce((sum, item) => sum + item.amount, 0);
      setTotalIncome(total);
  
      // ✅ Calculate total taxes (including dynamically applied ones)
      const totalTaxAmount = sortedIncome.reduce(
        (sum, item) => sum + (parseFloat(item.taxes) || 0),
        0
      );
      setTotalTaxes(totalTaxAmount);
    } catch (error) {
      console.error("Error fetching income data:", error);
      toast.error("Failed to fetch income data.");
    }
  };
  
  
  return (
    <div className="p-4 bg-black rounded-3xl border-white border-2 mt-3">
      <h2 className="text-xl pb-1  sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-6 text-gray-800 bg-gradient-to-r from-yellow-500 via-green-700 to-green-500 text-transparent bg-clip-text drop-shadow-lg animate-fade-in">
        💲 Income Manager 💲
      </h2>
      <div className="w-full h-3 bg-gradient-to-r from-green-500 via-green-500 via-red-500  via-green-500 to-green-500 rounded-full shadow-lg my-6"></div>{" "}
      {/* Manual Income Entry */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white px-6 py-3 font-bold rounded-xl shadow-lg hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
        >
          {showForm ? "➖ Hide Income Form" : "➕ Show Income Form"}
        </button>
      </div>
      {showForm && (
  <div className="mt-6 p-6 bg-gradient-to-r from-green-800 via-green-500 to-green-800 rounded-2xl shadow-md">
    <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
      ➕ Add New Income
    </h3>

    {/* ✅ Add form element and bind handleSubmit */}
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <select
        className="p-3 border bg-gray-800 text-white font-bold rounded-lg w-full"
        value={selectedCompany}
        onChange={(e) => {
          setSelectedCompany(e.target.value);
          setNewIncome((prev) => ({
            ...prev,
            income_name: e.target.value,
            amount: companyData.find((c) => c.company_name === e.target.value)
              ?.payment_amount || "",
          }));
        }}
      >
        <option value="">-- Select a Company --</option>
        {companyData.map((company, index) => (
          <option key={index} value={company.company_name}>
            {company.company_name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="new_company"
        placeholder="Or Enter a New Company Name"
        value={newCompany}
        onChange={(e) => {
          setNewCompany(e.target.value);
          setSelectedCompany("");
          setNewIncome((prev) => ({
            ...prev,
            income_name: e.target.value,
          }));
        }}
        className="p-3 border bg-gray-800 font-bold rounded-lg w-full"
      />

      <input
        type="number"
        name="amount"
        placeholder="Amount ($)"
        value={newIncome.amount}
        onChange={handleInputChange}
        className="p-3 border bg-gray-800 text-white font-bold rounded-lg w-full"
      />

      <input
        type="date"
        name="date"
        value={newIncome.date || ""}
        onChange={handleInputChange}
        className="p-2 border font-bold bg-gray-800 text-center rounded w-full mb-2"
      />

      <input
        type="number"
        name="taxes"
        placeholder="Taxes (Optional)"
        value={newIncome.taxes || ""}
        onChange={handleInputChange}
        className="p-3 border bg-gray-800 text-white font-bold rounded-lg w-full"
      />

      <button
        type="button"
        onClick={calculateTaxes}
        className="bg-red-500 text-black font-serif text-xl font-bold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        💰 Apply Taxes
      </button>

      {/* ✅ Change the button to type="submit" */}
      <button
        type="submit" 
        className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        💾 Save Income
      </button>

    </form>
  </div>
)}

      <h2 className="md:text-4xl text-2xl font-extrabold mb-6 text-center text-white underline">
        💰 Income Overview 💰
      </h2>
      <div className="flex flex-wrap justify-center gap-6 mx-auto mt-8">
        {/* Overall Total Income */}
        {/* Total Income */}
        <div className="p-2 mb-2 bg-gradient-to-br from-green-400 via-emerald-500 to-green-700 rounded-3xl shadow-2xl text-center w-[40%] transform transition-all duration-300 hover:scale-105 hover:shadow-green-500/50">
          <h3 className="text-md md:text-3xl font-extrabold text-white drop-shadow-lg">
            💵 <br /> <span className="underline">Total Income</span>
          </h3>
          <p className="md:text-3xl text-xl font-semibold text-white  drop-shadow-lg">
            ${totalIncome.toFixed(2)}
          </p>
        </div>

        {/* Taxes Owed */}
        <div className="p-2 mb-2 bg-gradient-to-br from-red-400 via-rose-500 to-red-700 rounded-3xl shadow-2xl text-center w-[40%] transform transition-all duration-300 hover:scale-105 hover:shadow-red-500/50">
          <h3 className="text-md md:text-3xl font-extrabold text-white drop-shadow-lg">
            🏛️ <br />
            <span className="underline">Taxes Owed</span>
          </h3>
          <p className="md:text-3xl text-xl font-semibold text-white  drop-shadow-lg">
            ${totalTaxes.toFixed(2)}
          </p>
        </div>
      </div>
      {/* Income Group Totals */}
      <div className="relative p-6 bg-gradient-to-br from-gray-200 to-gray-800 rounded-3xl shadow-2xl">
        <h2 className="text-xl md:text-3xl font-extrabold text-white text-center mb-4">
          💰 Income Breakdown
        </h2>

        {/* Scrollable container */}
        <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {Object.entries(groupedIncome).map(([source, amount], index) => (
              <div
                key={index}
                className="pt-2 pb-2 rounded-2xl bg-gradient-to-b from-green-900 via-black to-green-900 shadow-xl text-center transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/50"
              >
                <h3 className="text-2xl font-bold text-white drop-shadow-md">
                  {source}
                </h3>
                <p className="text-3xl font-extrabold text-white mt-2 drop-shadow-lg">
                  ${amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Individual Income Records */}
      <div
        className="max-h-[450px] overflow-y-auto p-6 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 rounded-3xl shadow-2xl border border-indigo-700 mt-6 text-white custom-scrollbar"
      >
        {incomeData.length === 0 ? (
          <p className="text-lg text-gray-300 text-center font-medium">
            No income records found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {incomeData.map((item, index) => (
              <div
                key={index}
                className="relative p-4 bg-white rounded-2xl shadow-lg border border-gray-300 transition-all hover:shadow-xl hover:scale-[1.03] flex flex-col items-center"
              >
                {editingIncome === item.id ? (
                  <div className="space-y-3 w-full">
                    <label className="text-black font-bold text-center underline item-center justify-center">Income Source</label>
                    <input
                      type="text"
                      name="income_name"
                      value={editFormData.income_name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          income_name: e.target.value,
                        })
                      }
                      className="p-2 border border-gray-400 font-semibold bg-purple-400/40  text-black text-center rounded-xl w-full focus:ring-2 focus:ring-indigo-400"
                    />
                                        <label className="text-black font-bold text-center underline item-center justify-center">Income Amount</label>

                    <input
                      type="number"
                      name="amount"
                      value={editFormData.amount}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          amount: e.target.value,
                        })
                      }
                      className="p-2 border border-gray-400 font-semibold bg-purple-400/40  text-black text-center rounded-xl w-full focus:ring-2 focus:ring-indigo-400"
                    />
                                        <label className="text-black font-bold text-center underline item-center justify-center">Income Date</label>

                    <input
                      type="date"
                      name="date"
                      value={editFormData.date}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, date: e.target.value })
                      }
                      className="p-2 border border-gray-400 font-semibold bg-purple-400/40  text-black text-center rounded-xl w-full focus:ring-2 focus:ring-indigo-400"
                    />
                                        <label className="text-black font-bold text-center underline item-center justify-center">Taxes Due</label>

                    <input
                      type="number"
                      name="taxes"
                      placeholder="Taxes (Optional)"
                      value={editFormData.taxes || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          taxes: e.target.value,
                        })
                      }
                      className="p-2 border border-gray-400 font-semibold bg-purple-400/40  text-black text-center rounded-xl w-full focus:ring-2 focus:ring-indigo-400"
                    />
                    <div className="flex justify-between mt-3">
                      <button
                        onClick={handleUpdateIncome}
                        className="bg-green-500 text-white py-2 px-4 rounded-xl shadow-md hover:bg-green-600 transition hover:scale-105"
                      >
                        ✅ Save
                      </button>
                      <button
                        onClick={() => setEditingIncome(null)}
                        className="bg-gray-500 text-white py-2 px-4 rounded-xl shadow-md hover:bg-gray-600 transition hover:scale-105"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-black text-center">
                      {item.name}
                    </h3>
                    <p className="text-md font-bold text-black">
                      <span className="font-semibold">Source:</span> {item.source}
                    </p>
                    <p className="text-md font-bold text-black">
                      <span className="font-semibold">Amount:</span> $
                      {item.amount.toFixed(2)}
                    </p>
                    <p className="text-md font-bold text-black">
                      <span className="font-semibold">Taxes:</span> $
                      {item.taxes ? item.taxes : "N/A"}
                    </p>
                    <p className="text-md font-bold text-black">
                      <span className="font-semibold">Date:</span> {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                    </p>
{/* Hide Edit & Delete Buttons for Engineering and General Inquiry sources */}
{!(item.source === "Engineering Booking" || item.source === "General Inquiry") && (
  <div className="mt-3 flex gap-3">
    <button
      onClick={() => handleEditClick(item)}
      className="bg-yellow-500 text-white px-3 py-1 rounded-full shadow-md hover:bg-yellow-600 transition hover:scale-105"
    >
      ✏️
    </button>
    <button
      onClick={() => handleDeleteIncome(item.id)}
      className="bg-red-500 text-white px-3 py-1 rounded-full shadow-md hover:bg-red-600 transition hover:scale-105"
    >
      🗑️
    </button>
  </div>
)}

                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overall Total Income */}
    </div>
  );
}
