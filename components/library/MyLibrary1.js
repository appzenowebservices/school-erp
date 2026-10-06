import React, { useState, useEffect } from 'react';
import {
  BookOpen, Users, Building2, Languages, Truck,
  Home, Archive, Package, UserCheck, CreditCard,
  Plus, Edit3, Trash2, Search, Filter, Eye,
  ChevronLeft, ChevronRight, Save, X, Grid3X3,
  List, MoreVertical, Calendar, Star, TrendingUp,
  User, Building, Globe, ShoppingCart
} from 'lucide-react';

const LibraryModule = () => {
  const [activeSection, setActiveSection] = useState('books');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterBy, setFilterBy] = useState('all');

  // Sample data for each section
  const [authors, setAuthors] = useState([
    { id: 1, name: 'J.K. Rowling', nationality: 'British', booksCount: 7, dateAdded: '2024-01-15', avatar: '👩‍🦰', rating: 4.9 },
    { id: 2, name: 'George Orwell', nationality: 'British', booksCount: 12, dateAdded: '2024-01-10', avatar: '👨‍💼', rating: 4.8 },
    { id: 3, name: 'Agatha Christie', nationality: 'British', booksCount: 66, dateAdded: '2024-02-01', avatar: '👩‍💻', rating: 4.7 }
  ]);

  const [publishers, setPublishers] = useState([
    { id: 1, name: 'Penguin Books', country: 'UK', established: '1935', booksCount: 45, logo: '🐧', status: 'Active' },
    { id: 2, name: 'HarperCollins', country: 'USA', established: '1989', booksCount: 32, logo: '📚', status: 'Active' },
    { id: 3, name: 'Random House', country: 'USA', established: '1927', booksCount: 28, logo: '🏠', status: 'Active' }
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Fiction', description: 'Fictional literature and novels', booksCount: 156, color: 'bg-purple-500', trending: true },
    { id: 2, name: 'Science', description: 'Scientific books and journals', booksCount: 89, color: 'bg-blue-500', trending: false },
    { id: 3, name: 'History', description: 'Historical texts and documents', booksCount: 67, color: 'bg-green-500', trending: true },
    { id: 4, name: 'Biography', description: 'Life stories and memoirs', booksCount: 34, color: 'bg-yellow-500', trending: false }
  ]);

  const [languages, setLanguages] = useState([
    { id: 1, name: 'English', code: 'EN', booksCount: 245, flag: '🇺🇸', popularity: 95 },
    { id: 2, name: 'Hindi', code: 'HI', booksCount: 123, flag: '🇮🇳', popularity: 78 },
    { id: 3, name: 'French', code: 'FR', booksCount: 34, flag: '🇫🇷', popularity: 45 },
    { id: 4, name: 'Spanish', code: 'ES', booksCount: 28, flag: '🇪🇸', popularity: 52 }
  ]);

  const [books, setBooks] = useState([
    {
      id: 1, title: 'Harry Potter and the Philosopher\'s Stone', isbn: '978-0747532743',
      authorName: 'J.K. Rowling', publisherName: 'Penguin Books', categoryName: 'Fiction',
      languageName: 'English', copies: 5, available: 3, rating: 4.8, cover: '📖',
      publishYear: 1997, pages: 223, status: 'Available'
    },
    {
      id: 2, title: '1984', isbn: '978-0451524935',
      authorName: 'George Orwell', publisherName: 'HarperCollins', categoryName: 'Fiction',
      languageName: 'English', copies: 3, available: 2, rating: 4.7, cover: '📚',
      publishYear: 1949, pages: 328, status: 'Available'
    },
    {
      id: 3, title: 'The Great Gatsby', isbn: '978-0743273565',
      authorName: 'F. Scott Fitzgerald', publisherName: 'Random House', categoryName: 'Fiction',
      languageName: 'English', copies: 4, available: 0, rating: 4.4, cover: '📙',
      publishYear: 1925, pages: 180, status: 'Out of Stock'
    }
  ]);

  const [borrowers, setBorrowers] = useState([
    {
      id: 1, name: 'John Smith', studentId: 'STU001', class: '10th Grade',
      contact: '+1-555-0123', email: 'john.smith@school.edu', booksIssued: 2,
      status: 'Active', joinDate: '2024-01-10', avatar: '👦'
    },
    {
      id: 2, name: 'Emily Johnson', studentId: 'STU002', class: '11th Grade',
      contact: '+1-555-0124', email: 'emily.johnson@school.edu', booksIssued: 1,
      status: 'Active', joinDate: '2024-01-15', avatar: '👧'
    }
  ]);

  const [fines, setFines] = useState([
    {
      id: 1, borrowerName: 'John Smith', bookTitle: 'Harry Potter', studentId: 'STU001',
      issueDate: '2024-06-15', dueDate: '2024-06-29', returnDate: '2024-07-05',
      fineAmount: 15, status: 'Paid', daysOverdue: 6
    },
    {
      id: 2, borrowerName: 'Emily Johnson', bookTitle: '1984', studentId: 'STU002',
      issueDate: '2024-07-01', dueDate: '2024-07-15', returnDate: null,
      fineAmount: 25, status: 'Pending', daysOverdue: 12
    }
  ]);

  const sections = [
    { id: 'books', name: 'Books', icon: BookOpen, color: 'bg-blue-500' },
    { id: 'authors', name: 'Authors', icon: User, color: 'bg-purple-500' },
    { id: 'publishers', name: 'Publishers', icon: Building, color: 'bg-green-500' },
    { id: 'categories', name: 'Categories', icon: Archive, color: 'bg-yellow-500' },
    { id: 'languages', name: 'Languages', icon: Globe, color: 'bg-red-500' },
    { id: 'borrowers', name: 'Borrowers', icon: UserCheck, color: 'bg-cyan-500' },
    { id: 'fines', name: 'Fine Collection', icon: CreditCard, color: 'bg-rose-500' }
  ];

  const getCurrentData = () => {
    const dataMap = { authors, publishers, categories, languages, books, borrowers, fines };
    return dataMap[activeSection] || [];
  };

  const getSetterFunction = () => {
    const setterMap = {
      authors: setAuthors, publishers: setPublishers, categories: setCategories,
      languages: setLanguages, books: setBooks, borrowers: setBorrowers, fines: setFines
    };
    return setterMap[activeSection];
  };

  const handleAdd = (formData) => {
    const setter = getSetterFunction();
    // Generate a new ID based on the current data for the active section
    const currentData = getCurrentData();
    const newId = currentData.length > 0 ? Math.max(...currentData.map(item => item.id || 0)) + 1 : 1;

    let newEntry = { id: newId, ...formData };

    // Add default/derived values for new entries based on section
    if (activeSection === 'authors') {
      newEntry = { ...newEntry, booksCount: 0, dateAdded: new Date().toISOString().split('T')[0], avatar: '👤', rating: 0 };
    } else if (activeSection === 'publishers') {
      newEntry = { ...newEntry, booksCount: 0, logo: '🏢', status: 'Active' };
    } else if (activeSection === 'categories') {
      newEntry = { ...newEntry, booksCount: 0, color: 'bg-gray-500', trending: false };
    } else if (activeSection === 'languages') {
      newEntry = { ...newEntry, booksCount: 0, flag: '🌐', popularity: 0 };
    } else if (activeSection === 'books') {
      newEntry = { ...newEntry, copies: parseInt(formData.copies) || 0, available: parseInt(formData.copies) || 0, rating: 0, cover: '📚', status: 'Available' };
    } else if (activeSection === 'borrowers') {
      newEntry = { ...newEntry, booksIssued: 0, status: 'Active', joinDate: new Date().toISOString().split('T')[0], avatar: '🧑' };
    } else if (activeSection === 'fines') {
      newEntry = { ...newEntry, issueDate: new Date().toISOString().split('T')[0], returnDate: null, fineAmount: parseFloat(formData.fineAmount) || 0, status: 'Pending', daysOverdue: 0 };
    }

    setter(prev => [...prev, newEntry]);
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
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} items?`)) {
      const setter = getSetterFunction();
      setter(prev => prev.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
    }
  };

  const filteredData = getCurrentData().filter(item => {
    if (!searchTerm && filterBy === 'all') return true;

    const matchesSearch = !searchTerm || Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    let matchesFilter = true;
    if (activeSection === 'books') {
      matchesFilter = filterBy === 'all' ||
        (filterBy === 'available' && item.status === 'Available');
    } else if (activeSection === 'publishers' || activeSection === 'borrowers') {
      matchesFilter = filterBy === 'all' ||
        (filterBy === 'active' && item.status === 'Active');
    } else if (activeSection === 'fines') {
      matchesFilter = filterBy === 'all' ||
        (filterBy === 'pending' && item.status === 'Pending') ||
        (filterBy === 'paid' && item.status === 'Paid');
    } else if (activeSection === 'categories') {
      matchesFilter = filterBy === 'all' ||
        (filterBy === 'trending' && item.trending);
    }
    // For other sections, filterBy 'all' is the only filter option

    return matchesSearch && matchesFilter;
  });

  const handleCheckboxChange = (id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(filteredData.map(item => item.id));
      setSelectedItems(allIds);
    } else {
      setSelectedItems(new Set());
    }
  };


  // Enhanced Card Components for different sections
  const BookCard = ({ book, isSelected, onSelect }) => (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:border-blue-200 ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
              {book.cover}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg leading-tight">{book.title}</h3>
              <p className="text-sm text-gray-500">by {book.authorName}</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(book.id)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{book.available}</p>
            <p className="text-xs text-gray-500">Available</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{book.copies}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-700">{book.rating}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            book.status === 'Available'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {book.status}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <p>{book.categoryName} • {book.languageName}</p>
            <p>ISBN: {book.isbn}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingItem(book)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(book.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const AuthorCard = ({ author, isSelected, onSelect }) => (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:border-purple-200 ${isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-2xl">
              {author.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{author.name}</h3>
              <p className="text-sm text-gray-500">{author.nationality}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">{author.rating}</span>
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(author.id)}
            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
          />
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Books Published</span>
            <span className="text-2xl font-bold text-purple-600">{author.booksCount}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Added {author.dateAdded}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingItem(author)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(author.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- NEW: PublisherCard Component ---
  const PublisherCard = ({ publisher, isSelected, onSelect }) => (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:border-green-200 ${isSelected ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-2xl">
              {publisher.logo}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{publisher.name}</h3>
              <p className="text-sm text-gray-500">{publisher.country}</p>
              <p className="text-xs text-gray-400">Est. {publisher.established}</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(publisher.id)}
            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
          />
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Books Published</span>
            <span className="text-2xl font-bold text-green-600">{publisher.booksCount}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            publisher.status === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {publisher.status}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingItem(publisher)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(publisher.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  // --- END NEW: PublisherCard Component ---

  const CategoryCard = ({ category, isSelected, onSelect }) => (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:border-yellow-200 ${isSelected ? 'border-yellow-500 ring-2 ring-yellow-200' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center`}>
              <Archive className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.description}</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(category.id)}
            className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">{category.booksCount}</span>
            <span className="text-sm text-gray-500">books</span>
          </div>
          {category.trending && (
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Trending</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditingItem(category)}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(category.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const LanguageCard = ({ language, isSelected, onSelect }) => (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:border-red-200 ${isSelected ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center text-lg">
              {language.flag}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{language.name}</h3>
              <p className="text-sm text-gray-500">Code: {language.code}</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(language.id)}
            className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
          />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Books Available</span>
            <span className="font-semibold text-gray-800">{language.booksCount}</span>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Popularity</span>
              <span className="text-sm font-medium text-red-600">{language.popularity}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${language.popularity}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditingItem(language)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(language.id)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const BorrowerCard = ({ borrower, isSelected, onSelect }) => (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:border-cyan-200 ${isSelected ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-lg">
              {borrower.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{borrower.name}</h3>
              <p className="text-sm text-gray-500">{borrower.studentId} • {borrower.class}</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(borrower.id)}
            className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
          />
        </div>

        <div className="bg-cyan-50 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Books Issued</span>
            <span className="text-xl font-bold text-cyan-600">{borrower.booksIssued}</span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <p>📧 {borrower.email}</p>
          <p>📱 {borrower.contact}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            borrower.status === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {borrower.status}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingItem(borrower)}
              className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(borrower.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const FineCard = ({ fine, isSelected, onSelect }) => (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:border-rose-200 ${isSelected ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              fine.status === 'Paid'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
            }`}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{fine.borrowerName}</h3>
              <p className="text-sm text-gray-500">{fine.studentId}</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(fine.id)}
            className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
          />
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="font-medium text-gray-800 mb-1">{fine.bookTitle}</p>
          <p className="text-sm text-gray-500">Due: {fine.dueDate}</p>
          {fine.daysOverdue > 0 && (
            <p className="text-sm text-red-600 font-medium">{fine.daysOverdue} days overdue</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-right">
            <p className="text-2xl font-bold text-rose-600">₹{fine.fineAmount}</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              fine.status === 'Paid'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {fine.status}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingItem(fine)}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(fine.id)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCard = (item, isSelected, onSelect) => {
    switch (activeSection) {
      case 'books': return <BookCard book={item} isSelected={isSelected} onSelect={onSelect} />;
      case 'authors': return <AuthorCard author={item} isSelected={isSelected} onSelect={onSelect} />;
      case 'publishers': return <PublisherCard publisher={item} isSelected={isSelected} onSelect={onSelect} />; // Added PublisherCard
      case 'categories': return <CategoryCard category={item} isSelected={isSelected} onSelect={onSelect} />;
      case 'languages': return <LanguageCard language={item} isSelected={isSelected} onSelect={onSelect} />;
      case 'borrowers': return <BorrowerCard borrower={item} isSelected={isSelected} onSelect={onSelect} />;
      case 'fines': return <FineCard fine={item} isSelected={isSelected} onSelect={onSelect} />;
      default: return null;
    }
  };

  const FormModal = ({ isEdit = false, onClose, onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      onClose(); // Close modal after submission
    };

    const getFormFields = () => {
      const fieldConfigs = {
        authors: [
          { key: 'name', label: 'Author Name', type: 'text', required: true },
          { key: 'nationality', label: 'Nationality', type: 'text', required: true },
          { key: 'avatar', label: 'Avatar Emoji', type: 'text', required: false, placeholder: 'e.g., 👩‍🦰' },
          { key: 'rating', label: 'Rating', type: 'number', required: false, min: 0, max: 5, step: 0.1 }
        ],
        publishers: [
          { key: 'name', label: 'Publisher Name', type: 'text', required: true },
          { key: 'country', label: 'Country', type: 'text', required: true },
          { key: 'established', label: 'Established Year', type: 'number', required: true },
          { key: 'logo', label: 'Logo Emoji', type: 'text', required: false, placeholder: 'e.g., 🐧' },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true }
        ],
        categories: [
          { key: 'name', label: 'Category Name', type: 'text', required: true },
          { key: 'description', label: 'Description', type: 'textarea', required: true },
          { key: 'color', label: 'Color (Tailwind Class)', type: 'text', required: false, placeholder: 'e.g., bg-red-500' },
          { key: 'trending', label: 'Trending', type: 'checkbox', required: false }
        ],
        languages: [
          { key: 'name', label: 'Language Name', type: 'text', required: true },
          { key: 'code', label: 'Language Code', type: 'text', required: true },
          { key: 'flag', label: 'Flag Emoji', type: 'text', required: false, placeholder: 'e.g., 🇺🇸' },
          { key: 'popularity', label: 'Popularity (%)', type: 'number', required: false, min: 0, max: 100 }
        ],
        books: [
          { key: 'title', label: 'Book Title', type: 'text', required: true },
          { key: 'isbn', label: 'ISBN', type: 'text', required: true },
          { key: 'authorName', label: 'Author Name', type: 'text', required: true },
          { key: 'publisherName', label: 'Publisher Name', type: 'text', required: true },
          { key: 'categoryName', label: 'Category Name', type: 'text', required: true },
          { key: 'languageName', label: 'Language Name', type: 'text', required: true },
          { key: 'copies', label: 'Number of Copies', type: 'number', required: true },
          { key: 'publishYear', label: 'Publish Year', type: 'number', required: false },
          { key: 'pages', label: 'Number of Pages', type: 'number', required: false },
          { key: 'cover', label: 'Cover Emoji', type: 'text', required: false, placeholder: 'e.g., 📖' }
          // Status, available, and rating are often derived/managed internally
        ],
        borrowers: [
          { key: 'name', label: 'Borrower Name', type: 'text', required: true },
          { key: 'studentId', label: 'Student ID', type: 'text', required: true },
          { key: 'class', label: 'Class', type: 'text', required: true },
          { key: 'contact', label: 'Contact Number', type: 'tel', required: true },
          { key: 'email', label: 'Email', type: 'email', required: true },
          { key: 'avatar', label: 'Avatar Emoji', type: 'text', required: false, placeholder: 'e.g., 👦' },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true }
        ],
        fines: [
          { key: 'borrowerName', label: 'Borrower Name', type: 'text', required: true },
          { key: 'bookTitle', label: 'Book Title', type: 'text', required: true },
          { key: 'studentId', label: 'Student ID', type: 'text', required: true },
          { key: 'dueDate', label: 'Due Date', type: 'date', required: true },
          { key: 'fineAmount', label: 'Fine Amount (₹)', type: 'number', required: true, step: 0.01 },
          { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Waived'], required: true }
        ]
      };
      return fieldConfigs[activeSection] || [];
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? `Edit ${activeSection.slice(0, -1)}` : `Add New ${activeSection.slice(0, -1)}`}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {getFormFields().map(field => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.key}
                    name={field.key}
                    value={formData[field.key] || ''}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={field.key}
                    name={field.key}
                    value={formData[field.key] || field.options[0]}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required={field.required}
                  >
                    {field.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id={field.key}
                      name={field.key}
                      checked={formData[field.key] || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={field.key} className="ml-2 block text-sm text-gray-900">
                      {field.label}
                    </label>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    id={field.key}
                    name={field.key}
                    value={formData[field.key] || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required={field.required}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 inline-block mr-1" /> Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-md"
              >
                <Save className="w-4 h-4 inline-block mr-1" /> {isEdit ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 bg-gray-900 text-white p-6 flex flex-col items-center lg:items-start lg:min-h-screen shadow-lg">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-blue-400">LibSys</h1>
            <p className="text-sm text-gray-400">Library Management</p>
          </div>
          <nav className="w-full flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setSearchTerm(''); // Clear search when section changes
                    setSelectedItems(new Set()); // Clear selections
                    setFilterBy('all'); // Reset filter
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? `${section.color} text-white shadow-lg`
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-semibold text-sm whitespace-nowrap">{section.name}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-auto hidden lg:block text-center text-xs text-gray-500">
            &copy; 2025 LibSys. All rights reserved.
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 capitalize">{activeSection} Management</h2>
              <p className="text-gray-600">Manage your {activeSection} inventory with ease.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowAddModal(true); setEditingItem(null); }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-base font-semibold"
              >
                <Plus className="w-5 h-5" /> Add New
              </button>
              {selectedItems.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 transition-colors flex items-center gap-2 text-base font-semibold"
                >
                  <Trash2 className="w-5 h-5" /> Delete ({selectedItems.size})
                </button>
              )}
            </div>
          </header>

          {/* Controls: Search, Filter, View Mode */}
          <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeSection}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-4">
              {/* Filter Dropdown - Conditional based on active section */}
              {['books', 'publishers', 'borrowers', 'fines', 'categories'].includes(activeSection) && (
                <div className="relative">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="appearance-none px-4 py-2 border border-gray-300 rounded-lg bg-white pr-8 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All</option>
                    {activeSection === 'books' && <option value="available">Available</option>}
                    {(activeSection === 'publishers' || activeSection === 'borrowers') && <option value="active">Active</option>}
                    {activeSection === 'fines' && (
                      <>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                      </>
                    )}
                    {activeSection === 'categories' && <option value="trending">Trending</option>}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-gray-500" />
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="flex items-center rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Data Display Area */}
          {filteredData.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No {activeSection} found.</p>
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'gap-4'}`}>
              {filteredData.map(item => (
                <div key={item.id} className={`${viewMode === 'list' ? 'w-full' : ''}`}>
                  {renderCard(item, selectedItems.has(item.id), handleCheckboxChange)}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <FormModal
          isEdit={!!editingItem}
          onClose={() => { setShowAddModal(false); setEditingItem(null); }}
          onSubmit={editingItem ? handleEdit : handleAdd}
          initialData={editingItem || {}}
        />
      )}
    </div>
  );
};

export default LibraryModule;