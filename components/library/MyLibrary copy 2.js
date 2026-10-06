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
  const itemsPerPage = 10; // Number of items to display per page

  // Data state for each module
  const [authors, setAuthors] = useState([
    { id: 1, name: 'J.K. Rowling', nationality: 'British', booksCount: 7, dateAdded: '2024-01-15' },
    { id: 2, name: 'George Orwell', nationality: 'British', booksCount: 12, dateAdded: '2024-01-10' },
    { id: 3, name: 'Agatha Christie', nationality: 'British', booksCount: 66, dateAdded: '2023-11-20' },
    { id: 4, name: 'Haruki Murakami', nationality: 'Japanese', booksCount: 14, dateAdded: '2024-02-01' },
    { id: 5, name: 'Gabriel Garcia Marquez', nationality: 'Colombian', booksCount: 10, dateAdded: '2023-10-05' },
  ]);

  const [publishers, setPublishers] = useState([
    { id: 1, name: 'Penguin Books', country: 'UK', established: '1935', booksCount: 45 },
    { id: 2, name: 'HarperCollins', country: 'USA', established: '1989', booksCount: 32 },
    { id: 3, name: 'Bloomsbury Publishing', country: 'UK', established: '1986', booksCount: 20 },
    { id: 4, name: 'Simon & Schuster', country: 'USA', established: '1924', booksCount: 50 },
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Fiction', description: 'Fictional literature', booksCount: 156 },
    { id: 2, name: 'Science', description: 'Scientific books and journals', booksCount: 89 },
    { id: 3, name: 'History', description: 'Historical texts', booksCount: 67 },
    { id: 4, name: 'Biography', description: 'Life stories of individuals', booksCount: 30 },
    { id: 5, name: 'Fantasy', description: 'Works of fiction set in imaginary universes', booksCount: 75 },
  ]);

  const [languages, setLanguages] = useState([
    { id: 1, name: 'English', code: 'EN', booksCount: 245 },
    { id: 2, name: 'Hindi', code: 'HI', booksCount: 123 },
    { id: 3, name: 'French', code: 'FR', booksCount: 34 },
    { id: 4, name: 'Spanish', code: 'ES', booksCount: 28 },
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'BookWorld Ltd', contact: '+1-234-567-8900', email: 'info@bookworld.com', booksSupplied: 156 },
    { id: 2, name: 'Academic Press', contact: '+1-345-678-9012', email: 'sales@academicpress.com', booksSupplied: 89 },
    { id: 3, name: 'Global Books Inc.', contact: '+44-20-7946-0123', email: 'contact@globalbooks.com', booksSupplied: 200 },
  ]);

  const [rooms, setRooms] = useState([
    { id: 1, name: 'Main Reading Hall', capacity: 100, floor: 'Ground Floor', status: 'Active' },
    { id: 2, name: 'Reference Section', capacity: 50, floor: 'First Floor', status: 'Active' },
    { id: 3, name: 'Digital Library', capacity: 30, floor: 'Second Floor', status: 'Under Maintenance' },
    { id: 4, name: 'Children\'s Section', capacity: 40, floor: 'Ground Floor', status: 'Active' },
  ]);

  const [shelves, setShelves] = useState([
    { id: 1, shelfCode: 'A001', roomId: 1, roomName: 'Main Reading Hall', capacity: 200, currentBooks: 156 },
    { id: 2, shelfCode: 'B002', roomId: 2, roomName: 'Reference Section', capacity: 150, currentBooks: 89 },
    { id: 3, shelfCode: 'C003', roomId: 1, roomName: 'Main Reading Hall', capacity: 180, currentBooks: 100 },
    { id: 4, shelfCode: 'D004', roomId: 4, roomName: 'Children\'s Section', capacity: 100, currentBooks: 70 },
  ]);

  const [racks, setRacks] = useState([
    { id: 1, rackCode: 'R001', shelfId: 1, shelfCode: 'A001', levels: 5, booksPerLevel: 40 },
    { id: 2, rackCode: 'R002', shelfId: 1, shelfCode: 'A001', levels: 4, booksPerLevel: 35 },
    { id: 3, rackCode: 'R003', shelfId: 2, shelfCode: 'B002', levels: 6, booksPerLevel: 30 },
    { id: 4, rackCode: 'R004', shelfId: 3, shelfCode: 'C003', levels: 5, booksPerLevel: 36 },
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
    },
    {
      id: 3, title: 'The Lord of the Rings', isbn: '978-0618053267',
      authorId: 1, authorName: 'J.R.R. Tolkien', publisherId: 1, publisherName: 'Penguin Books',
      categoryId: 5, categoryName: 'Fantasy', languageId: 1, languageName: 'English',
      copies: 7, available: 5, rackId: 1, rackCode: 'R001'
    },
    {
      id: 4, title: 'To Kill a Mockingbird', isbn: '978-0446310789',
      authorId: 1, authorName: 'Harper Lee', publisherId: 2, publisherName: 'HarperCollins',
      categoryId: 1, categoryName: 'Fiction', languageId: 1, languageName: 'English',
      copies: 4, available: 3, rackId: 2, rackCode: 'R002'
    },
    {
      id: 5, title: 'Murder on the Orient Express', isbn: '978-0007119290',
      authorId: 3, authorName: 'Agatha Christie', publisherId: 3, publisherName: 'Bloomsbury Publishing',
      categoryId: 1, categoryName: 'Fiction', languageId: 1, languageName: 'English',
      copies: 2, available: 1, rackId: 3, rackCode: 'R003'
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
    },
    {
      id: 3, name: 'Michael Brown', studentId: 'STU003', class: '9th Grade',
      contact: '+1-555-0125', email: 'michael.brown@school.edu', booksIssued: 0, status: 'Inactive'
    },
    {
      id: 4, name: 'Sarah Davis', studentId: 'STU004', class: '12th Grade',
      contact: '+1-555-0126', email: 'sarah.davis@school.edu', booksIssued: 3, status: 'Active'
    },
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
    },
    {
      id: 3, borrowerId: 4, borrowerName: 'Sarah Davis', bookTitle: 'The Lord of the Rings',
      issueDate: '2024-06-20', dueDate: '2024-07-04', returnDate: null,
      fineAmount: 10, status: 'Pending'
    },
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
    const newId = getCurrentData().length > 0 ? Math.max(...getCurrentData().map(item => item.id || 0)) + 1 : 1;
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
  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


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
          { key: 'nationality', label: 'Nationality', type: 'text', required: true },
          { key: 'booksCount', label: 'Books Count', type: 'number', required: false, defaultValue: 0 },
          { key: 'dateAdded', label: 'Date Added', type: 'date', required: true, defaultValue: new Date().toISOString().slice(0, 10) }
        ],
        publishers: [
          { key: 'name', label: 'Publisher Name', type: 'text', required: true },
          { key: 'country', label: 'Country', type: 'text', required: true },
          { key: 'established', label: 'Established Year', type: 'text', required: true },
          { key: 'booksCount', label: 'Books Count', type: 'number', required: false, defaultValue: 0 }
        ],
        categories: [
          { key: 'name', label: 'Category Name', type: 'text', required: true },
          { key: 'description', label: 'Description', type: 'textarea', required: true },
          { key: 'booksCount', label: 'Books Count', type: 'number', required: false, defaultValue: 0 }
        ],
        languages: [
          { key: 'name', label: 'Language Name', type: 'text', required: true },
          { key: 'code', label: 'Language Code', type: 'text', required: true },
          { key: 'booksCount', label: 'Books Count', type: 'number', required: false, defaultValue: 0 }
        ],
        suppliers: [
          { key: 'name', label: 'Supplier Name', type: 'text', required: true },
          { key: 'contact', label: 'Contact Number', type: 'tel', required: true },
          { key: 'email', label: 'Email Address', type: 'email', required: true },
          { key: 'booksSupplied', label: 'Books Supplied', type: 'number', required: false, defaultValue: 0 }
        ],
        rooms: [
          { key: 'name', label: 'Room Name', type: 'text', required: true },
          { key: 'capacity', label: 'Capacity', type: 'number', required: true },
          { key: 'floor', label: 'Floor', type: 'text', required: true },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Under Maintenance', 'Closed'], required: true }
        ],
        shelves: [
          { key: 'shelfCode', label: 'Shelf Code', type: 'text', required: true },
          {
            key: 'roomId', label: 'Room', type: 'select',
            options: rooms.map(room => ({ value: room.id, label: room.name })), required: true
          },
          { key: 'capacity', label: 'Capacity', type: 'number', required: true },
          { key: 'currentBooks', label: 'Current Books', type: 'number', required: false, defaultValue: 0 }
        ],
        racks: [
          { key: 'rackCode', label: 'Rack Code', type: 'text', required: true },
          {
            key: 'shelfId', label: 'Shelf', type: 'select',
            options: shelves.map(shelf => ({ value: shelf.id, label: shelf.shelfCode })), required: true
          },
          { key: 'levels', label: 'Number of Levels', type: 'number', required: true },
          { key: 'booksPerLevel', label: 'Books per Level', type: 'number', required: true }
        ],
        books: [
          { key: 'title', label: 'Book Title', type: 'text', required: true },
          { key: 'isbn', label: 'ISBN', type: 'text', required: true },
          {
            key: 'authorId', label: 'Author', type: 'select',
            options: authors.map(author => ({ value: author.id, label: author.name })), required: true
          },
          {
            key: 'publisherId', label: 'Publisher', type: 'select',
            options: publishers.map(publisher => ({ value: publisher.id, label: publisher.name })), required: true
          },
          {
            key: 'categoryId', label: 'Category', type: 'select',
            options: categories.map(category => ({ value: category.id, label: category.name })), required: true
          },
          {
            key: 'languageId', label: 'Language', type: 'select',
            options: languages.map(language => ({ value: language.id, label: language.name })), required: true
          },
          { key: 'copies', label: 'Total Copies', type: 'number', required: true },
          { key: 'available', label: 'Available Copies', type: 'number', required: true },
          {
            key: 'rackId', label: 'Rack', type: 'select',
            options: racks.map(rack => ({ value: rack.id, label: rack.rackCode })), required: false
          }
        ],
        borrowers: [
          { key: 'name', label: 'Student Name', type: 'text', required: true },
          { key: 'studentId', label: 'Student ID', type: 'text', required: true },
          { key: 'class', label: 'Class', type: 'text', required: true },
          { key: 'contact', label: 'Contact Number', type: 'tel', required: true },
          { key: 'email', label: 'Email Address', type: 'email', required: true },
          { key: 'booksIssued', label: 'Books Issued', type: 'number', required: false, defaultValue: 0 },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Suspended'], required: true }
        ],
        fines: [
          {
            key: 'borrowerId', label: 'Borrower Name', type: 'select',
            options: borrowers.map(borrower => ({ value: borrower.id, label: borrower.name })), required: true
          },
          {
            key: 'bookId', label: 'Book Title', type: 'select',
            options: books.map(book => ({ value: book.id, label: book.title })), required: true
          },
          { key: 'issueDate', label: 'Issue Date', type: 'date', required: true },
          { key: 'dueDate', label: 'Due Date', type: 'date', required: true },
          { key: 'returnDate', label: 'Return Date', type: 'date' },
          { key: 'fineAmount', label: 'Fine Amount', type: 'number', required: true },
          { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Waived'], required: true }
        ]
      };
      return fieldConfigs[activeModule] || [];
    };

    useEffect(() => {
      // Initialize form data with initialData, applying default values for new entries
      const fields = getFormFields();
      const newFormData = { ...initialData };
      if (!isEdit) {
        fields.forEach(field => {
          if (field.defaultValue !== undefined && newFormData[field.key] === undefined) {
            newFormData[field.key] = field.defaultValue;
          }
        });
      }
      setFormData(newFormData);
    }, [initialData, activeModule, isEdit]);

    const handleSubmit = (e) => {
      e.preventDefault();
      // Resolve IDs to names for display in DataTable if necessary
      const dataToSubmit = { ...formData };
      const fields = getFormFields();

      fields.forEach(field => {
        if (field.type === 'select' && field.options && field.key.endsWith('Id')) {
          const selectedOption = field.options.find(opt => opt.value === formData[field.key]);
          if (selectedOption) {
            dataToSubmit[field.key.replace('Id', 'Name')] = selectedOption.label;
          }
        }
      });
      onSubmit(dataToSubmit);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-accent rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl"> {/* Responsive width classes */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b"> {/* Responsive padding */}
            <h2 className="text-lg sm:text-xl font-bold text-gray-800"> {/* Responsive font size */}
              {isEdit ? 'Edit' : 'Add New'} {modules.find(m => m.id === activeModule)?.name.replace(/s$/, '')}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 sm:p-0"> {/* Add padding for easier tap */}
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6"> {/* Responsive padding and spacing */}
            {getFormFields().map(field => (
              <div key={field.key} className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 items-center"> {/* Responsive grid for fields */}
                <label className="block text-sm font-medium text-gray-700 col-span-full sm:col-span-1"> {/* Label spans full width on small screens */}
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm col-span-full sm:col-span-1"
                    rows={3}
                    required={field.required}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm col-span-full sm:col-span-1"
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options && field.options.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm col-span-full sm:col-span-1"
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-3 pt-4"> {/* Responsive button layout */}
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                {isEdit ? 'Update' : 'Add'} {modules.find(m => m.id === activeModule)?.name.replace(/s$/, '')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-base sm:text-lg"
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
          { key: 'roomName', label: 'Room' }, // Display roomName
          { key: 'capacity', label: 'Capacity' },
          { key: 'currentBooks', label: 'Current Books' }
        ],
        racks: [
          { key: 'rackCode', label: 'Rack Code' },
          { key: 'shelfCode', label: 'Shelf' }, // Display shelfCode
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

    const handleView = (item) => {
      alert(`Details for ${item.name || item.title || item.shelfCode || item.rackCode}:\n\n` +
        Object.entries(item).map(([key, value]) => `${key}: ${value}`).join('\n')
      );
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
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${item[col.key] === 'Active' || item[col.key] === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : item[col.key] === 'Pending' || item[col.key] === 'Under Maintenance'
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
                        onClick={() => handleView(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingItem(item)}
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
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6"> {/* Responsive flex direction and gap */}
          <div className="flex items-center gap-3 sm:gap-4"> {/* Adjusted gap for logo/title */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"> {/* Responsive size and rounded corners, prevent shrinking */}
              <Library className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> {/* Responsive icon size */}
            </div>
            <div className="text-center sm:text-left"> {/* Center text on small, left on larger */}
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">Library ERP</h1> {/* Responsive font size, leading */}
              <p className="text-xs sm:text-sm text-gray-500">School Management System</p> {/* Responsive font size */}
            </div>
          </div>

          {activeModule !== 'dashboard' && (
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"> {/* Responsive flex direction and full width on small screens */}
              <div className="relative w-full sm:w-64 lg:w-80"> {/* Full width on small screens, fixed width on larger */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${modules.find(m => m.id === activeModule)?.name.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm" // Full width input, smaller text
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base" // Full width button on small, auto on larger
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 lg:px-10"> {/* Responsive horizontal padding */}
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide"> {/* Added whitespace-nowrap and scrollbar-hide */}
          {modules.map(module => {
            const IconComponent = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => {
                  setActiveModule(module.id);
                  setSearchTerm(''); // Clear search term on module change
                  setCurrentPage(1); // Reset page to 1 on module change
                }}
                className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium border-b-2 transition-colors flex-shrink-0
                ${activeModule === module.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                  }`}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" /> {/* Responsive icon size */}
                <span className="text-xs sm:text-sm">{module.name}</span> {/* Responsive text size */}
              </button>
            );
          })}
        </div>
      </div>


      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeModule === 'dashboard' ? (
          <DashboardStats />
        ) : (
          <DataTable
            data={paginatedData}
            onEdit={setEditingItem}
            onDelete={handleDelete}
          />
        )}
      </main>

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