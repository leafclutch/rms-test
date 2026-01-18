import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import type { MenuItem } from "../../types/menu";

const CATEGORY_OPTIONS = ["Starters", "Main Course", "Desserts", "Beverages", "Veg", "Non-Veg"];

type AddMenuItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<MenuItem, "id">) => void;
};

const AddMenuItemModal: React.FC<AddMenuItemModalProps> = ({ isOpen, onClose, onAddItem }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [price, setPrice] = useState<number | "">("");
  const [isVeg, setIsVeg] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Generate a preview when a file is selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setPreview(null);
    }
  };

  const handleAdd = () => {
    if (!name || !category || !price || !imageFile) {
      alert("Please fill all fields and upload an image");
      return;
    }

    // Convert file to a URL or send it to backend
    const imageUrl = preview || "";

    onAddItem({
      name,
      category,
      price: Number(price),
      isVeg,
      image: imageUrl,
      isAvailable,
      description: "", // optional
    });

    // Reset fields
    setName("");
    setCategory(CATEGORY_OPTIONS[0]);
    setPrice("");
    setIsVeg(true);
    setImageFile(null);
    setPreview(null);
    setIsAvailable(true);

    onClose();
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Add New Menu Item</h2>

        <div className="flex flex-col gap-3">
          {/* Name */}
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
          />

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Price */}
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
          />

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Upload Image:</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg mt-2 border cursor-pointer"
                onClick={handleImageClick}
                title="Click to upload/change image"
              />
            ) : (
              <div
                className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg mt-2 border cursor-pointer hover:bg-gray-200"
                onClick={handleImageClick}
                title="Click to upload/change image"
              >
                <Upload className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>

          {/* Veg Toggle */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Veg:</label>
            <input
              type="checkbox"
              checked={isVeg}
              onChange={(e) => setIsVeg(e.target.checked)}
              className="w-5 h-5 accent-orange-600"
            />
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Available:</label>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-5 h-5 accent-orange-600"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="mt-4 w-full py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItemModal;
