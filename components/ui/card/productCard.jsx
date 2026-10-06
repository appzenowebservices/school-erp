import { IconButton } from "../button/iconButton";
import { IoMdCart } from "react-icons/io";
//=========================================================================================

const IngredientTag = ({ label, color, emoji }) => (
  <span className={`px-2 py-0.5 text-xs rounded-full ${color} whitespace-nowrap`}>
    {emoji} {label}
  </span>
);
//=========================================================================================

export default function ProductCard({ setShowModal }) {
  const ingredients = [
    { label: "Avocado", color: "bg-orange-100 text-orange-700", emoji: "🥑" },
    { label: "Garlic", color: "bg-purple-100 text-purple-700", emoji: "🧄" },
    { label: "Craft Bread", color: "bg-yellow-100 text-yellow-700", emoji: "🍞" },
  ];
//=========================================================================================

  return (
    <div className="bg-background p-3 rounded-lg shadow max-w-xs w-full mx-auto">
      <div

        className="grid grid-cols-2 gap-4">
        <img
          src="/products/product.jpg"
          alt="Avocado Sandwich"
          className="w-full h-32 object-cover rounded-lg col-span-2"
        />
        <div className="col-span-2 text-center">
          <h2 className="text-xl font-semibold m-3 text-primary-text">
            Avocado Sandwich
          </h2>
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {ingredients.map((item, index) => (
              <IngredientTag key={index} {...item} />
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-2">
            Delicious, healthy, and perfect for breakfast!
          </p>
        </div>
        <div className="flex items-center justify-between col-span-2 mt-4">
          {/* <span className="text-sm text-gray-500">In Stock</span> */}
          <span className="inline-block bg-green-100 text-green-500 text-md font-semibold px-3 py-1 rounded-md shadow-sm">
            ₹ 350
          </span>
          <IconButton
            onClick={() => setShowModal(true)}
          >
            <IoMdCart size={18} className="mr-2" />
            Add to Cart
          </IconButton>
        </div>
      </div>
    </div>
  );
}
//=========================================================================================
