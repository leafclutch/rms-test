import React from 'react';
import type { MenuItem } from '../../types/menu';

interface MenuProps {
  category: string;
  items: MenuItem[];
  addToCart: (item: MenuItem) => void;
}

const Menu: React.FC<MenuProps> = ({ category, items, addToCart }) => {
  return (
    <div key={category} className="mb-8 lg:mb-12">
      <h2 className="text-xl lg:text-2xl font-bold text-orange-600 mb-4 lg:mb-6">
        {category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100"
          >
            <div className="p-4 lg:p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl lg:text-5xl">{item.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base lg:text-lg truncate">
                      {item.name}
                    </h3>
                    <span className="text-lg flex-shrink-0">
                      {item.isVeg ? '🟢' : '🔴'}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs lg:text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-orange-600 font-bold text-lg lg:text-xl">
                      Rs. {item.price}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.isAvailable}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm lg:text-base"
                    >
                      {item.isAvailable ? 'Add' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu
