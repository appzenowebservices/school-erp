import { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import ConfirmationVendorAssigningStoreDialogueBox from '../status/Confirmation';

export default function VendorProfileDrawer() {
    const [confirmAssign, setConfirmAssign] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('info');
    const [status, setStatus] = useState('Pending');

    const inventory = [
        { name: 'Aata Wheat', status: 'Pending Review' },
        { name: 'Rice Premium', status: 'Approved' },
        { name: 'Atta Chakki', status: 'Rejected' },
    ];

    const toggleDrawer = () => setIsOpen(!isOpen);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
    };

    return (
        <>
            <div>
                {/* Trigger Button */}
                <button
                    onClick={toggleDrawer}
                    className="px-4 py-2 bg-accent text-white rounded-lg shadow hover:bg-accent/90"
                >
                    View Vendor Profile
                </button>

                {/* Slide Drawer */}
                <div
                    className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-background shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white shadow px-6 py-4 flex items-center justify-between border-b">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <IoIosArrowBack
                                className="cursor-pointer text-gray-600 hover:text-black"
                                onClick={toggleDrawer}
                            />
                            Fresh Mart — Profile
                        </div>
                    </div>

                    <div className="p-6 space-y-6">

                        {/* Tabs */}
                        <div className="border-b border-gray-200 flex space-x-6 pb-2 text-sm">
                            {['info', 'contact', 'links','dsf'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`font-medium ${activeTab === tab
                                        ? 'text-accent border-b-2 border-accent'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    {tab === 'info' && '📝 Basic Info'}
                                    {tab === 'contact' && '👤 Contact'}
                                    {tab === 'links' && '🔗 Links'}
                                    {tab === 'dsf' && '🔗 Ldddinks'}
                                </button>
                            ))}
                        </div>

                        {/* Vendor Status & Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-lg shadow">
                            <div>
                                <p className="text-gray-700 mb-2">
                                    Status: <span className="font-semibold">{status}</span>
                                </p>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleStatusChange('Approved')}
                                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('Rejected')}
                                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-700">
                                <p>
                                    <strong>Category:</strong> Kirana (editable)
                                </p>
                                <p>
                                    <strong>Region:</strong> Delhi-NCR
                                </p>
                                <p>
                                    <strong>Created:</strong> Apr 28, 2025
                                </p>
                            </div>
                        </div>

                        {/* Inventory Section */}
                        <div className="bg-white p-6 rounded-lg shadow space-y-4">
                            <h2 className="text-base font-semibold text-primary-text mb-2">
                                📂 Inventory ({inventory.length})
                            </h2>
                            {inventory.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between text-sm bg-gray-50 px-4 py-3 rounded-lg"
                                >
                                    <p>
                                        {item.name} –{' '}
                                        <span className="font-medium">{item.status}</span>
                                    </p>
                                    {item.status === 'Rejected' ? (
                                        <button className="text-blue-600 hover:underline">
                                            Feedback
                                        </button>
                                    ) : (
                                        <button className="text-blue-600 hover:underline">
                                            View
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                                Message Vendor
                            </button>
                            <button
                                onClick={() => setConfirmAssign(true)}
                                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">
                                Assign to Store
                            </button>
                            <button className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500">
                                Deactivate
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Confirmation Modal */}
            {confirmAssign && (
                <ConfirmationVendorAssigningStoreDialogueBox
                    title="Delete Lead?"
                    description={`Are you sure you want to delete ""?`}
                    // onConfirm={handleDelete}
                    onCancel={() => setConfirmAssign(false)}
                />
            )}
        </>


    );
}
