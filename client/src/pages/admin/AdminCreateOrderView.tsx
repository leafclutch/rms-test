import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useMenuStore } from '../../store/useMenuStore';
import { useCartStore } from '../../store/useCartStore';
import { createOrder } from '../../api/orders';
import axios from 'axios';
import type { MenuItem } from '../../types/menu';
import { ShoppingCart } from 'lucide-react';

// Types for product.image
type ProductImage =
    | string
    | {
        url: string;
        alt?: string;
    }
    | undefined
    | null;

const AdminCreateOrderView: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { table } = state || {};

    const { fetchAll, categories, items: menuItems } = useMenuStore();
    const { items: cartItems, addItem, removeItem, updateQuantity, clearCart, getTotalAmount } = useCartStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        fetchAll().catch(err => console.error('Failed to fetch menu:', err));
    }, [fetchAll]);

    if (!table) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <p className="text-red-600 font-semibold">No table selected. Please go back and select a table.</p>
                <button onClick={() => navigate('/admin/orders')} className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition-colors">
                    Go Back to Orders
                </button>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        setIsPlacingOrder(true);
        try {
            const orderPayload = {
                items: cartItems.map(item => ({ menuItemId: item.id, quantity: item.quantity })),
                customerType: table.tableCode === 'Walk-in' ? 'WALK_IN' : 'DINE_IN' as 'WALK_IN' | 'DINE_IN',
                tableCode: table.tableCode,
            };
            await createOrder(orderPayload);
            clearCart();
            navigate('/admin/orders');
        } catch (error: unknown) {
            console.error('Error placing order:', error);
            let message = 'Failed to place order.';
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            alert(message);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const filteredItems = menuItems.filter(item => {
        const matchesCat = selectedCategory === 'All' ? true : item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    /**
     * Returns the JSX for displaying the image emoji or an img tag.
     */
    function renderProductImage(imageField: ProductImage, productName: string) {
        if (!imageField) {
            return '🍽️';
        }
        if (typeof imageField === 'string') {
            return imageField;
        }
        if (
            typeof imageField === 'object' &&
            typeof imageField.url === 'string'
        ) {
            return (
                <img
                    src={imageField.url}
                    alt={imageField.alt || productName}
                    className="w-12 h-12 rounded-lg object-cover"
                />
            );
        }
        return '🍽️';
    }

    const categoryOptions = [
        { categoryId: 'all', categoryName: 'All' },
        ...(categories ?? []),
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Create Order: <span className="text-orange-600">{table.tableCode}</span></h1>
                    </div>
                </header>

                <div className="p-4 space-y-4">
                    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Menu</h3>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 focus:border-orange-500 focus:outline-none"
                            />
                        </div>
                        <select
                            className="w-full p-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 focus:border-orange-500 focus:outline-none"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            disabled={!!searchQuery.trim()}
                        >
                            {categoryOptions.map((cat) => (
                                <option key={cat.categoryId || (typeof cat === 'string' ? cat : '')} value={cat.categoryName || (typeof cat === 'string' ? cat : '')}>
                                    {cat.categoryName || (typeof cat === 'string' ? cat : '')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto p-4 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 pb-2 border-b-2">Menu Items</h2>
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p className="text-lg">No items available</p>
                        </div>
                    ) : (
                        filteredItems.map((item: MenuItem) => (
                            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border hover:shadow-md transition">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4 items-center">
                                        <span className="text-3xl">
                                            {renderProductImage(item.image as ProductImage, item.name)}
                                        </span>
                                        <div>
                                            <h4 className="font-bold text-lg flex items-center gap-2">
                                                {item.name} <span>{item.isVeg ? '🟢' : '🔴'}</span>
                                            </h4>
                                            <p className="text-xs text-gray-500">{item.category}</p>
                                            <p className="text-orange-600 font-bold mt-1">Rs. {item.price}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addItem(item)}
                                        disabled={!item.isAvailable}
                                        className="px-5 py-2 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 disabled:bg-gray-300 transition-colors"
                                    >
                                        {item.isAvailable ? 'Add' : 'Unavailable'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </main>
            </div>

            <aside className="w-80 bg-white shadow-lg flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {cartItems.length === 0 ? (
                        <p className="text-gray-500 text-center mt-8">Cart is empty</p>
                    ) : cartItems.map(item => (
                        <div key={item.id} className="flex items-center mb-4 bg-gray-50 p-2 rounded-lg">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-600">Rs. {item.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><Minus className="w-4 h-4" /></button>
                                <span className="font-bold w-6 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><Plus className="w-4 h-4" /></button>
                                <button onClick={() => removeItem(item.id)} className="p-1 rounded-full hover:bg-red-100"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t bg-white">
                    <div className="flex justify-between font-bold text-xl mb-4">
                        <span>Total</span>
                        <span>Rs. {getTotalAmount()}</span>
                    </div>
                    <button onClick={handlePlaceOrder} disabled={isPlacingOrder || cartItems.length === 0} className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition-colors">
                        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default AdminCreateOrderView;
