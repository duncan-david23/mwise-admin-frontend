import React, { useState } from 'react';

const CreateCouponForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    max_uses: '',
    valid_from: '',
    valid_until: '',
    theme: 'premium'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Coupon code must be at least 3 characters';
    }

    if (!formData.discount_value || formData.discount_value <= 0) {
      newErrors.discount_value = 'Discount value must be greater than 0';
    }

    if (!formData.max_uses || formData.max_uses <= 0) {
      newErrors.max_uses = 'Max uses must be greater than 0';
    }

    if (!formData.valid_from) {
      newErrors.valid_from = 'Start date is required';
    }

    if (!formData.valid_until) {
      newErrors.valid_until = 'End date is required';
    }

    if (formData.valid_from && formData.valid_until) {
      const startDate = new Date(formData.valid_from);
      const endDate = new Date(formData.valid_until);
      if (endDate <= startDate) {
        newErrors.valid_until = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        discount_value: Number(formData.discount_value),
        max_uses: Number(formData.max_uses),
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_until: new Date(formData.valid_until).toISOString()
      });
      // Reset form
      setFormData({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        max_uses: '',
        valid_from: '',
        valid_until: '',
        theme: 'premium'
      });
      onClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;


//   generate a random coupon code
    const generateCouponCode = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 10; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      setFormData(prev => ({
        ...prev,
        code
      }));
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blur Background */}
      <div 
        className="absolute inset-0  bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Form Container - Reduced max-width for mobile */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[90vw] sm:max-w-md mx-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Create Coupon</h2>
              <p className="text-purple-100 text-sm mt-1">Fill in the details below</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-purple-200 transition-colors duration-200 p-2 rounded-full hover:bg-white hover:bg-opacity-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Coupon Code */}
          <div>
            <div className='flex justify-between items-center mb-[15px]'>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Coupon Code *
            </label>
                <button type="button" onClick={generateCouponCode} className='px-4 py-2 bg-blue-600 text-sm text-white rounded-md hover:bg-blue-700 transition-all'>
                  Generate Coupon Code
                </button>
            </div>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., BLACKFRIDAY50"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.code ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.code}
              </p>
            )}
          </div>

          {/* Discount Type and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount Type *
              </label>
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                name="discount_value"
                value={formData.discount_value}
                onChange={handleChange}
                placeholder={formData.discount_type === 'percentage' ? 'e.g., 50' : 'e.g., 25'}
                min="1"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.discount_value ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.discount_value && (
                <p className="text-red-500 text-xs mt-2">{errors.discount_value}</p>
              )}
            </div>
          </div>

          {/* Max Uses */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Maximum Uses *
            </label>
            <input
              type="number"
              name="max_uses"
              value={formData.max_uses}
              onChange={handleChange}
              placeholder="e.g., 100"
              min="1"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.max_uses ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.max_uses && (
              <p className="text-red-500 text-xs mt-2">{errors.max_uses}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valid From *
              </label>
              <input
                type="date"
                name="valid_from"
                value={formData.valid_from}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.valid_from ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.valid_from && (
                <p className="text-red-500 text-xs mt-2">{errors.valid_from}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valid Until *
              </label>
              <input
                type="date"
                name="valid_until"
                value={formData.valid_until}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.valid_until ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.valid_until && (
                <p className="text-red-500 text-xs mt-2">{errors.valid_until}</p>
              )}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Coupon Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'premium', label: 'Premium', color: 'from-purple-500 to-pink-500' },
                { value: 'gold', label: 'Gold', color: 'from-yellow-500 to-orange-500' },
                { value: 'black', label: 'Black', color: 'from-gray-800 to-black' }
              ].map((theme) => (
                <label
                  key={theme.value}
                  className={`relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all duration-200 ${
                    formData.theme === theme.value
                      ? 'border-blue-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    checked={formData.theme === theme.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-8 h-2 mx-auto rounded-full bg-gradient-to-r ${theme.color} mb-2`} />
                  <span className="text-sm font-medium text-gray-700">{theme.label}</span>
                </label>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Create Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponForm;