import React, { useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMenuStore } from "../../store/useMenuStore";
import toast from "react-hot-toast";

// Department options
const DEPARTMENTS = [
  { id: 'kitchen', name: 'Kitchen', icon: '🍽️' },
  { id: 'drink', name: 'Drink', icon: '☕' },
  { id: 'bakery', name: 'Bakery', icon: '🥯' },
  { id: 'hukka', name: 'Hukka', icon: '💨' },
];

const AdminAddMenuView = () => {
  const navigate = useNavigate();

  // ===== STATE =====
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [department, setDepartment] = useState(""); // NEW: Department state
  const [isVeg, setIsVeg] = useState<boolean | null>(true);
  const [isSpecial, setIsSpecial] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [priceError, setPriceError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addItem, categories, fetchAll } = useMenuStore();

  React.useEffect(() => {
    fetchAll();
  }, []);

  // ===== PRICE HANDLER =====
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setPrice("");
      setPriceError("");
      return;
    }
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      setPrice(num);
      setPriceError("Price cannot be negative");
    } else {
      setPrice(num);
      setPriceError("");
    }
  };

  // ===== SUBMIT with API =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || price === "" || !categoryId || !department) {
      alert("Please fill all required fields including department");
      return;
    }

    if (typeof price === "number" && price < 0) {
      alert("Price cannot be negative");
      return;
    }

    if (priceError) {
      alert("Please correct the price before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert department to uppercase for database
      const departmentUpper = department.toUpperCase() as 'KITCHEN' | 'DRINK' | 'BAKERY' | 'HUKKA';

      const payload = {
        name,
        price,
        categoryId,
        department: departmentUpper, // Send uppercase to match DB enum
        isVeg,
        isAvailable,
        isSpecial,
      };

      await addItem(payload);
      navigate("/admin/menu");
    } catch (error: any) {
      toast.error(error?.message || "Failed to add menu item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for orange *
  const RequiredAsterisk = () => (
    <span className="text-orange-600 font-bold ml-1">*</span>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b px-4 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/menu")}
            className="text-gray-600 hover:text-gray-900"
            type="button"
            disabled={isSubmitting}
          >
            ← Back
          </button>
          <h1 className="text-xl lg:text-2xl font-bold">Add New Menu Item</h1>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 lg:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* NAME + PRICE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Name
                    <RequiredAsterisk />
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="e.g., Chicken Biryani"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (Rs.)
                    <RequiredAsterisk />
                  </label>
                  <input
                    value={price}
                    min={0}
                    onChange={handlePriceChange}
                    type="number"
                    placeholder="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 ${priceError ? "border-red-500" : ""
                      }`}
                    disabled={isSubmitting}
                  />
                  {priceError && (
                    <span className="text-xs text-red-600 mt-1 block">
                      {priceError}
                    </span>
                  )}
                </div>
              </div>

              {/* CATEGORY + DEPARTMENT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                    <RequiredAsterisk />
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* NEW: DEPARTMENT DROPDOWN */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                    <RequiredAsterisk />
                  </label>
                  <select
                    value={department}
                    onChange={(e) => {
                      console.log('Department changed:', e.target.value);
                      setDepartment(e.target.value);
                    }}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.icon} {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* FOOD TYPE - CHECKBOX */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Food Type
                  <RequiredAsterisk />
                </label>
                <div className="flex items-center gap-6">
                  {/* Vegetarian Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span
                      className={`relative inline-flex items-center justify-center w-5 h-5 border-2 rounded-md transition-colors
                    ${isVeg === true
                          ? "border-green-600 bg-green-600"
                          : "border-gray-300 bg-white"
                        } mr-1`}
                      style={{ transition: "background 0.15s, border 0.15s" }}
                    >
                      <input
                        type="checkbox"
                        checked={isVeg === true}
                        onChange={() => setIsVeg(isVeg === true ? null : true)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        disabled={isSubmitting}
                      />
                      {isVeg === true && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      )}
                    </span>
                    <span className="text-sm font-medium text-gray-700">Veg</span>
                  </label>

                  {/* Non-Vegetarian Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span
                      className={`relative inline-flex items-center justify-center w-5 h-5 border-2 rounded-md transition-colors
                    ${isVeg === false
                          ? "border-red-600 bg-red-600"
                          : "border-gray-300 bg-white"
                        } mr-1`}
                      style={{ transition: "background 0.15s, border 0.15s" }}
                    >
                      <input
                        type="checkbox"
                        checked={isVeg === false}
                        onChange={() => setIsVeg(isVeg === false ? null : false)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        disabled={isSubmitting}
                      />
                      {isVeg === false && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      )}
                    </span>
                    <span className="text-sm font-medium text-gray-700">Non-Veg</span>
                  </label>
                </div>
              </div>

              {/* IS AVAILABLE */}
              <div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span
                      className={`relative inline-flex items-center justify-center w-5 h-5 border-2 rounded-md transition-colors
                      ${isAvailable
                          ? "border-orange-600 bg-orange-600"
                          : "border-gray-300 bg-white"
                        } mr-1`}
                      style={{ transition: "background 0.15s, border 0.15s" }}
                    >
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        id="available-checkbox"
                        onChange={() =>
                          !isSubmitting && setIsAvailable(!isAvailable)
                        }
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        disabled={isSubmitting}
                      />
                      {isAvailable && (
                        <Check
                          className="w-4 h-4 text-white pointer-events-none"
                          strokeWidth={3}
                        />
                      )}
                    </span>
                    <span>Available</span>
                  </label>
                </div>
              </div>

              {/* SPECIAL CATEGORY */}
              <div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span
                      className={`relative inline-flex items-center justify-center w-5 h-5 border-2 rounded-md transition-colors
        ${isSpecial
                          ? "border-orange-600 bg-orange-600"
                          : "border-gray-300 bg-white"
                        } mr-1`}
                      style={{ transition: "background 0.15s, border 0.15s" }}
                    >
                      <input
                        type="checkbox"
                        checked={isSpecial}
                        id="special-checkbox"
                        onChange={() => !isSubmitting && setIsSpecial(!isSpecial)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        disabled={isSubmitting}
                      />
                      {isSpecial && (
                        <Check
                          className="w-4 h-4 text-white pointer-events-none"
                          strokeWidth={3}
                        />
                      )}
                    </span>
                    <span>Special Category</span>
                  </label>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Item"}
                </button>
                <button
                  type="button"
                  onClick={() => !isSubmitting && navigate("/admin/menu")}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAddMenuView;