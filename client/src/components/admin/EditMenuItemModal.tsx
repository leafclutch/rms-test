import React, { useState, useEffect } from "react";
import { Trash2, X } from "lucide-react";
import type { MenuItem } from "../../types/menu";
import { useMenuStore } from "../../store/useMenuStore";
import ConfirmModal from "../common/ConfirmModal";

// Department options
const DEPARTMENTS = [
  { id: 'kitchen', name: 'Kitchen', icon: '🍽️' },
  { id: 'drink', name: 'Drink', icon: '☕' },
  { id: 'bakery', name: 'Bakery', icon: '🥯' },
  { id: 'hukka', name: 'Hukka', icon: '💨' },
];

type EditMenuItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
};

const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  // Store actions
  const { updateMenuItem, deleteMenuItem } = useMenuStore();
  // Obtain categories from store
  const categories = useMenuStore((state) => state.categories);

  // State for all fields
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [department, setDepartment] = useState(""); // NEW: Department state
  const [price, setPrice] = useState<number | "">("");
  const [isVeg, setIsVeg] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSpecial, setIsSpecial] = useState(false);

  // Custom delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /** Load existing item values */
  useEffect(() => {
    if (item) {
      setName(item.name);
      const cat = categories.find(c => c.categoryName === item.category);
      setCategoryId(cat?.categoryId || "");
      // Convert database value (KITCHEN) to UI value (kitchen)
      setDepartment(item.department?.toLowerCase() || "");
      setPrice(item.price);
      setIsVeg(item.isVeg ?? true);
      setIsAvailable(item.isAvailable);
      setIsSpecial(item.isSpecial);
    }
  }, [item, categories]);

  if (!isOpen || !item) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMenuItem(item.id);
      setShowDeleteConfirm(false);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (!name || !categoryId || !department || price === "") {
      alert("Please fill all required fields including department");
      return;
    }

    // Convert department to uppercase for database
    const departmentUpper = department.toUpperCase() as 'KITCHEN' | 'DRINK' | 'BAKERY' | 'HUKKA';

    const updateData = {
      name,
      categoryId,
      department: departmentUpper, // Send uppercase to match DB enum
      price: Number(price),
      isVeg,
      isAvailable,
      isSpecial,
    };

    await updateMenuItem(item.id, updateData);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold mb-4">Edit Menu Item</h2>

          <div className="flex flex-col gap-3">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Item Name <span className="text-orange-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Chicken Biryani"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category <span className="text-orange-600">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* NEW: Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Department <span className="text-orange-600">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.icon} {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Price (Rs.) <span className="text-orange-600">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={0}
                placeholder="0"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Food Type (Dual Checkbox) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Food Type <span className="text-orange-600">*</span>
              </label>
              <div className="flex items-center gap-6">
                {/* Vegetarian Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span
                    className={`relative inline-flex items-center justify-center w-5 h-5 border-2 rounded-md transition-colors
                    ${
                      isVeg
                        ? "border-green-600 bg-green-600"
                        : "border-gray-300 bg-white"
                    } mr-1`}
                    style={{ transition: "background 0.15s, border 0.15s" }}
                  >
                    <input
                      type="checkbox"
                      checked={isVeg === true}
                      onChange={() => setIsVeg(true)}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                    {isVeg === true && (
                      <Check
                        className="w-4 h-4 text-white pointer-events-none"
                        strokeWidth={3}
                      />
                    )}
                  </span>
                  <span className="text-sm font-medium">Vegetarian</span>
                </label>

                {/* Non-Vegetarian Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span
                    className={`relative inline-flex items-center justify-center w-5 h-5 border-2 rounded-md transition-colors
                    ${
                      !isVeg
                        ? "border-red-600 bg-red-600"
                        : "border-gray-300 bg-white"
                    } mr-1`}
                    style={{ transition: "background 0.15s, border 0.15s" }}
                  >
                    <input
                      type="checkbox"
                      checked={isVeg === false}
                      onChange={() => setIsVeg(false)}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                    {isVeg === false && (
                      <Check
                        className="w-4 h-4 text-white pointer-events-none"
                        strokeWidth={3}
                      />
                    )}
                  </span>
                  <span className="text-sm font-medium">Non-Vegetarian</span>
                </label>
              </div>
            </div>

            {/* Available */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                id="edit-available"
                className="w-5 h-5 accent-orange-600 cursor-pointer"
              />
              <label htmlFor="edit-available" className="font-medium cursor-pointer">
                Available
              </label>
            </div>

            {/* Special */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSpecial}
                onChange={(e) => setIsSpecial(e.target.checked)}
                id="edit-special"
                className="w-5 h-5 accent-orange-600 cursor-pointer"
              />
              <label htmlFor="edit-special" className="font-medium cursor-pointer">
                Special Category
              </label>
            </div>

            {/* Department Badge Display */}
            {department && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Selected Department:</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {DEPARTMENTS.find(d => d.id === department)?.icon}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {DEPARTMENTS.find(d => d.id === department)?.name}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                onClick={handleUpdate}
                className="flex-[2] py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Update Item
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Permanently Delete?"
        message={`This will remove "${name}" from your menu. This action is irreversible.`}
        confirmLabel="Yes, Delete"
        isLoading={isDeleting}
      />
    </>
  );
};

export default EditMenuItemModal;