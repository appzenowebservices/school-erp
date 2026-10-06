import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaArchive, FaDollarSign, FaEdit, FaGift, FaProductHunt, FaRegCheckCircle, FaShoppingCart, FaTag, FaUsers, FaWolfPackBattalion } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { MdSportsHockey } from "react-icons/md";

/**
 * Backdrop component with enhanced blur and fade animation
 */
const Backdrop = ({ onClose }) => (
    <div
        className="fixed inset-0 bg-gradient-to-br from-slate-900/80 to-gray-900/80 backdrop-blur-md z-50 animate-in fade-in duration-300"
        onClick={onClose}
    />
);

/**
 * Professional ModalContent component with modern design
 */
const ModalContent = ({ onClose, product }) => {
    const router = useRouter()
    const handleEditProduct = (productId) => {
        router.push(`/edit-product/${productId}`);
    };

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { text: 'Out of Stock', color: 'bg-red-500/10 text-red-700 border-red-200', icon: AlertCircle };
        if (quantity < 10) return { text: 'Low Stock', color: 'bg-amber-500/10 text-amber-700 border-amber-200', icon: AlertCircle };
        return { text: 'In Stock', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200', icon: <FaRegCheckCircle /> };
    };

    const stockStatus = getStockStatus(product.stockQuantity);
    const StockIcon = stockStatus.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in zoom-in-95 duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden relative border border-gray-100">
                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                                <FaWolfPackBattalion className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                                <p className="text-sm text-gray-600 mt-1">Comprehensive product information</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={()=>handleEditProduct(product._id)}
                                className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                            >
                                <FaEdit size={18} />
                                <span>Edit Product</span>
                            </button>
                            <button
                                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all duration-200 shadow-sm"
                                onClick={onClose}
                            >
                                <FaX size={22} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
                    <div className="p-8 space-y-8">
                        {/* Hero Product Section */}
                        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-200">
                            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                                <div className="flex-shrink-0">
                                    <div className="relative group">
                                        <img
                                            src={product.images[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center"}
                                            alt={product.name}
                                            className="w-48 h-48 object-cover rounded-2xl border-2 border-white shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-6 text-center lg:text-left">
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h3>
                                        <p className="text-gray-600 text-lg leading-relaxed">{product.description || "No description available."}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6">
                                        <div className="text-center lg:text-left">
                                            <div className="text-4xl font-bold text-green-600 mb-2">${product.price?.toFixed(2)}</div>
                                            <div className="text-sm text-gray-500">Selling Price</div>
                                        </div>
                                        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 ${stockStatus.color} font-semibold`}>
                                            <MdSportsHockey size={20} />
                                            {stockStatus.text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FaTag className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">SKU</div>
                                </div>
                                <div className="text-xl font-bold text-gray-900">{product.sku || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <FaArchive className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">Category</div>
                                </div>
                                <div className="text-xl font-bold text-gray-900">{product.category || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FaShoppingCart className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">Stock Quantity</div>
                                </div>
                                <div className="text-xl font-bold text-gray-900">{product.stockQuantity ?? 0}</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <FaDollarSign className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">Cost Price</div>
                                </div>
                                <div className="text-xl font-bold text-gray-900">${product.costPrice?.toFixed(2) || '0.00'}</div>
                            </div>
                        </div>

                        {/* Product Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-100 rounded-xl">
                                            <FaUsers className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-gray-900">Product Variants</h4>
                                            <p className="text-gray-600">Available variations of this product</p>
                                        </div>
                                        <div className="bg-indigo-100 text-indigo-800 text-sm px-3 py-2 rounded-full font-semibold">
                                            {product.variants.length} variants
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    {product.variants.map((variant, index) => (
                                        <div key={index} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                            <div className="flex-1">
                                                <div className="text-lg font-semibold text-gray-900 mb-1">{variant.name}</div>
                                                {variant.description && (
                                                    <div className="text-gray-600">{variant.description}</div>
                                                )}
                                            </div>
                                            <div className="text-left lg:text-right mt-3 lg:mt-0">
                                                <div className="text-xl font-bold text-green-600">${variant.price?.toFixed(2)}</div>
                                                <div className="text-sm text-gray-500">Stock: {variant.stock ?? 0} units</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Combo Offers */}
                        {product.combos && product.combos.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-purple-100 rounded-xl">
                                            <FaGift className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-gray-900">Combo Offers</h4>
                                            <p className="text-gray-600">Special bundle deals and packages</p>
                                        </div>
                                        <div className="bg-purple-100 text-purple-800 text-sm px-3 py-2 rounded-full font-semibold">
                                            {product.combos.length} offers
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    {product.combos.map((combo, index) => (
                                        <div key={index} className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-xl font-bold text-gray-900">{combo.name}</div>
                                                <div className="text-2xl font-bold text-purple-600">${combo.price?.toFixed(2)}</div>
                                            </div>
                                            {combo.items && combo.items.length > 0 && (
                                                <div className="space-y-3 mb-4">
                                                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Bundle Includes:</div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {combo.items.map((item, itemIndex) => (
                                                            <div key={itemIndex} className="flex items-center justify-between bg-white/80 p-3 rounded-lg">
                                                                <span className="font-medium text-gray-900">• {item.name}</span>
                                                                <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Qty: {item.quantity ?? 1}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {combo.discount && (
                                                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                                                    <FaGift size={16} />
                                                    Save {combo.discount}%
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags Section */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h4 className="text-xl font-bold text-gray-900 mb-4">Product Tags</h4>
                                <div className="flex flex-wrap gap-3">
                                    {product.tags.map((tag, index) => (
                                        <span key={index} className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200 cursor-pointer">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Main InventoryDetailModal component
 */
const InventoryDetailModal = ({ isOpen, onClose, product }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen || !product) {
        return null;
    }

    return createPortal(
        <>
            <Backdrop onClose={onClose} />
            <ModalContent onClose={onClose} product={product} />
        </>,
        document.body
    );
};

export default function ProductDetailModal({ isOpen, onClose, product }) {

    const [isModalOpen, setIsModalOpen] = useState(false);

 

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-8">


            <InventoryDetailModal
                isOpen={isOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
            />
        </div>
    );
}