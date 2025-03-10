import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

function Input({ label, ...props }) {
  return (
    <div className="w-full mb-4">
      <label className="block text-lg underline font-semibold text-white text-center mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 border rounded-lg shadow-sm  bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold text-white text-center mb-2">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full px-4 py-3 border rounded-lg shadow-sm bg-blue-200/40 text-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-6 py-3 w-full font-bold text-white rounded-lg shadow-xl 
      bg-gradient-to-r from-black via-red-600 to-black 
      hover:from-red-700 hover:via-black hover:to-red-700 
      transition-all duration-300 transform hover:scale-105 
      shadow-red-500/50 hover:shadow-red-700/50"
>
      {children}
    </button>
  );
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [combinedTotal, setCombinedTotal] = useState(0);
  const [groupedExpenses, setGroupedExpenses] = useState({});

  const [totalMileage, setTotalMileage] = useState(0);
  const fetchTotalExpensesAndMileage = async () => {
    try {
      const response = await axios.get("https://portfoliobackend-ih6t.onrender.com/total_expenses_and_mileage");
      setCombinedTotal(response.data.combined_total);
      setTotalMileage(response.data.total_mileage_reimbursement);
    } catch (error) {
      toast.error("Failed to fetch total expenses and mileage.");
    }
  };
  useEffect(() => {
    fetchExpenses();
    fetchTotalExpensesAndMileage();  // Fetch combined totals on component load
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("https://portfoliobackend-ih6t.onrender.com/expenses");
      setExpenses(response.data);
    } catch (error) {
      toast.error("Failed to fetch expenses.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await axios.patch(`https://portfoliobackend-ih6t.onrender.com/expenses/${editingExpense.id}`, formData);
        toast.success("Expense updated successfully!");
      } else {
        await axios.post("https://portfoliobackend-ih6t.onrender.com/expenses", formData);
        toast.success("Expense created successfully!");
      }
      setFormData({});
      setEditingExpense(null);
      setShowForm(false);
      fetchExpenses();
      fetchTotalExpensesAndMileage();  // Refresh combined totals after submission
    } catch (error) {
      toast.error("Failed to save expense.");
    }
  };
  

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData(expense);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://portfoliobackend-ih6t.onrender.com/expenses/${id}`);
      toast.success("Expense deleted successfully!");
      fetchExpenses();
      fetchTotalExpensesAndMileage();  // Refresh combined totals after deletion
    } catch (error) {
      toast.error("Failed to delete expense.");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="p-6 mt-4 bg-gray-100 rounded-3xl">
<h2 className="text-2xl pb-1  sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-6 text-gray-800 bg-gradient-to-r from-red-500 via-black to-red-500 text-transparent bg-clip-text drop-shadow-lg animate-fade-in">
  💲 Expense Manager 💲 
</h2>   
<div className="w-full h-3 bg-gradient-to-r from-black   via-red-500 to-black rounded-full shadow-lg my-6"></div>      {/* Manual Income Entry */}

      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form ⬆️" : "Add Expense ⬇️"}
      </Button>

      {showForm && (
        <form
  onSubmit={handleSubmit}
  className="mt-6 bg-gradient-to-br from-black via-gray-900 to-black p-8 
             max-w-full  rounded-2xl shadow-xl border border-red-600/50"
>
  <h3 className="text-3xl font-extrabold text-white text-center mb-6 
                 bg-gradient-to-r from-red-500 to-red-700 text-transparent bg-clip-text">
    {editingExpense ? "Edit Expense" : "Add New Expense"}
  </h3>

  <Input
    label="💰 Item"
    name="item"
    value={formData.item || ""}
    onChange={handleChange}
    required
    className="bg-gray-800 text-black border-red-600"
  />
  <Input
    label="💵 Cost ($)"
    type="number"
    name="cost"
    value={formData.cost || ""}
    onChange={handleChange}
    required
    className="bg-gray-800 text-white border-red-600"
  />
  <Input
    label="🔄 Frequency"
    name="frequency"
    value={formData.frequency || ""}
    onChange={handleChange}
    required
    className="bg-gray-800 text-white border-red-600"
  />
  <Input
    label="📅 Purchase Date"
    type="date"
    name="purchase_date"
    value={formData.purchase_date || ""}
    onChange={handleChange}
    required
    className="bg-gray-800 text-white border-red-600"
  />
  <Input
    label="📍 Purchase Location"
    name="purchase_location"
    value={formData.purchase_location || ""}
    onChange={handleChange}
    required
    className="bg-gray-800 text-white border-red-600"
  />
  <Input
    label="💳 Card Used"
    name="card_used"
    value={formData.card_used || ""}
    onChange={handleChange}
    required
    className="bg-gray-800 text-white border-red-600"
  />
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
  <Input
    label="🖼️ Receipt Image URL (Optional)"
    name="image_url_receipt"
    value={formData.image_url_receipt || ""}
    onChange={handleChange}
    className="bg-gray-800 text-white border-red-600"
  />
  <Textarea
    label="📝 Notes"
    name="notes"
    value={formData.notes || ""}
    onChange={handleChange}
    className="bg-gray-800 text-white border-red-600"
  />

  {/* Submit Button */}
  <button
    type="submit"
    className="mt-6 w-full py-3 font-bold text-white rounded-xl shadow-lg 
               bg-gradient-to-r from-red-600 via-red-700 to-red-800 
               hover:from-red-700 hover:via-black hover:to-red-700 
               transition-all duration-300 transform hover:scale-105 
               shadow-red-500/50 hover:shadow-red-700/50"
  >
    {editingExpense ? "Update Expense" : "Create Expense"}
  </button>
</form>

      )}
{/* Item Expenses Section */}
<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
  {/* Item Expenses */}
  <div className="p-4 mb-3 bg-gradient-to-br from-red-500 via-rose-500 to-red-700 
                  rounded-2xl shadow-2xl text-center flex flex-col items-center 
                  transform transition-all duration-300 hover:scale-105 hover:shadow-red-500/50">
    <span className="text-5xl drop-shadow-md">🛒</span>
    <h3 className="text-2xl font-extrabold text-white mt-3 drop-shadow-lg">
      Item Expenses
    </h3>
    <p className="text-3xl font-bold text-white mt-2 drop-shadow-lg">
      ${expenses.reduce((total, expense) => total + expense.cost, 0).toFixed(2)}
    </p>
  </div>

  {/* Mileage Reimbursement */}
  <div className="p-1 mb-4  bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 
                  rounded-2xl shadow-2xl text-center flex flex-col items-center 
                  transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50">
    <span className="text-5xl drop-shadow-md">🚗</span>
    <h3 className="text-2xl font-extrabold text-gray-900 mt-3 drop-shadow-lg">
      Mileage Reimbursement
    </h3>
    <p className="text-3xl font-bold text-gray-900 mt-2 drop-shadow-lg">
      ${totalMileage.toFixed(2)}
    </p>
  </div>
</div>



<div className="relative bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-700 max-h-[500px] overflow-y-auto custom-scrollbar">


  {expenses.length === 0 ? (
    <p className="text-lg text-gray-400 text-center">No expense records found.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {expenses.map((expense) => (
        <motion.div
          key={expense.id}
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 
                     rounded-2xl shadow-lg border border-gray-600 text-white
                     transform transition-all duration-300 hover:shadow-xl"
        >
          {/* Header with Item Name & Cost */}
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-bold">{expense.item}</h4>
            <span className="bg-red-500 text-white px-3 py-1 rounded-xl text-lg font-semibold">
              ${expense.cost.toFixed(2)}
            </span>
          </div>

          {/* Expense Details */}
          <div className="mt-3 text-gray-300 text-sm space-y-2">
            <p><span className="font-semibold text-white">🔄 Frequency:</span> {expense.frequency}</p>
            <p><span className="font-semibold text-white">📅 Purchased:</span> {expense.purchase_date}</p>
            <p><span className="font-semibold text-white">📍 Location:</span> {expense.purchase_location}</p>
            <p><span className="font-semibold text-white">💳 Card Used:</span> {expense.card_used}</p>
          </div>

          {/* Receipt Image Display */}
          {expense.image_url_receipt && (
            <div className="mt-4">
              <img
                src={expense.image_url_receipt}
                alt="Receipt"
                className="w-full h-36 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Notes Section */}
          <p className="text-gray-400 italic mt-3 max-h-24 overflow-y-auto custom-scrollbar p-2 rounded-lg bg-gray-800/50">
  📝 {expense.notes || "No notes available."}
</p>


          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => handleEdit(expense)}
              className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-xl shadow-md 
                         hover:bg-yellow-600 transition-all duration-300"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => handleDelete(expense.id)}
              className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl shadow-md 
                         hover:bg-red-600 transition-all duration-300"
            >
              🗑️ Delete
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )}
</div>


{/* Total Expenses Section */}

{/* Item Expenses Section */}


    </div>
  );
}
