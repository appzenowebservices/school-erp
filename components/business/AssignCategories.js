import React, { useState } from "react";

const CATEGORY_DATA = {
  "Chicken, Meat & Fish": [
    { name: "Exotic Meat", icon: "🍖" },
    { name: "Fish & Seafood", icon: "🐟" },
    { name: "Chicken", icon: "🍗" },
    { name: "Mutton", icon: "🥩" },
    { name: "Sausage, Salami & Ham", icon: "🌭" },
  ],
  "Pet Care": [
    { name: "Dog Food & Treats", icon: "🐶" },
    { name: "Cat Food & Treats", icon: "🐱" },
    { name: "Pet Grooming & Accessories", icon: "🛁" },
    { name: "Pet Health & Supplements", icon: "💊" },
    { name: "Pet Toys", icon: "🧸" },
  ],
  "Baby Care": [
    { name: "Baby Diapers", icon: "🧷" },
    { name: "Baby Feeding Needs", icon: "🍼" },
    { name: "Baby Wipes", icon: "🧻" },
    { name: "Baby Bathing Needs", icon: "🛁" },
    { name: "Baby Skin & Hair Care", icon: "🧴" },
  ],
  "Magazines": [
    { name: "Current Affairs & Business", icon: "📰" },
    { name: "Children's Books", icon: "📚" },
    { name: "Lifestyle Books", icon: "📖" },
    { name: "Hobby Books", icon: "🎨" },
  ],
  "Sweet Tooth": [
    { name: "Flavoured Yogurts", icon: "🍦" },
    { name: "Ice Cream & Frozen Dessert", icon: "🍨" },
    { name: "Indian Sweets", icon: "🍬" },
    { name: "Chocolates", icon: "🍫" },
    { name: "Candies & Gum", icon: "🍭" },
  ],
  "Tea, Coffee & Health Drinks": [
    { name: "Tea", icon: "🍵" },
    { name: "Coffee", icon: "☕" },
    { name: "Health Drinks", icon: "🥤" },
    { name: "Vegan Drinks", icon: "🌱" },
  ],
  "Beauty & Cosmetics": [
    { name: "Hair Care", icon: "💇" },
    { name: "Beauty and Makeup", icon: "💄" },
    { name: "Fragrances", icon: "🌸" },
    { name: "Women's Grooming", icon: "👩" },
  ],
  "Dairy, Bread & Eggs": [
    { name: "Milk", icon: "🥛" },
    { name: "Cheese", icon: "🧀" },
    { name: "Butter & More", icon: "🧈" },
    { name: "Eggs", icon: "🥚" },
    { name: "Bread", icon: "🍞" },
  ],
  "Breakfast & Instant Food": [
    { name: "Breakfast Cereal", icon: "🥣" },
    { name: "Noodles", icon: "🍜" },
    { name: "Instant Mixes", icon: "🍲" },
    { name: "Ready to Eat", icon: "🍱" },
  ],
  "Atta, Rice & Dal": [
    { name: "Atta, Flours & Sooji", icon: "🌾" },
    { name: "Rice & Rice Products", icon: "🍚" },
    { name: "Pulses", icon: "🫘" },
    { name: "Spices & Masalas", icon: "🧂" },
  ],
  "Cleaning Essentials": [
    { name: "Detergent Powder & Bars", icon: "🧼" },
    { name: "Toilet Cleaners", icon: "🚽" },
    { name: "Dishwashing Gels & Powders", icon: "🍽️" },
    { name: "Air Fresheners", icon: "🌬️" },
  ],
  "Digital Goods": [
    { name: "Antivirus", icon: "🛡️" },
    { name: "System Utilities", icon: "💻" },
  ],
  "Personal Care": [
    { name: "Shampoo & Conditioner", icon: "🧴" },
    { name: "Body Moisturizers", icon: "🧴" },
    { name: "Men's Grooming", icon: "🧔" },
    { name: "Oral Care", icon: "🦷" },
  ],
  "Organic & Gourmet": [
    { name: "Snacks & Munchies", icon: "🥜" },
    { name: "Healthy Proteins", icon: "🍗" },
    { name: "Oil & Ghee", icon: "🛢️" },
    { name: "Dry Fruits, Nuts & Seeds", icon: "🥥" },
  ],
};


export default function AssignCategories() {
  const [retailerType, setRetailerType] = useState("Beauty & Hygiene");

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded-xl space-y-4">
      <h2 className="text-2xl font-bold">Assign Categories</h2>

      <div>
        <label className="block font-medium mb-1">Retailer Type</label>
        <select
          value={retailerType}
          onChange={(e) => setRetailerType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {Object.keys(CATEGORY_DATA)?.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        <div className="space-y-2">
          {CATEGORY_DATA[retailerType]?.map((category) => (
            <div
              key={category.name}
              className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50"
            >
              <span className="text-xl">{category.icon}</span>
              <span className="text-base">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
