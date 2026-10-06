import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, Building2, Languages, Truck, 
  Home, Archive, Package, UserCheck, CreditCard,
  Plus, Edit3, Trash2, Search, Filter, Eye,
  ChevronLeft, ChevronRight, Save, X, Menu,
  Library, User, Building, Globe, ShoppingCart
} from 'lucide-react';

const LibraryERP = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Data state for each module
  const [authors, setAuthors] = useState([
    { id: 1, name: 'J.K. Rowling', nationality: 'British', booksCount: 7, dateAdded: '2024-01-15' },
    { id: 2, name: 'George Orwell', nationality: 'British', booksCount: 12, dateAdded: '2024-01-10' }
  ]);
  
  const [publishers, setPublishers] = useState([
    { id: 1, name: 'Penguin Books', country: 'UK', established: '1935', booksCount: 45 },
    { id: 2, name: 'HarperCollins', country: 'USA', established: '1989', booksCount: 32 }
  ]);
  
  const [categories, setCategories] = useState([
    { id: 1, name: 'Fiction', description: 'Fictional literature', booksCount: 156 },
    { id: 2, name: 'Science', description: 'Scientific books and journals', booksCount: 89 },
    { id: 3, name: 'History', description: 'Historical texts', booksCount: 67 }
  ]);
  
  const [languages, setLanguages] = useState([
    { id: 1, name: 'English', code: 'EN', booksCount: 245 },
    { id: 2, name: 'Hindi', code: 'HI', booksCount: 123 },
    { id: 3, name: 'French', code: 'FR', booksCount: 34 }
  ]);
  
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'BookWorld Ltd', contact: '+1-234-567-8900', email: 'info@bookworld.com', booksSupplied: 156 },
    { id: 2, name: 'Academic Press', contact: '+1-345-678-9012', email: 'sales@academicpress.com', booksSupplied: 89 }
  ]);
  
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Main Reading Hall', capacity: 100, floor: 'Ground Floor', status: 'Active' },
    { id: 2, name: 'Reference Section', capacity: 50, floor: 'First Floor', status: 'Active' },
    { id: 3, name: 'Digital Library', capacity: 30, floor: 'Second Floor', status: 'Under Maintenance' }
  ]);
  
  const [shelves, setShelves] = useState([
    { id: 1, shelfCode: 'A001', roomId: 1, roomName: 'Main Reading Hall', capacity: 200, currentBooks: 156 },
    { id: 2, shelfCode: 'B002', roomId: 2, roomName: 'Reference Section', capacity: 150, currentBooks: 89 }
  ]);
  
  const [racks, setRacks] = useState([
    { id: 1, rackCode: 'R001', shelfId: 1, shelfCode: 'A001', levels: 5, booksPerLevel: 40 },
    { id: 2, rackCode: 'R002', shelfId: 1, shelfCode: 'A001', levels: 4, booksPerLevel: 35 }
  ]);
  
  const [books, setBooks] = useState([
    { 
      id: 1, title: 'Harry Potter and the Philosopher\'s Stone', isbn: '978-0747532743', 
      authorId: 1, authorName: 'J.K. Rowling', publisherId: 1, publisherName: 'Penguin Books',
      categoryId: 1, categoryName: 'Fiction', languageId: 1, languageName: 'English',
      copies: 5, available: 3, rackId: 1, rackCode: 'R001'
    },
    { 
      id: 2, title: '1984', isbn: '978-0451524935', 
      authorId: 2, authorName: 'George Orwell', publisherId: 2, publisherName: 'HarperCollins',
      categoryId: 1, categoryName: 'Fiction', languageId: 1, languageName: 'English',
      copies: 3, available: 2, rackId: 2, rackCode: 'R002'
    }
  ]);
  
  const [borrowers, setBorrowers] = useState([
    { 
      id: 1, name: 'John Smith', studentId: 'STU001', class: '10th Grade', 
      contact: '+1-555-0123', email: 'john.smith@school.edu', booksIssued: 2, status: 'Active'
    },
    { 
      id: 2, name: 'Emily Johnson', studentId: 'STU002', class: '11th Grade', 
      contact: '+1-555-0124', email: 'emily.johnson@school.edu', booksIssued: 1, status: 'Active'
    }
  ]);
  
  const [fines, setFines] = useState([
    { 
      id: 1, borrowerId: 1, borrowerName: 'John Smith', bookTitle: 'Harry Potter', 
      issueDate: '2024-06-15', dueDate: '2024-06-29', returnDate: '2024-07-05', 
      fineAmount: 15, status: 'Paid'
    },
    { 
      id: 2, borrowerId: 2, borrowerName: 'Emily Johnson', bookTitle: '1984', 
      issueDate: '2024-07-01', dueDate: '2024-07-15', returnDate: null, 
      fineAmount: 25, status: 'Pending'
    }
  ]);

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: Library, color: 'bg-blue-500' },
    { id: 'authors', name: 'Authors', icon: User, color: 'bg-purple-500' },
    { id: 'publishers', name: 'Publishers', icon: Building, color: 'bg-green-500' },
    { id: 'categories', name: 'Categories', icon: Archive, color: 'bg-yellow-500' },
    { id: 'languages', name: 'Languages', icon: Globe, color: 'bg-red-500' },
    { id: 'suppliers', name: 'Suppliers', icon: ShoppingCart, color: 'bg-indigo-500' },
    { id: 'rooms', name: 'Rooms', icon: Building2, color: 'bg-pink-500' },
    { id: 'shelves', name: 'Shelves', icon: Archive, color: 'bg-teal-500' },
    { id: 'racks', name: 'Racks', icon: Package, color: 'bg-orange-500' },
    { id: 'books', name: 'Books', icon: BookOpen, color: 'bg-cyan-500' },
    { id: 'borrowers', name: 'Borrowers', icon: UserCheck, color: 'bg-lime-500' },
    { id: 'fines', name: 'Fine Collection', icon: CreditCard, color: 'bg-rose-500' }
  ];

  const getCurrentData = () => {
    const dataMap = {
      authors, publishers, categories, languages, suppliers,
      rooms, shelves, racks, books, borrowers, fines
    };
    return dataMap[activeModule] || [];
  };

  const getSetterFunction = () => {
    const setterMap = {
      authors: setAuthors, publishers: setPublishers, categories: setCategories,
      languages: setLanguages, suppliers: setSuppliers, rooms: setRooms,
      shelves: setShelves, racks: setRacks, books: setBooks,
      borrowers: setBorrowers, fines: setFines
    };
    return setterMap[activeModule];
  };

  const handleAdd = (formData) => {
    const setter = getSetterFunction();
    const newId = Math.max(...getCurrentData().map(item => item.id || 0)) + 1;
    setter(prev => [...prev, { id: newId, ...formData }]);
    setShowAddModal(false);
  };

  const handleEdit = (formData) => {
    const setter = getSetterFunction();
    setter(prev => prev.map(item => 
      item.id === editingItem.id ? { ...item, ...formData } : item
    ));
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const setter = getSetterFunction();
      setter(prev => prev.filter(item => item.id !== id));
    }
  };

  const filteredData = getCurrentData().filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Books</p>
            <p className="text-2xl font-bold">{books.reduce((sum, book) => sum + book.copies, 0)}</p>
          </div>
          <BookOpen className="w-8 h-8 text-blue-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Active Borrowers</p>
            <p className="text-2xl font-bold">{borrowers.filter(b => b.status === 'Active').length}</p>
          </div>
          <Users className="w-8 h-8 text-green-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">Books Issued</p>
            <p className="text-2xl font-bold">{borrowers.reduce((sum, b) => sum + b.booksIssued, 0)}</p>
          </div>
          <UserCheck className="w-8 h-8 text-orange-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm">Pending Fines</p>
            <p className="text-2xl font-bold">₹{fines.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.fineAmount, 0)}</p>
          </div>
          <CreditCard className="w-8 h-8 text-red-200" />
        </div>
      </div>
    </div>
  );

  const FormModal = ({ isEdit = false, onClose, onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState(initialData);

    const getFormFields = () => {
      const fieldConfigs = {
        authors: [
          { key: 'name', label: 'Author Name', type: 'text', required: true },
          { key: 'nationality', label: 'Nationality', type: 'text', required: true }
        ],
        publishers: [
          { key: 'name', label: 'Publisher Name', type: 'text', required: true },
          { key: 'country', label: 'Country', type: 'text', required: true },
          { key: 'established', label: 'Established Year', type: 'text', required: true }
        ],
        categories: [
          { key: 'name', label: 'Category Name', type: 'text', required: true },
          { key: 'description', label: 'Description', type: 'textarea', required: true }
        ],
        languages: [
          { key: 'name', label: 'Language Name', type: 'text', required: true },
          { key: 'code', label: 'Language Code', type: 'text', required: true }
        ],
        suppliers: [
          { key: 'name', label: 'Supplier Name', type: 'text', required: true },
          { key: 'contact', label: 'Contact Number', type: 'tel', required: true },
          { key: 'email', label: 'Email Address', type: 'email', required: true }
        ],
        rooms: [
          { key: 'name', label: 'Room Name', type: 'text', required: true },
          { key: 'capacity', label: 'Capacity', type: 'number', required: true },
          { key: 'floor', label: 'Floor', type: 'text', required: true },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Under Maintenance', 'Closed'], required: true }
        ],
        shelves: [
          { key: 'shelfCode', label: 'Shelf Code', type: 'text', required: true },
          { key: 'roomName', label: 'Room', type: 'text', required: true },
          { key: 'capacity', label: 'Capacity', type: 'number', required: true }
        ],
        racks: [
          { key: 'rackCode', label: 'Rack Code', type: 'text', required: true },
          { key: 'shelfCode', label: 'Shelf Code', type: 'text', required: true },
          { key: 'levels', label: 'Number of Levels', type: 'number', required: true },
          { key: 'booksPerLevel', label: 'Books per Level', type: 'number', required: true }
        ],
        books: [
          { key: 'title', label: 'Book Title', type: 'text', required: true },
          { key: 'isbn', label: 'ISBN', type: 'text', required: true },
          { key: 'authorName', label: 'Author', type: 'text', required: true },
          { key: 'publisherName', label: 'Publisher', type: 'text', required: true },
          { key: 'categoryName', label: 'Category', type: 'text', required: true },
          { key: 'languageName', label: 'Language', type: 'text', required: true },
          { key: 'copies', label: 'Total Copies', type: 'number', required: true },
          { key: 'available', label: 'Available Copies', type: 'number', required: true }
        ],
        borrowers: [
          { key: 'name', label: 'Student Name', type: 'text', required: true },
          { key: 'studentId', label: 'Student ID', type: 'text', required: true },
          { key: 'class', label: 'Class', type: 'text', required: true },
          { key: 'contact', label: 'Contact Number', type: 'tel', required: true },
          { key: 'email', label: 'Email Address', type: 'email', required: true }
        ],
        fines: [
          { key: 'borrowerName', label: 'Borrower Name', type: 'text', required: true },
          { key: 'bookTitle', label: 'Book Title', type: 'text', required: true },
          { key: 'issueDate', label: 'Issue Date', type: 'date', required: true },
          { key: 'dueDate', label: 'Due Date', type: 'date', required: true },
          { key: 'returnDate', label: 'Return Date', type: 'date' },
          { key: 'fineAmount', label: 'Fine Amount', type: 'number', required: true },
          { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid'], required: true }
        ]
      };
      return fieldConfigs[activeModule] || [];
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              {isEdit ? 'Edit' : 'Add New'} {modules.find(m => m.id === activeModule)?.name.slice(0, -1)}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {getFormFields().map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required={field.required}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value 
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={field.required}
                  />
                )}
              </div>
            ))}
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isEdit ? 'Update' : 'Add'} {modules.find(m => m.id === activeModule)?.name.slice(0, -1)}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DataTable = ({ data, onEdit, onDelete, onView }) => {
    const getColumns = () => {
      const columnConfigs = {
        authors: [
          { key: 'name', label: 'Name' },
          { key: 'nationality', label: 'Nationality' },
          { key: 'booksCount', label: 'Books' },
          { key: 'dateAdded', label: 'Date Added' }
        ],
        publishers: [
          { key: 'name', label: 'Publisher' },
          { key: 'country', label: 'Country' },
          { key: 'established', label: 'Established' },
          { key: 'booksCount', label: 'Books' }
        ],
        categories: [
          { key: 'name', label: 'Category' },
          { key: 'description', label: 'Description' },
          { key: 'booksCount', label: 'Books' }
        ],
        languages: [
          { key: 'name', label: 'Language' },
          { key: 'code', label: 'Code' },
          { key: 'booksCount', label: 'Books' }
        ],
        suppliers: [
          { key: 'name', label: 'Supplier' },
          { key: 'contact', label: 'Contact' },
          { key: 'email', label: 'Email' },
          { key: 'booksSupplied', label: 'Books Supplied' }
        ],
        rooms: [
          { key: 'name', label: 'Room Name' },
          { key: 'capacity', label: 'Capacity' },
          { key: 'floor', label: 'Floor' },
          { key: 'status', label: 'Status' }
        ],
        shelves: [
          { key: 'shelfCode', label: 'Shelf Code' },
          { key: 'roomName', label: 'Room' },
          { key: 'capacity', label: 'Capacity' },
          { key: 'currentBooks', label: 'Current Books' }
        ],
        racks: [
          { key: 'rackCode', label: 'Rack Code' },
          { key: 'shelfCode', label: 'Shelf' },
          { key: 'levels', label: 'Levels' },
          { key: 'booksPerLevel', label: 'Books/Level' }
        ],
        books: [
          { key: 'title', label: 'Title' },
          { key: 'authorName', label: 'Author' },
          { key: 'categoryName', label: 'Category' },
          { key: 'copies', label: 'Copies' },
          { key: 'available', label: 'Available' }
        ],
        borrowers: [
          { key: 'name', label: 'Name' },
          { key: 'studentId', label: 'Student ID' },
          { key: 'class', label: 'Class' },
          { key: 'booksIssued', label: 'Books Issued' },
          { key: 'status', label: 'Status' }
        ],
        fines: [
          { key: 'borrowerName', label: 'Borrower' },
          { key: 'bookTitle', label: 'Book' },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'fineAmount', label: 'Fine Amount' },
          { key: 'status', label: 'Status' }
        ]
      };
      return columnConfigs[activeModule] || [];
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {getColumns().map(col => (
                  <th key={col.key} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {getColumns().map(col => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                      {col.key === 'status' ? (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          item[col.key] === 'Active' || item[col.key] === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : item[col.key] === 'Pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item[col.key]}
                        </span>
                      ) : col.key === 'fineAmount' ? (
                        `₹${item[col.key]}`
                      ) : (
                        item[col.key]
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView && onView(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-xl transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Library className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-800">Library ERP</h1>
                <p className="text-sm text-gray-500">School Management</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="flex-1 py-6">
          {modules.map(module => {
            const IconComponent = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => {
                  setActiveModule(module.id);
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
                  activeModule === module.id 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${activeModule === module.id ? 'text-blue-600' : ''}`} />
                {sidebarOpen && (
                  <span className="font-medium">{module.name}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {modules.find(m => m.id === activeModule)?.name || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  Manage your library {activeModule === 'dashboard' ? 'overview' : activeModule}
                </p>
              </div>
            </div>
            
            {activeModule !== 'dashboard' && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={`Search ${activeModule}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {activeModule === 'dashboard' ? (
            <div>
              <DashboardStats />
              
              {/* Quick Overview Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">New book added</p>
                        <p className="text-xs text-gray-500">Harry Potter and the Philosopher's Stone</p>
                      </div>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Book issued</p>
                        <p className="text-xs text-gray-500">To John Smith (STU001)</p>
                      </div>
                      <span className="text-xs text-gray-400">4 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Fine collected</p>
                        <p className="text-xs text-gray-500">₹15 from John Smith</p>
                      </div>
                      <span className="text-xs text-gray-400">1 day ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Total Authors</span>
                      <span className="font-semibold text-gray-800">{authors.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Total Publishers</span>
                      <span className="font-semibold text-gray-800">{publishers.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Book Categories</span>
                      <span className="font-semibold text-gray-800">{categories.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Available Rooms</span>
                      <span className="font-semibold text-gray-800">{rooms.filter(r => r.status === 'Active').length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Total Shelves</span>
                      <span className="font-semibold text-gray-800">{shelves.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Books and Overdue Items */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recently Added Books</h3>
                  <div className="space-y-3">
                    {books.slice(0, 5).map(book => (
                      <div key={book.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{book.title}</p>
                          <p className="text-sm text-gray-500">by {book.authorName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">{book.available}/{book.copies}</p>
                          <p className="text-xs text-gray-500">Available</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Fines</h3>
                  <div className="space-y-3">
                    {fines.filter(f => f.status === 'Pending').map(fine => (
                      <div key={fine.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800">{fine.borrowerName}</p>
                          <p className="text-sm text-gray-500">{fine.bookTitle}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-red-600">₹{fine.fineAmount}</p>
                          <p className="text-xs text-gray-500">Due: {fine.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Data Table */}
              <DataTable
                data={filteredData}
                onEdit={setEditingItem}
                onDelete={handleDelete}
                onView={(item) => alert(`Viewing details for: ${item.name || item.title || item.borrowerName}`)}
              />
              
              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms' : `No ${activeModule} have been added yet`}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showAddModal && (
        <FormModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
        />
      )}

      {editingItem && (
        <FormModal
          isEdit={true}
          initialData={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
};

export default LibraryERP;