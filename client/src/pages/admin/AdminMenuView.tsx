import React, { useEffect, useState } from "react";
import { Plus, Search, Trash2, ToggleLeft, ToggleRight, Star, X } from "lucide-react";
import ToggleSideBar from "../../components/admin/ToggleSideBar";
import EditMenuItemModal from "../../components/admin/EditMenuItemModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import type { MenuItem } from "../../types/menu";
import { useMenuStore } from "../../store/useMenuStore";
import { useNavigate } from "react-router-dom";

const AdminMenuView: React.FC = () => {
  const navigate = useNavigate();

  const {
    getFilteredItems,
    categories,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    deleteMenuItem,
    toggleAvailability,
    fetchAll,
    toggleSpecial,
    addCategory,
  } = useMenuStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const menuItems = getFilteredItems();

  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Custom delete state
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsAddingCategory(true);
    await addCategory(newCategoryName);
    setNewCategoryName("");
    setShowCategoryModal(false);
    setIsAddingCategory(false);
  };

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMenuItem(itemToDelete.id);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to pretty-print department
  const getDepartmentLabel = (department?: string) => {
    if (!department) return "";
    // You may want to show a friendlier label here instead of uppercase.
    // E.g., KITCHEN -> Kitchen, DRINKS -> Drinks, etc
    return department.charAt(0).toUpperCase() + department.slice(1).toLowerCase();
  };

  // Handler to clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* HEADER */}
      <header className="bg-white border-b px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ToggleSideBar />
          <h1 className="text-xl lg:text-2xl font-bold">Menu Management</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Category</span>
          </button>
          <button
            onClick={() => navigate("/admin/menu/add")}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* SEARCH & FILTER */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search menu items..."
              className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={0}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <select
            className="cursor-pointer px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white text-gray-700 font-semibold"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* MENU GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">
                    {typeof item.image === "string" && item.image.startsWith("blob")
                      ? <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                      : item.image}
                  </div>

                  <div className="flex-1 relative">
                    {/* Star Icon for Specials (Toggleable) */}
                    <button
                      type="button"
                      aria-label={item.isSpecial ? "Unmark as Special" : "Mark as Special"}
                      className="absolute -left-6 top-1 focus:outline-none active:scale-95"
                      onClick={() => toggleSpecial(item.id, !item.isSpecial)}
                      style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
                    >
                      <Star
                        className="w-5 h-5"
                        color="#fbbf24"
                        stroke="#fbbf24"
                        fill={item.isSpecial ? "#facc15" : "none"}
                        style={item.isSpecial ? { filter: "drop-shadow(0 1px 1px #eab30890)" } : undefined}
                        aria-hidden="true"
                      />
                    </button>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      {item.isVeg === true && (
                        <div className="flex items-center justify-center w-4 h-4 border border-green-600 p-0.5">
                          <div className="w-full h-full bg-green-600 rounded-full" />
                        </div>
                      )}
                      {item.isVeg === false && (
                        <div className="flex items-center justify-center w-4 h-4 border border-red-600 p-0.5">
                          <div className="w-full h-full bg-red-600 rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600">{item.category}</p>
                      <span className="mx-1 text-gray-400">|</span>
                      {/* Department field from backend */}
                      <span className="text-xs rounded-full bg-gray-100 px-2 py-0.5 text-gray-700 ml-0">
                        {getDepartmentLabel(item.department)}
                      </span>
                    </div>
                    <p className="text-orange-600 font-bold text-xl mt-1">
                      Rs. {item.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* AVAILABILITY */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b">
                <span className="text-sm font-semibold text-gray-700">Available</span>
                <button onClick={() => toggleAvailability(item.id, !item.isAvailable)}>
                  {item.isAvailable ? (
                    <ToggleRight className="w-8 h-8 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  )}
                </button>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditItem(item)}
                  className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-semibold"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteClick(item)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            No items found
          </div>
        )}
      </main>

      {/* EDIT MODAL */}
      <EditMenuItemModal
        isOpen={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Menu Item?"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? this action cannot be undone and will remove it from all categories.`}
        confirmLabel="Delete Item"
        isLoading={isDeleting}
        variant="danger"
      />

      {/* ADD CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <form onSubmit={handleAddCategory}>
              <input
                type="text"
                placeholder="Category Name (e.g. Starters, Drinks)"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none mb-4"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                autoFocus
                disabled={isAddingCategory}
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50"
                  disabled={isAddingCategory || !newCategoryName.trim()}
                >
                  {isAddingCategory ? "Saving..." : "Save Category"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200"
                  disabled={isAddingCategory}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenuView;
