import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

function Input({ label, ...props }) {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300"
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
    <div className="p-6 mt-4 rounded-3xl">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
        💸 Expense Tracker 💸
      </h2>

      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form ⬆️" : "Add Expense ⬇️"}
      </Button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-gray-50 p-6 max-w-2xl rounded-2xl shadow-inner"
        >
          <Input
            label="Item"
            name="item"
            value={formData.item || ""}
            onChange={handleChange}
            required
          />
          <Input
            label="Cost ($)"
            type="number"
            name="cost"
            value={formData.cost || ""}
            onChange={handleChange}
            required
          />
          <Input
            label="Frequency"
            name="frequency"
            value={formData.frequency || ""}
            onChange={handleChange}
            required
          />
          <Input
            label="Purchase Date"
            type="date"
            name="purchase_date"
            value={formData.purchase_date || ""}
            onChange={handleChange}
            required
          />
          <Input
            label="Purchase Location"
            name="purchase_location"
            value={formData.purchase_location || ""}
            onChange={handleChange}
            required
          />
          <Input
            label="Card Used"
            name="card_used"
            value={formData.card_used || ""}
            onChange={handleChange}
            required
          />
          <Input
            label="Receipt Image URL (Optional)"
            name="image_url_receipt"
            value={formData.image_url_receipt || ""}
            onChange={handleChange}
          />
          <Textarea
            label="Notes"
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
          />
          <Button type="submit">{editingExpense ? "Update" : "Create"}</Button>
        </form>
      )}
{/* Item Expenses Section */}
<div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
  {/* Item Expenses */}
  <div className="p-4 bg-red-400 rounded-xl shadow-md text-center flex flex-col items-center">
    <span className="text-4xl">🛒</span>
    <h3 className="text-xl font-semibold text-white mt-2">Item Expenses</h3>
    <p className="text-2xl font-bold text-white">${expenses.reduce((total, expense) => total + expense.cost, 0).toFixed(2)}</p>
  </div>

  {/* Mileage Reimbursement */}
  <div className="p-4 bg-yellow-300 rounded-xl shadow-md text-center flex flex-col items-center">
    <span className="text-4xl">🚗</span>
    <h3 className="text-xl font-semibold text-gray-900 mt-2">Mileage Reimbursement</h3>
    <p className="text-2xl font-bold text-gray-900">${totalMileage.toFixed(2)}</p>
  </div>

  {/* Combined Total Expenses */}
  <div className="p-4 bg-blue-500 rounded-xl shadow-md text-center flex flex-col items-center">
    <span className="text-4xl">💵</span>
    <h3 className="text-xl font-semibold text-white mt-2">Combined Total</h3>
    <p className="text-2xl font-bold text-white">${combinedTotal.toFixed(2)}</p>
  </div>
</div>



<div className="space-y-4 max-h-[200px] overflow-y-auto p-4 bg-gray-50 rounded-2xl shadow-inner border">
  {expenses.length === 0 ? (
    <p className="text-lg text-gray-500 text-center">No expense records found.</p>
  ) : (
    expenses.map((expense) => (
      <motion.div
        key={expense.id}
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-lg bg-white shadow-md border border-gray-200"
      >
        <h4 className="text-lg font-semibold text-gray-900">{expense.item}</h4>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💰 Cost:</span> ${expense.cost.toFixed(2)}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">🔄 Frequency:</span> {expense.frequency}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">📅 Purchased:</span> {expense.purchase_date}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">📍 Location:</span> {expense.purchase_location}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💳 Card Used:</span> {expense.card_used}
        </p>
        {expense.image_url_receipt && (
          <img
            src={expense.image_url_receipt}
            alt="Receipt"
            className="w-full h-32 object-cover rounded-lg mb-2"
          />
        )}
        <p className="text-gray-600 italic">
          📝 {expense.notes || "No notes available."}
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => handleEdit(expense)}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            ✏️ Edit
          </Button>
          <Button
            onClick={() => handleDelete(expense.id)}
            className="bg-red-500 hover:bg-red-600"
          >
            🗑️ Delete
          </Button>
        </div>
      </motion.div>
    ))
  )}
</div>

{/* Total Expenses Section */}

{/* Item Expenses Section */}


    </div>
  );
}
