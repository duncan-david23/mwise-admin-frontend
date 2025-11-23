import React, { useState } from 'react';

const Inventory = () => {
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "MacBook Pro 16\"",
      sku: "MBP16-2024",
      category: "Electronics",
      quantity: 15,
      price: 2499,
      status: "In Stock",
      lastUpdated: "2024-01-15",
      image: "💻"
    },
    {
      id: 2,
      name: "AirPods Pro",
      sku: "AP-PRO-2024",
      category: "Audio",
      quantity: 0,
      price: 249,
      status: "Out of Stock",
      lastUpdated: "2024-01-14",
      image: "🎧"
    },
    {
      id: 3,
      name: "iPhone 15 Pro",
      sku: "IP15-PRO",
      category: "Electronics",
      quantity: 8,
      price: 1199,
      status: "Low Stock",
      lastUpdated: "2024-01-16",
      image: "📱"
    },
    {
      id: 4,
      name: "Apple Watch Ultra",
      sku: "AW-ULTRA-2",
      category: "Wearables",
      quantity: 25,
      price: 799,
      status: "In Stock",
      lastUpdated: "2024-01-13",
      image: "⌚"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: '',
    price: ''
  });

  // Filter inventory
  const filteredInventory = inventory
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(item => selectedCategory === 'All' || item.category === selectedCategory);

  const categories = ['All', ...new Set(inventory.map(item => item.category))];
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const lowStockItems = inventory.filter(item => item.quantity > 0 && item.quantity <= 10).length;

  const deleteItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const addItem = (e) => {
    e.preventDefault();
    const item = {
      id: Date.now(),
      ...newItem,
      quantity: parseInt(newItem.quantity),
      price: parseFloat(newItem.price),
      status: newItem.quantity > 10 ? "In Stock" : newItem.quantity > 0 ? "Low Stock" : "Out of Stock",
      lastUpdated: new Date().toISOString().split('T')[0],
      image: "📦"
    };
    setInventory([...inventory, item]);
    setNewItem({ name: '', sku: '', category: '', quantity: '', price: '' });
    setIsAddModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'text-green-600';
      case 'Low Stock': return 'text-amber-500';
      case 'Out of Stock': return 'text-red-500';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light tracking-tight">Inventory</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your product catalog</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-white text-black px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-300"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-light">Total Products</p>
                <p className="text-2xl font-light mt-2">{inventory.length}</p>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                <span className="text-lg">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-light">Total Value</p>
                <p className="text-2xl font-light mt-2">${totalValue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                <span className="text-lg">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-light">Low Stock</p>
                <p className="text-2xl font-light mt-2">{lowStockItems}</p>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                <span className="text-lg">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-600 transition-colors"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInventory.map((item) => (
            <div key={item.id} className="bg-gray-900 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                    <span className="text-xl">{item.image}</span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all duration-200 p-2 hover:bg-gray-800 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <h3 className="text-lg font-light mb-2">{item.name}</h3>
                <p className="text-gray-400 text-sm font-mono mb-4">{item.sku}</p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white">{item.category}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Quantity</span>
                    <span className={`font-medium ${item.quantity === 0 ? 'text-red-500' : item.quantity <= 10 ? 'text-amber-500' : 'text-green-500'}`}>
                      {item.quantity}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Price</span>
                    <span className="text-white font-medium">${item.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No products found</div>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-light">Add New Product</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={addItem} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Product Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">SKU</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-3 text-gray-400 bg-gray-800 border border-gray-700 rounded-xl font-medium hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-colors"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;