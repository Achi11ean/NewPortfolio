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
    const response = await axios.get("https://portfoliobackend-ih6t.onrender.com/karaoke_hosting");
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
    setEditingIncome(income.id);
    setEditFormData({
      income_name: income.name,
      amount: income.amount,
      date: income.date,
      taxes: income.taxes || "", // Handle null taxes
    });
  };
  const handleUpdateIncome = async () => {
    if (!editFormData.income_name || !editFormData.amount || !editFormData.date) {
      toast.error("Please fill out all required fields.");
      return;
    }
  
    try {
      await axios.patch(`https://portfoliobackend-ih6t.onrender.com/income/${editingIncome}`, {
        income_name: editFormData.income_name,
        amount: parseInt(editFormData.amount, 10),
        date: editFormData.date,
        taxes: editFormData.taxes ? parseInt(editFormData.taxes, 10) : null,
      });
  
      toast.success("Income updated successfully!");
      setEditingIncome(null);
      setEditFormData({ income_name: "", amount: "", date: "", taxes: "" });
      fetchIncomeData(); // Refresh income list
    } catch (error) {
      toast.error("Failed to update income.");
    }
  };
  const handleDeleteIncome = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income record?")) return;
  
    try {
      await axios.delete(`https://portfoliobackend-ih6t.onrender.com/income/${id}`);
      toast.success("Income deleted successfully!");
      fetchIncomeData(); // Refresh income list
    } catch (error) {
      toast.error("Failed to delete income.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    if (editingIncome) {
      // If we are editing an existing income record
      await handleUpdateIncome();
    } else {
      // If we are adding a new income record
      await handleAddIncome();
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
      const response = await axios.post("https://portfoliobackend-ih6t.onrender.com/income", {
        income_name: newIncome.income_name,
        amount: parseInt(newIncome.amount, 10), // Convert amount to integer
        date: newIncome.date, // Ensure it's in "YYYY-MM-DD" format
        taxes: newIncome.taxes ? parseInt(newIncome.taxes, 10) : null, // Convert taxes to integer if present
      });
  
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
        const response = await axios.get("https://portfoliobackend-ih6t.onrender.com/income/aggregate");
  
        console.log("Fetched income data response:", response.data); // ✅ Debugging log
  
        if (!response.data || !Array.isArray(response.data.income_details)) {
            console.error("Unexpected data format:", response.data);
            toast.error("Unexpected data format from server.");
            return;
        }
  
        // ✅ Apply tax calculations to engineering bookings if taxes are missing
        const updatedIncomeDetails = response.data.income_details.map((item) => {
            if (item.source === "Engineering Booking") {
                let storedPrice = item.price || item.amount || 0; // Use price, fallback to amount if missing

                if (!item.taxes || item.taxes === null || item.taxes === undefined) {
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
            }
            return item; // Keep other items unchanged
        });

        setIncomeData(updatedIncomeDetails);

        // ✅ Group income by source
        const grouped = updatedIncomeDetails.reduce((acc, curr) => {
            const source = curr.source || curr.name || "Unknown Source";
            acc[source] = (acc[source] || 0) + (curr.price || curr.amount || 0); // Use price first
            return acc;
        }, {});

        setGroupedIncome(grouped);

        // ✅ Calculate total income
        const total = updatedIncomeDetails.reduce((sum, item) => sum + (item.price || item.amount || 0), 0);
        setTotalIncome(total);

        // ✅ Calculate total taxes (including dynamically applied ones)
        const totalTaxAmount = updatedIncomeDetails.reduce((sum, item) => sum + (parseFloat(item.taxes) || 0), 0);
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
<div className="w-full h-3 bg-gradient-to-r from-green-500 via-green-500 via-red-500  via-green-500 to-green-500 rounded-full shadow-lg my-6"></div>      {/* Manual Income Entry */}
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
  
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <select
    className="p-3 border bg-gray-800 text-white font-bold rounded-lg w-full"
    value={selectedCompany}
    onChange={(e) => {
      setSelectedCompany(e.target.value);
      setNewIncome((prev) => ({
        ...prev,
        income_name: e.target.value,
        amount: companyData.find(c => c.company_name === e.target.value)?.payment_amount || "",
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

  {/* OR Enter a New Company Name */}
  <input
    type="text"
    name="new_company"
    placeholder="Or Enter a New Company Name"
    value={newCompany}
    onChange={(e) => {
      setNewCompany(e.target.value);
      setSelectedCompany(""); // Clear dropdown selection
      setNewIncome((prev) => ({ ...prev, income_name: e.target.value }));
    }}
    className="p-3 border bg-gray-800  font-bold rounded-lg w-full"
  />

  {/* Auto-filled Amount */}
  <input
    type="number"
    name="amount"
    placeholder="Amount ($)"
    value={newIncome.amount}
    onChange={handleInputChange}
    className="p-3 border bg-gray-800 text-white font-bold rounded-lg w-full"
  />

  {/* Date Picker */}
  <input
    type="date"
    name="date"
    value={newIncome.date}
    onChange={handleInputChange}
    className="p-3 border bg-gray-800 text-white font-bold rounded-lg w-full"
  />

  {/* Taxes (Optional) */}
  <input
  type="number"
  name="taxes"
  placeholder="Taxes (Optional)"
  value={newIncome.taxes || ""} // Ensure value is controlled
  onChange={handleInputChange}
  className="p-3 border bg-gray-800 text-white font-bold rounded-lg w-full"
/>

        <button
          onClick={calculateTaxes}
          className=" bg-red-500 text-black font-serif text-xl font-bold  px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          💰 Apply Taxes
        </button>
  </div>


  {taxBreakdown && (
        <div className="mt-6 p-6 bg-gray-100 rounded-2xl shadow-md text-center">
          <h3 className="text-2xl font-bold text-gray-800">📑 Tax Breakdown</h3>
          <p className="text-lg font-semibold text-gray-700">💵 Self-Employment Tax: ${taxBreakdown.selfEmploymentTax}</p>
          <p className="text-lg font-semibold text-gray-700">🇺🇸 Federal Tax: ${taxBreakdown.federalTax}</p>
          <p className="text-lg font-semibold text-gray-700">🏛️ CT State Tax: ${taxBreakdown.stateTax}</p>
          <p className="text-xl font-extrabold text-red-600 mt-2">🔥 Total Taxes Owed: ${taxBreakdown.totalTax}</p>
        </div>
      )}


  <button
    onClick={handleAddIncome}
    className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition"
  >
    💾 Save Income
  </button>
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
💵 <br/> <span className="underline">Total Income</span>
  </h3>
  <p className="md:text-3xl text-xl font-semibold text-white  drop-shadow-lg">
    ${totalIncome.toFixed(2)}
  </p>
</div>

{/* Taxes Owed */}
<div className="p-2 mb-2 bg-gradient-to-br from-red-400 via-rose-500 to-red-700 rounded-3xl shadow-2xl text-center w-[40%] transform transition-all duration-300 hover:scale-105 hover:shadow-red-500/50">
  <h3 className="text-md md:text-3xl font-extrabold text-white drop-shadow-lg">
    🏛️ <br/><span className="underline">Taxes Owed</span>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(groupedIncome).map(([source, amount], index) => (
        <div
          key={index}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 shadow-xl text-center transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/50"
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
{/* Individual Income Records */}
<div className="space-y-4 max-h-[400px] overflow-y-auto p-4 
  bg-gradient-to-br from-green-400 via-emerald-500 to-green-700 
  rounded-2xl shadow-2xl border border-green-600 mt-6 
  text-white custom-scrollbar">  {incomeData.length === 0 ? (
    <p className="text-lg text-gray-500 text-center">No income records found.</p>
  ) : (
    incomeData.map((item, index) => (
      <div key={index} className="p-4 rounded-lg bg-white shadow-md border border-gray-200">
        {editingIncome === item.id ? (
          // ✅ Edit Mode: Render input fields
          <div>
            <input
              type="text"
              name="income_name"
              value={editFormData.income_name}
              onChange={(e) => setEditFormData({ ...editFormData, income_name: e.target.value })}
              className="p-2 border font-bold bg-gray-800 text-center rounded-xl w-full mb-2"
            />
            <input
              type="number"
              name="amount"
              value={editFormData.amount}
              onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
              className="p-2 border rounded font-bold bg-gray-800 text-center w-full mb-2"
            />
            <input
              type="date"
              name="date"
              value={editFormData.date}
              onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
              className="p-2 border font-bold bg-gray-800 text-center rounded w-full mb-2"
            />
            <input
              type="number"
              name="taxes"
              placeholder="Taxes (Optional)"
              value={editFormData.taxes || ""}
              onChange={(e) => setEditFormData({ ...editFormData, taxes: e.target.value })}
              className="p-3 border font-bold bg-gray-800 text-center rounded-lg w-full"
            />
            <button
              onClick={handleUpdateIncome}
              className="bg-green-500 text-white w-full mt-1 py-1 rounded-lg shadow-md hover:bg-green-600 transition mr-2"
            >
              ✅ Save
            </button>
            <button
              onClick={() => setEditingIncome(null)}
              className="bg-gray-500 text-white w-full mt-3 px-3 py-1 rounded-lg shadow-md hover:bg-gray-600 transition"
            >
              ❌ Cancel
            </button>
          </div>
        ) : (
          // ✅ View Mode: Display income details
          <>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Source:</span> {item.source}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Amount:</span> ${item.amount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Taxes:</span> ${item.taxes ? item.taxes : "N/A"}
            </p>

            {/* Edit & Delete Buttons */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleEditClick(item)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-yellow-600 transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDeleteIncome(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-red-600 transition"
              >
                🗑️ Delete
              </button>
            </div>
          </>
        )}
      </div>
    ))
  )}
</div>


      {/* Overall Total Income */}
 
    </div>
  );
}
