// components/inventory/InventoryTable.jsx
import React from 'react';
import { moduleIcons, categoryIcons, commonIcons } from '../constants/icons'; // Adjust path as needed

const { FaCheckIcon, FaTimesIcon } = commonIcons;

const InventoryTable = ({
    inventory,
    handleProductClick,
    columns
}) => {
    const getStockStatusColor = (stockLevel) => {
        if (stockLevel > 20) return 'bg-green-500';
        if (stockLevel > 10) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="md:col-span-6 bg-white rounded-xl shadow-md">
            <div className="w-[260px] sm:w-full md:w-[700px] lg:w-full overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>

                            {columns?.map((head) => (
                                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{head}</th>))}

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {inventory.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => handleProductClick(item)}
                            >
                                <td className="whitespace-nowrap px-4 py-4 flex items-center">
                                    <div className="flex items-center gap-1 mr-3">
                                        {item?.images?.slice(0, 3).map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={typeof img === "string" ? img : img.url || img.src}
                                                alt={item.name}
                                                className="w-8 h-8 rounded object-cover border border-gray-200"
                                            />
                                        ))}
                                        {item?.images?.length > 3 && (
                                            <span className="ml-1 text-xs bg-gray-200 rounded-full px-2 py-0.5 text-gray-700">
                                                +{item.images.length - 3}
                                            </span>
                                        )}
                                    </div>
                                    <div className="font-medium text-gray-900">{item.name}</div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">
                                    <div className="text-sm text-gray-500 font-mono">{item.sku}</div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">
                                    <div className="text-xs text-gray-500 flex items-center">
                                        {item.categoryId?.module?.name && moduleIcons[item.categoryId.module.name] && <span className="mr-1">{moduleIcons[item.categoryId.module.name]}</span>}
                                        {item.categoryId?.module?.name}
                                    </div>
                                    <div className="mt-1">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {item?.categoryId?.name && categoryIcons[item.categoryId.name] && <span className="mr-1">{categoryIcons[item.categoryId.name]}</span>}
                                            {item?.categoryId?.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">
                                    <div className="text-sm font-medium text-gray-900">₹{item.price}</div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${getStockStatusColor(item.stock)}`}></div>
                                        <span className="text-sm text-gray-700">{item.stock}</span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {item.status === 'active'
                                            ? <FaCheckIcon size={10} className="mr-1" />
                                            : <FaTimesIcon size={10} className="mr-1" />}
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryTable;