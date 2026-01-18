import React, { useState, useRef } from "react";
import { Upload, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMenuStore } from "../../store/useMenuStore";
import toast from "react-hot-toast";

// Removed hardcoded CATEGORIES

const AdminAddMenuView = () => {
  const navigate = useNavigate();

  // ===== STATE =====
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [isSpecial, setIsSpecial] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addItem, categories, fetchAll } = useMenuStore()

  React.useEffect(() => {
    fetchAll();
  }, []);

  // ===== IMAGE HANDLER =====
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ===== PRICE HANDLER =====
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Accept blank input
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

    if (!name || price === "" || !category || !imageFile) {
      alert("Please fill all required fields");
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
      // Construct multipart form data for possible file upload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", String(price));
      formData.append("category", category);
      formData.append("description", description);
      formData.append("isVeg", isVeg ? "true" : "false");
      formData.append("isAvailable", isAvailable ? "true" : "false");
      formData.append("isSpecial", isSpecial ? "true" : "false");

      if (imageFile) formData.append("image", imageFile);

      await addItem(formData)

      navigate("/admin/menu");
    } catch (error: any) {
      // You may want to use a toast rather than alert!
      toast.error(error?.message || "Failed to add menu item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for orange *
  const RequiredAsterisk = () => (
    <span className="text-orange-600 font-bold ml-1">*</span>
  );

  // Removed unused OrangeCheckbox

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

              {/* IMAGE UPLOAD AT TOP */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Image
                  <RequiredAsterisk />
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isSubmitting}
                />

                {preview ? (
                  <img
                    src={preview}
                    onClick={() => {
                      if (!isSubmitting) fileInputRef.current?.click();
                    }}
                    className="w-28 h-28 rounded-lg object-cover border cursor-pointer border-orange-600"
                  />
                ) : (
                  <div
                    onClick={() => {
                      if (!isSubmitting) fileInputRef.current?.click();
                    }}
                    className="w-28 h-28 flex items-center justify-center border-2 border-orange-600 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors"
                  >
                    <Upload className="text-orange-400 w-10 h-10" />
                  </div>
                )}
              </div>

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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 ${priceError ? 'border-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  {priceError && (
                    <span className="text-xs text-red-600 mt-1 block">{priceError}</span>
                  )}
                </div>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                  <RequiredAsterisk />
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* FOOD TYPE - RADIO BUTTONS */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Food Type
                  <RequiredAsterisk />
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="foodType"
                      checked={isVeg === true}
                      onChange={() => setIsVeg(true)}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      disabled={isSubmitting}
                    />
                    <span>🟢 Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="foodType"
                      checked={isVeg === false}
                      onChange={() => setIsVeg(false)}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      disabled={isSubmitting}
                    />
                    <span>🔴 Non-Vegetarian</span>
                  </label>
                </div>
              </div>

              {/* IS AVAILABLE - checkbox for "Available" without title or Yes/No */}
              <div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span
                      className={`relative inline-flex items-center justify-center w-5 h-5 border-2 rounded-md transition-colors
                      ${isAvailable ? 'border-orange-600 bg-orange-600' : 'border-gray-300 bg-white'} mr-1`}
                      style={{ transition: "background 0.15s, border 0.15s" }}
                    >
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        id="available-checkbox"
                        onChange={() => !isSubmitting && setIsAvailable(!isAvailable)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        disabled={isSubmitting}
                      />
                      {isAvailable && (
                        <Check className="w-4 h-4 text-white pointer-events-none" strokeWidth={3} />
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
        ${isSpecial ? 'border-orange-600 bg-orange-600' : 'border-gray-300 bg-white'} mr-1`}
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
                        <Check className="w-4 h-4 text-white pointer-events-none" strokeWidth={3} />
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
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Item"}
                </button>
                <button
                  type="button"
                  onClick={() => !isSubmitting && navigate("/admin/menu")}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300"
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
