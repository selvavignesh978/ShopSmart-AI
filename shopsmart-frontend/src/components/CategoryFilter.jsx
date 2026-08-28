import React from 'react';

export default function CategoryFilter({ activeCategory, setActiveCategory }) {
  const categories = ["All", "Electronics", "Fashion", "Home"];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${
            activeCategory === cat
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}