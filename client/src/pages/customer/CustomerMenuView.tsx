// import React, { useState, useEffect } from "react";
// import { Search, ShoppingCart, ToggleLeft, ToggleRight, Star } from "lucide-react";
// import CartSidebar from "../../components/customer/CartSidebar";
// import { useMenuStore } from "../../store/useMenuStore"; // import the Zustand store
// import type { MenuItem } from "../../types/menu";

// // Top category images (these are just for display, user picks from all admin categories)
// const TOP_CATEGORIES = [
//   { name: "All", icon: "🍽️" }, // <-- New All category
//   { name: "Tea", icon: "🍵" },
//   { name: "Drinks", icon: "🥤" },
//   { name: "Snacks", icon: "🍜" },
//   { name: "Chatpatey Items", icon: "🌶️" },
//   { name: "Rice", icon: "🍛" },
//   { name: "Momo", icon: "🥟" },
// ];

// // The correct type for image can be inferred, fallback to string
// function getImageProps(image: any, name: string) {
//   if (!image) return { type: "none" };
//   if (typeof image === "string") {
//     return { type: "emoji", value: image };
//   }
//   if (typeof image === "object" && typeof image.url === "string") {
//     return { type: "image", url: image.url, alt: (image.alt as string) || name };
//   }
//   return { type: "none" };
// }

// const CustomerMenuView: React.FC = () => {
//   // Import categories from menu store (admin/source of truth)
//   const { getFilteredItems, fetchAll, categories } = useMenuStore();
//   const [allItems, setAllItems] = useState<MenuItem[]>([]);

//   useEffect(() => {
//     fetchAll().then(() => {
//       setAllItems(getFilteredItems());
//     });
//   }, []);

//   // Keep items in sync with store
//   useEffect(() => {
//     setAllItems(getFilteredItems());
//   }, [getFilteredItems]);

//   const [cart, setCart] = useState<(MenuItem & { quantity: number })[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [selectedTopCategory, setSelectedTopCategory] = useState<string | null>(null);
//   const [showCart, setShowCart] = useState(false);

//   // Cart functions
//   const addToCart = (item: MenuItem) => {
//     const exists = cart.find((i) => i.id === item.id);
//     if (exists) return alert("Item already in cart");
//     setCart((prev) => [...prev, { ...item, quantity: 1 }]);
//   };

//   const updateQuantity = (id: string, delta: number) => {
//     setCart((prev) =>
//       prev
//         .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
//         .filter((i) => i.quantity > 0)
//     );
//   };

//   const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

//   const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
//   const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

//   // Filtered menu items based on top category, search, and admin's category
//   const filteredItems = allItems.filter((item) => {
//     // Top visual category filter (optional visual for users)
//     const matchesTop =
//       !selectedTopCategory || selectedTopCategory === "All"
//         ? true
//         : item.category === selectedTopCategory;

//     // Primary admin category filter
//     const matchesCat =
//       selectedCategory === "All" ? true : item.category === selectedCategory;

//     // Search filter
//     const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

//     return matchesTop && matchesCat && matchesSearch;
//   });

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow sticky top-0 z-30">
//         <div className="max-w-7xl mx-auto px-4 lg:px-8 flex justify-between items-center h-16 lg:h-20">
//           <div className="flex items-center gap-4">
//             <div className="text-3xl lg:text-4xl">🍽️</div>
//             <div>
//               <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Chiyaholic Bhairahawa</h1>
//               <p className="text-xs lg:text-sm text-gray-600">⭐ 77°C</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setShowCart((s) => !s)}
//               className="relative p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
//             >
//               <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
//               {cartItemCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
//                   {cartItemCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Top Category Images */}
//         <div className="bg-white border-b">
//           <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex gap-4 overflow-x-auto scrollbar-hide">
//             {TOP_CATEGORIES.map((cat) => (
//               <button
//                 key={cat.name}
//                 onClick={() => setSelectedTopCategory(cat.name)}
//                 className={`flex flex-col items-center gap-1 min-w-[70px] p-2 rounded-lg transition-all ${selectedTopCategory === cat.name
//                   ? "bg-orange-600 text-white"
//                   : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                   }`}
//               >
//                 <span className="text-2xl">{cat.icon}</span>
//                 <span className="text-xs font-medium text-center">{cat.name}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Search + Category Filter */}
//         <div className="bg-white border-b">
//           <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col lg:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search menu items..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//               />
//             </div>
//             <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
//               {/* Category buttons using admin's categories */}
//               <button
//                 key="All"
//                 onClick={() => setSelectedCategory("All")}
//                 className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedCategory === "All"
//                     ? "bg-orange-600 text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//               >
//                 All
//               </button>

//               {categories
//                 .filter((cat) => !!cat && cat.categoryName !== "All")
//                 .map((cat) => (
//                   <button
//                     key={cat.categoryId}
//                     onClick={() => setSelectedCategory(cat.categoryName)}
//                     className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedCategory === cat.categoryName
//                         ? "bg-orange-600 text-white"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                   >
//                     {cat.categoryName}
//                   </button>
//                 ))}

//             </div>
//           </div>
//         </div>
//       </header>


//       {/* Menu Grid */}
//       <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {filteredItems.map((item) => {
//           const imgProps = getImageProps(item.image, item.name);
//           return (
//             <div
//               key={item.id}
//               className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2 hover:shadow-2xl transition-all"
//             >
//               {/* Star and Availability Toggle */}
//               <div className="flex items-center gap-2 justify-end mb-1">
//                 {item.isSpecial && (
//                   <Star
//                     className="w-5 h-5"
//                     color="#fbbf24"
//                     stroke="#fbbf24"
//                     fill="#facc15"
//                     style={{ filter: "drop-shadow(0 1px 1px #eab30890)" }}
//                     aria-label="Special item"
//                     aria-hidden="false"
//                   />
//                 )}
//                 {item.isAvailable ? (
//                   <ToggleRight className="w-5 h-5 text-green-500" aria-label="Available" />
//                 ) : (
//                   <ToggleLeft className="w-5 h-5 text-gray-400" aria-label="Unavailable" />
//                 )}
//               </div>

//               {/* Image */}
//               <div className="text-4xl text-center">
//                 {imgProps.type === "emoji" ? (
//                   imgProps.value
//                 ) : imgProps.type === "image" ? (
//                   <img src={imgProps.url} alt={imgProps.alt || item.name} className="mx-auto w-16 h-16" />
//                 ) : (
//                   "🍽️"
//                 )}
//               </div>

//               {/* Item info */}
//               <h3 className="font-bold text-lg truncate">{item.name}</h3>
//               <p className="text-xs text-gray-500">{item.category}</p>
//               <p className="text-orange-600 font-bold text-lg">Rs. {item.price}</p>
//               <p className="text-gray-600 text-sm">{item.description}</p>

//               <button
//                 onClick={() => addToCart(item)}
//                 className="mt-auto w-full py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           );
//         })}
//       </div>


//       {/* Cart Sidebar */}
//       {showCart && (
//         <CartSidebar
//           cart={cart}
//           cartTotal={cartTotal}
//           setShowCart={setShowCart}
//           updateQuantity={updateQuantity}
//           removeFromCart={removeFromCart}
//         />
//       )}
//     </div>
//   );
// };

// export default CustomerMenuView;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ShoppingCart, Search, ArrowLeft } from 'lucide-react';
// import { useCustomerCartStore } from '../../store/useCustomerCartStore';
// import { useMenuStore } from '../../store/useMenuStore';
// import { useCustomerOrderStore } from '../../store/useCustomerOrderStore';
// import CartSidebar from '../../components/customer/CartSidebar';
// import type { MenuItem } from '../../types/menu';

// const CustomerMenuView: React.FC = () => {
//   const { tableCode } = useParams<{ tableCode?: string }>();
//   const navigate = useNavigate();

//   const { cart, addToCart, getTotalAmount, getTotalItems } = useCustomerCartStore();
//   const { 
//     items: menuItems,
//     categories,
//     selectedCategory,
//     searchQuery,
//     setSelectedCategory,
//     setSearchQuery,
//     getFilteredItems 
//   } = useMenuStore();

//   const { orders } = useCustomerOrderStore();

//   const [showCart, setShowCart] = useState(false);

//   const filteredItems = getFilteredItems();
//   const cartTotal = getTotalAmount();
//   const cartItemCount = getTotalItems();

//   // Check if there's an existing order for this table
//   const existingTableOrder = tableCode 
//     ? orders.find(o => 
//         o.tableCode?.toLowerCase() === tableCode.toLowerCase() && 
//         o.status !== 'completed'
//       )
//     : null;

//   // Group items by category
//   const groupedItems = filteredItems.reduce((acc, item) => {
//     if (!acc[item.category]) {
//       acc[item.category] = [];
//     }
//     acc[item.category].push(item);
//     return acc;
//   }, {} as Record<string, MenuItem[]>);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm sticky top-0 z-30">
//         <div className="max-w-7xl mx-auto px-4 lg:px-8">
//           <div className="flex items-center justify-between h-16 lg:h-20">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => navigate('/')}
//                 className="lg:hidden"
//               >
//                 <ArrowLeft className="w-6 h-6" />
//               </button>
//               <div className="text-3xl lg:text-4xl">🍽️</div>
//               <div>
//                 <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
//                   Chiyaholic Bhairahawa
//                 </h1>
//                 {tableCode && (
//                   <p className="text-xs lg:text-sm text-gray-600">
//                     Table: <span className="font-bold text-orange-600">{tableCode.toUpperCase()}</span>
//                   </p>
//                 )}
//               </div>
//             </div>

//             <button
//               onClick={() => setShowCart(!showCart)}
//               className="relative p-2 lg:p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
//             >
//               <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
//               {cartItemCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
//                   {cartItemCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Existing Order Alert */}
//       {existingTableOrder && (
//         <div className="bg-blue-50 border-l-4 border-blue-500 p-4 max-w-7xl mx-auto mt-4 mx-4 lg:mx-8">
//           <div className="flex items-start">
//             <div className="flex-shrink-0">
//               <ShoppingCart className="h-5 w-5 text-blue-500" />
//             </div>
//             <div className="ml-3 flex-1">
//               <p className="text-sm text-blue-700">
//                 You have an active order: <strong>#{existingTableOrder.orderNumber}</strong>
//               </p>
//               <p className="text-xs text-blue-600 mt-1">
//                 Total: Rs. {existingTableOrder.totalAmount} | Items will be added to this order
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Search and Filters */}
//       <div className="bg-white border-b sticky top-16 lg:top-20 z-20">
//         <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
//           <div className="flex flex-col lg:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search menu items..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 lg:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//               />
//             </div>
//             <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
//               {categories.map(cat => (
//                 <button
//                   key={cat}
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
//                     selectedCategory === cat
//                       ? 'bg-orange-600 text-white'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   {cat === 'Veg' ? '🟢' : cat === 'Non-Veg' ? '🔴' : ''} {cat}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Menu Grid */}
//       <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
//         {Object.entries(groupedItems).map(([category, items]) => (
//           <div key={category} className="mb-8 lg:mb-12">
//             <h2 className="text-xl lg:text-2xl font-bold text-orange-600 mb-4 lg:mb-6">
//               {category}
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
//               {items.map(item => (
//                 <div
//                   key={item.id}
//                   className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100"
//                 >
//                   <div className="p-4 lg:p-6">
//                     <div className="flex items-start gap-4">
//                       <div className="text-4xl lg:text-5xl">{item.image}</div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-1">
//                           <h3 className="font-semibold text-base lg:text-lg truncate">
//                             {item.name}
//                           </h3>
//                           <span className="text-lg flex-shrink-0">
//                             {item.isVeg ? '🟢' : '🔴'}
//                           </span>
//                         </div>
//                         {item.description && (
//                           <p className="text-xs lg:text-sm text-gray-600 mb-2 line-clamp-2">
//                             {item.description}
//                           </p>
//                         )}
//                         <div className="flex items-center justify-between mt-3">
//                           <span className="text-orange-600 font-bold text-lg lg:text-xl">
//                             Rs. {item.price}
//                           </span>
//                           <button
//                             onClick={() => addToCart(item)}
//                             disabled={!item.isAvailable}
//                             className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm lg:text-base"
//                           >
//                             {item.isAvailable ? 'Add' : 'Unavailable'}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Cart Sidebar */}
//       {showCart && (
//         <CartSidebar
//           setShowCart={setShowCart}
//           tableCode={tableCode}
//           existingOrder={existingTableOrder}
//         />
//       )}
//     </div>
//   );
// };

// export default CustomerMenuView;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ShoppingCart, Search, ArrowLeft, Star, ToggleLeft, ToggleRight } from 'lucide-react';
// import { useCustomerCartStore } from '../../store/useCustomerCartStore';
// import { useMenuStore } from '../../store/useMenuStore';
// import { useCustomerOrderStore } from '../../store/useCustomerOrderStore';
// import CartSidebar from '../../components/customer/CartSidebar';
// import type { MenuItem } from '../../types/menu';

// // Top category images (visual categories for quick navigation)
// const TOP_CATEGORIES = [
//   { name: "All", icon: "🍽️" },
//   { name: "Tea", icon: "🍵" },
//   { name: "Drinks", icon: "🥤" },
//   { name: "Snacks", icon: "🍜" },
//   { name: "Chatpatey Items", icon: "🌶️" },
//   { name: "Rice", icon: "🍛" },
//   { name: "Momo", icon: "🥟" },
// ];

// // Helper function to get image properties
// function getImageProps(image: any, name: string) {
//   if (!image) return { type: "none" };
//   if (typeof image === "string") {
//     return { type: "emoji", value: image };
//   }
//   if (typeof image === "object" && typeof image.url === "string") {
//     return { type: "image", url: image.url, alt: (image.alt as string) || name };
//   }
//   return { type: "none" };
// }

// const CustomerMenuView: React.FC = () => {
//   const { tableCode } = useParams<{ tableCode?: string }>();
//   const navigate = useNavigate();

//   const { cart, addToCart, getTotalAmount, getTotalItems } = useCustomerCartStore();
//   const { 
//     items: menuItems,
//     categories,
//     fetchAll,
//     getFilteredItems 
//   } = useMenuStore();

//   const { orders } = useCustomerOrderStore();

//   const [showCart, setShowCart] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [selectedTopCategory, setSelectedTopCategory] = useState<string>("All");

//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);

//   const cartTotal = getTotalAmount();
//   const cartItemCount = getTotalItems();

//   // Check if there's an existing order for this table
//   const existingTableOrder = tableCode 
//     ? orders.find(o => 
//         o.tableCode?.toLowerCase() === tableCode.toLowerCase() && 
//         o.status !== 'completed'
//       )
//     : null;

//   // Enhanced filtering with both top categories and admin categories
//   const filteredItems = menuItems.filter((item) => {
//     // Top visual category filter
//     const matchesTop =
//       selectedTopCategory === "All"
//         ? true
//         : item.category === selectedTopCategory;

//     // Primary admin category filter
//     const matchesCat =
//       selectedCategory === "All" ? true : item.category === selectedCategory;

//     // Search filter
//     const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

//     return matchesTop && matchesCat && matchesSearch;
//   });

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow sticky top-0 z-30">
//         <div className="max-w-7xl mx-auto px-4 lg:px-8">
//           <div className="flex items-center justify-between h-16 lg:h-20">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => navigate('/')}
//                 className="lg:hidden"
//               >
//                 <ArrowLeft className="w-6 h-6" />
//               </button>
//               <div className="text-3xl lg:text-4xl">🍽️</div>
//               <div>
//                 <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
//                   Chiyaholic Bhairahawa
//                 </h1>
//                 {tableCode ? (
//                   <p className="text-xs lg:text-sm text-gray-600">
//                     Table: <span className="font-bold text-orange-600">{tableCode.toUpperCase()}</span>
//                   </p>
//                 ) : (
//                   <p className="text-xs lg:text-sm text-gray-600">⭐ 77°C</p>
//                 )}
//               </div>
//             </div>

//             <button
//               onClick={() => setShowCart(!showCart)}
//               className="relative p-2 lg:p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
//             >
//               <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
//               {cartItemCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
//                   {cartItemCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Top Category Images */}
//         <div className="bg-white border-b">
//           <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex gap-4 overflow-x-auto scrollbar-hide">
//             {TOP_CATEGORIES.map((cat) => (
//               <button
//                 key={cat.name}
//                 onClick={() => setSelectedTopCategory(cat.name)}
//                 className={`flex flex-col items-center gap-1 min-w-[70px] p-2 rounded-lg transition-all ${
//                   selectedTopCategory === cat.name
//                     ? "bg-orange-600 text-white"
//                     : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                 }`}
//               >
//                 <span className="text-2xl">{cat.icon}</span>
//                 <span className="text-xs font-medium text-center">{cat.name}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Search + Category Filter */}
//         <div className="bg-white border-b">
//           <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col lg:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search menu items..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//               />
//             </div>
//             <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
//               {/* Category buttons using admin's categories */}
//               <button
//                 onClick={() => setSelectedCategory("All")}
//                 className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
//                   selectedCategory === "All"
//                     ? "bg-orange-600 text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 All
//               </button>

//               {categories
//                 .filter((cat) => !!cat && cat !== "All")
//                 .map((cat) => (
//                   <button
//                     key={cat}
//                     onClick={() => setSelectedCategory(cat)}
//                     className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
//                       selectedCategory === cat
//                         ? "bg-orange-600 text-white"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                   >
//                     {cat}
//                   </button>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Existing Order Alert */}
//       {existingTableOrder && (
//         <div className="bg-blue-50 border-l-4 border-blue-500 p-4 max-w-7xl mx-auto mt-4 mx-4 lg:mx-8">
//           <div className="flex items-start">
//             <div className="flex-shrink-0">
//               <ShoppingCart className="h-5 w-5 text-blue-500" />
//             </div>
//             <div className="ml-3 flex-1">
//               <p className="text-sm text-blue-700">
//                 You have an active order: <strong>#{existingTableOrder.orderNumber}</strong>
//               </p>
//               <p className="text-xs text-blue-600 mt-1">
//                 Total: Rs. {existingTableOrder.totalAmount} | Items will be added to this order
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Menu Grid */}
//       <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {filteredItems.map((item) => {
//           const imgProps = getImageProps(item.image, item.name);
//           return (
//             <div
//               key={item.id}
//               className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2 hover:shadow-2xl transition-all"
//             >
//               {/* Star and Availability Toggle */}
//               <div className="flex items-center gap-2 justify-end mb-1">
//                 {item.isSpecial && (
//                   <Star
//                     className="w-5 h-5"
//                     color="#fbbf24"
//                     stroke="#fbbf24"
//                     fill="#facc15"
//                     style={{ filter: "drop-shadow(0 1px 1px #eab30890)" }}
//                     aria-label="Special item"
//                   />
//                 )}
//                 {item.isAvailable ? (
//                   <ToggleRight className="w-5 h-5 text-green-500" aria-label="Available" />
//                 ) : (
//                   <ToggleLeft className="w-5 h-5 text-gray-400" aria-label="Unavailable" />
//                 )}
//               </div>

//               {/* Image */}
//               <div className="text-4xl text-center">
//                 {imgProps.type === "emoji" ? (
//                   imgProps.value
//                 ) : imgProps.type === "image" ? (
//                   <img src={imgProps.url} alt={imgProps.alt || item.name} className="mx-auto w-16 h-16" />
//                 ) : (
//                   "🍽️"
//                 )}
//               </div>

//               {/* Item info */}
//               <h3 className="font-bold text-lg truncate">{item.name}</h3>
//               <p className="text-xs text-gray-500">{item.category}</p>
//               <p className="text-orange-600 font-bold text-lg">Rs. {item.price}</p>
//               <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>

//               <button
//                 onClick={() => addToCart(item)}
//                 disabled={!item.isAvailable}
//                 className="mt-auto w-full py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
//               >
//                 {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
//               </button>
//             </div>
//           );
//         })}
//       </div>

//       {/* Cart Sidebar */}
//       {showCart && (
//         <CartSidebar
//           setShowCart={setShowCart}
//           tableCode={tableCode}
//           existingOrder={existingTableOrder}
//         />
//       )}
//     </div>
//   );
// };

// export default CustomerMenuView;



import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, X, Plus, Minus, Trash2, Check, Clock, ChefHat, Package, ArrowLeft, MapPin } from "lucide-react";
import { useMenuStore } from "../../store/useMenuStore";
import { useCustomerOrderStore } from "../../store/useCustomerOrderStore";
import type { MenuItem } from "../../types/menu";
import { useCustomerCartStore } from "../../store/useCustomerCartStore";

// Top category images (these are just for display, user picks from all admin categories)
const TOP_CATEGORIES = [
  { name: "All", icon: "🍽️" },
  { name: "Tea", icon: "🍵" },
  { name: "Drinks", icon: "🥤" },
  { name: "Snacks", icon: "🍜" },
  { name: "Chatpatey Items", icon: "🌶️" },
  { name: "Rice", icon: "🍛" },
  { name: "Momo", icon: "🥟" },
];

// The correct type for image can be inferred, fallback to string
function getImageProps(image: any, name: string) {
  if (!image) return { type: "none" };
  if (typeof image === "string") {
    return { type: "emoji", value: image };
  }
  if (typeof image === "object" && typeof image.url === "string") {
    return { type: "image", url: image.url, alt: (image.alt as string) || name };
  }
  return { type: "none" };
}

const CustomerMenuView: React.FC = () => {
  const { tableId } = useParams<{ tableId?: string }>();
  const navigate = useNavigate();

  // Import categories and raw items from menu store
  const { getFilteredItems, fetchAll, categories, items } = useMenuStore();

  // Import order store
  const {
    orders,
    createOrder,
    // updateExistingOrder
  } = useCustomerOrderStore();

  // Use custom cart store (Zustand)
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalAmount,
    getTotalItems
  } = useCustomerCartStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTopCategory, setSelectedTopCategory] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // On mount, fetch menu items
  useEffect(() => {
    fetchAll().catch(err => console.error("Failed to fetch menu:", err));
  }, []);

  // Find active order for this table (if any)
  const activeOrder = orders.find(
    (o) =>
      o.tableCode?.toLowerCase() === tableId?.toLowerCase() &&
      !["paid", "cancelled"].includes(o.status)
  );

  // Place order function - submit cart to API (via customStore)
  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items to place an order.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Create order payload - pass full cart items (MenuItem & { quantity })
      const orderPayload = {
        items: cart, // cart is already (MenuItem & { quantity })[]
        customerType: (tableId ? "DINE-IN" : "ONLINE") as "DINE-IN" | "ONLINE",
        tableCode: tableId ? tableId.toUpperCase() : undefined,
      };

      // Call createOrder from store
      const orderResult = await createOrder(orderPayload);

      if (orderResult) {
        setCurrentOrder(orderResult);
        clearCart();
        setShowCart(false);
        setShowOrderSuccess(true);

        // Refresh orders list to show the new order
        // The store will automatically update
      } else {
        throw new Error("Order creation failed - no response from server");
      }
    } catch (error: any) {
      console.error("Error placing order:", error);
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        "Failed to place order. Please try again.";
      alert(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Filtered menu items based on top category, search, and admin's category
  const filteredItems = items.filter((item) => {
    // Top visual category filter (optional visual for users)
    const matchesTop =
      !selectedTopCategory || selectedTopCategory === "All"
        ? true
        : item.category === selectedTopCategory;

    // Primary admin category filter
    const matchesCat =
      selectedCategory === "All" ? true : item.category === selectedCategory;

    // Search filter
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesTop && matchesCat && matchesSearch;
  });

  // Get order status details
  const getOrderStatusDetails = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          text: "Order Received",
          color: "text-blue-600",
          bg: "bg-blue-100",
        };
      case "preparing":
        return {
          icon: ChefHat,
          text: "Preparing",
          color: "text-orange-600",
          bg: "bg-orange-100",
        };
      case "served":
        return {
          icon: ChefHat,
          text: "Served",
          color: "text-green-600",
          bg: "bg-green-100",
        };
      case "paid":
        return {
          icon: Check,
          text: "Paid",
          color: "text-gray-600",
          bg: "bg-gray-100",
        };
      default:
        return {
          icon: Clock,
          text: "Unknown",
          color: "text-gray-400",
          bg: "bg-gray-100"
        }
    }
  };

  // Cart totals (from custom store selectors)
  const cartTotal = getTotalAmount();
  const cartItemCount = getTotalItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex justify-between items-center h-16 lg:h-20">
          <div className="flex items-center gap-4">
            {!tableId && (
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <div className="text-3xl lg:text-4xl">🍽️</div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Chiyaholic Bhairahawa
              </h1>
              {tableId ? (
                <div className="flex items-center gap-1 text-xs lg:text-sm">
                  <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-orange-600" />
                  <span className="text-gray-600">Table: </span>
                  <span className="font-bold text-orange-600">
                    {tableId.toUpperCase()}
                  </span>
                </div>
              ) : (
                <p className="text-xs lg:text-sm text-gray-600">⭐ 77°C</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {orders.filter((o) =>
              tableId
                ? o.tableCode?.toLowerCase() === tableId.toLowerCase()
                : true
            ).length > 0 && (
                <button
                  onClick={() => setShowOrderTracking(true)}
                  className="relative p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Package className="w-5 h-5 lg:w-6 lg:h-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    {orders.filter(
                      (o) =>
                        (tableId
                          ? o.tableCode?.toLowerCase() ===
                          tableId.toLowerCase()
                          : true) && !["paid", "cancelled"].includes(o.status)
                    ).length}
                  </span>
                </button>
              )}
            <button
              onClick={() => setShowCart((s) => !s)}
              className="relative p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Order Alert for this Table */}
        {activeOrder && (
          <div className="bg-blue-50 border-b border-blue-200">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900">
                    Active Order:{" "}
                    <span className="text-orange-600">
                      {activeOrder.orderNumber}
                    </span>
                  </p>
                  <p className="text-xs text-blue-700">
                    {activeOrder.items.length} items • Rs.{" "}
                    {activeOrder.totalAmount} •
                    <span className="ml-1 font-medium">
                      {activeOrder.status === "pending" && "⏳ Pending"}
                      {activeOrder.status === "preparing" && "👨‍🍳 Preparing"}
                      {activeOrder.status === "served" && "🍽️ Served"}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderTracking(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                >
                  Track
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Category Images */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex gap-4 overflow-x-auto scrollbar-hide">
            {TOP_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedTopCategory(cat.name)}
                className={`flex flex-col items-center gap-1 min-w-[70px] p-2 rounded-lg transition-all ${selectedTopCategory === cat.name
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-center">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search + Category Filter */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <button
                key="All"
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedCategory === "All"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All
              </button>

              {categories
                .filter((cat) => !!cat && cat.categoryName !== "All")
                .map((cat) => (
                  <button
                    key={cat.categoryId}
                    onClick={() => setSelectedCategory(cat.categoryName)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedCategory === cat.categoryName
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {cat.categoryName}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </header>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const imgProps = getImageProps(item.image, item.name);
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2 hover:shadow-2xl transition-all"
            >

              {/* Image */}
              <div className="text-4xl text-center">
                {imgProps.type === "emoji" ? (
                  imgProps.value
                ) : imgProps.type === "image" ? (
                  <img src={imgProps.url} alt={imgProps.alt || item.name} className="mx-auto w-16 h-16" />
                ) : (
                  "🍽️"
                )}
              </div>

              {/* Item info */}
              <h3 className="font-bold text-lg truncate">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.category}</p>
              <p className="text-orange-600 font-bold text-lg">Rs. {item.price}</p>
              <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>

              <button
                onClick={() => addToCart(item)}
                disabled={!item.isAvailable}
                className="mt-auto w-full py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                {item.isAvailable ? "Add to Cart" : "Unavailable"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Add items to get started</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-orange-600 font-bold">Rs. {item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <span className="ml-auto font-bold text-lg">
                            Rs. {item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">Rs. {cartTotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span className="text-orange-600">Rs. {cartTotal}</span>
                    </div>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={isPlacingOrder}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-lg transition-all disabled:bg-orange-400 disabled:cursor-not-allowed"
                  >
                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {showOrderSuccess && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {activeOrder ? "Order Updated!" : "Order Placed Successfully!"}
            </h2>
            <p className="text-gray-600 mb-4">
              {activeOrder
                ? "Your items have been added to your existing order"
                : "Your order has been received"}
            </p>
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-3xl font-bold text-orange-600">
                {currentOrder.orderNumber}
              </p>
              {tableId && (
                <div className="mt-2 flex items-center justify-center gap-1 text-sm">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600">Table: </span>
                  <span className="font-bold text-gray-900">
                    {tableId.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-semibold mb-2">Order Summary:</p>
              {/* Use CustomerOrder structure: currentOrder.items = {menuItemId, quantity}[] */}
              {/* Cannot render item name & price unless you fetch MenuItem or denormalize! For this example, skip the name or implement MenuItem lookup if needed */}
              {currentOrder.items.map((item: any) => (
                <div key={item.menuItemId || item.id} className="flex justify-between text-sm mb-1">
                  <span>
                    {/* Try to find the full MenuItem for name */}
                    {(() => {
                      const mi = allItems.find((m) => m.id === (item.menuItemId || item.id));
                      return mi ? `${mi.name} x${item.quantity}` : `x${item.quantity}`;
                    })()}
                  </span>
                  <span>
                    {(() => {
                      const mi = allItems.find((m) => m.id === (item.menuItemId || item.id));
                      return mi ? `Rs. ${mi.price * item.quantity}` : "";
                    })()}
                  </span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-orange-600">
                  Rs. {currentOrder.totalAmount}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowOrderSuccess(false);
                setShowOrderTracking(true);
              }}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold mb-3"
            >
              Track Order
            </button>
            <button
              onClick={() => setShowOrderSuccess(false)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {showOrderTracking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Order Tracking
              </h2>
              <button
                onClick={() => setShowOrderTracking(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {orders.filter((o) =>
                tableId
                  ? o.tableCode?.toLowerCase() === tableId.toLowerCase()
                  : true
              ).length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No orders yet</p>
                  {tableId && (
                    <p className="text-gray-400 text-sm mt-2">
                      for Table {tableId.toUpperCase()}
                    </p>
                  )}
                </div>
              ) : (
                orders
                  .filter((o) =>
                    tableId
                      ? o.tableCode?.toLowerCase() === tableId.toLowerCase()
                      : true
                  )
                  .map((order) => {
                    const statusDetails = getOrderStatusDetails(order.status);
                    const StatusIcon = statusDetails.icon;
                    return (
                      <div
                        key={order.orderId}
                        className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {order.orderNumber}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <span>
                                {typeof order.createdAt === "string"
                                  ? order.createdAt
                                  : ""}
                              </span>
                              {order.tableCode && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span className="font-semibold text-orange-600">
                                      Table {order.tableCode}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div
                            className={`${statusDetails.bg} ${statusDetails.color} px-4 py-2 rounded-full font-semibold flex items-center gap-2`}
                          >
                            <StatusIcon className="w-5 h-5" />
                            {statusDetails.text}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between mb-2">
                            <div
                              className={`flex flex-col items-center ${["pending", "preparing", "served", "paid"].includes(order.status)
                                ? "text-orange-600"
                                : "text-gray-400"
                                }`}
                            >
                              <Clock className="w-6 h-6 mb-1" />
                              <span className="text-xs">Received</span>
                            </div>
                            <div
                              className={`flex flex-col items-center ${["preparing", "served", "paid"].includes(order.status)
                                ? "text-orange-600"
                                : "text-gray-400"
                                }`}
                            >
                              <ChefHat className="w-6 h-6 mb-1" />
                              <span className="text-xs">Preparing</span>
                            </div>
                            <div
                              className={`flex flex-col items-center ${order.status === "paid" || order.status === "cancelled"
                                ? "text-gray-600"
                                : "text-gray-400"
                                }`}
                            >
                              <Check className="w-6 h-6 mb-1" />
                              <span className="text-xs">Paid</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${["paid", "cancelled"].includes(order.status)
                                ? "bg-gray-600 w-full"
                                : order.status === "served"
                                  ? "bg-green-600 w-3/4"
                                  : order.status === "preparing"
                                    ? "bg-orange-600 w-1/2"
                                    : "bg-blue-600 w-1/4"
                                }`}
                            />
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4">
                          <p className="font-semibold mb-2">Items:</p>
                          {/* Render each item in order.items (menuItemId, quantity) */}
                          {order.items.map((item: any) => {
                            // lookup MenuItem for info
                            const mi = allItems.find(
                              (m) => m.id === (item.menuItemId || item.id)
                            );
                            return (
                              <div
                                key={item.menuItemId || item.id}
                                className="flex justify-between text-sm mb-1"
                              >
                                <span>
                                  {mi ? `${mi.name} x${item.quantity}` : `x${item.quantity}`}
                                </span>
                                <span>
                                  {mi ? `Rs. ${mi.price * item.quantity}` : ""}
                                </span>
                              </div>
                            );
                          })}
                          <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-orange-600">
                              Rs. {order.totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMenuView;
