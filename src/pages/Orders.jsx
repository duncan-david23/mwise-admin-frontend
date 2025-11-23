import React, { useState } from 'react';

const Orders = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      customer: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567'
      },
      status: 'delivered',
      total: 299.99,
      items: [
        { name: 'AirPods Pro', quantity: 1, price: 249.99, sku: 'APPRO-2024' },
        { name: 'Apple Care+', quantity: 1, price: 50.00, sku: 'ACARE-2024' }
      ],
      shipping: {
        address: '123 Main St, New York, NY 10001',
        carrier: 'UPS',
        tracking: '1Z999AA10123456784',
        cost: 9.99,
        estimatedDelivery: '2024-01-18'
      }
    },
    {
      id: 'ORD-002',
      date: '2024-01-14',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 987-6543'
      },
      status: 'processing',
      total: 1799.99,
      items: [
        { name: 'iPhone 15 Pro', quantity: 1, price: 999.99, sku: 'IP15P-256' },
        { name: 'MagSafe Charger', quantity: 1, price: 39.99, sku: 'MAGSafe-CH' },
        { name: 'Silicon Case', quantity: 2, price: 49.99, sku: 'CASE-SIL-BL' }
      ],
      shipping: {
        address: '456 Oak Ave, Los Angeles, CA 90210',
        carrier: 'FedEx',
        tracking: '789123456789',
        cost: 14.99,
        estimatedDelivery: '2024-01-20'
      }
    },
    {
      id: 'ORD-003',
      date: '2024-01-13',
      customer: {
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1 (555) 456-7890'
      },
      status: 'shipped',
      total: 129.99,
      items: [
        { name: 'AirTag 4-pack', quantity: 1, price: 99.99, sku: 'ATAG-4PK' },
        { name: 'AirTag Key Ring', quantity: 1, price: 29.99, sku: 'KEYRING-BLK' }
      ],
      shipping: {
        address: '789 Pine Rd, Chicago, IL 60601',
        carrier: 'USPS',
        tracking: '9205590164917312345674',
        cost: 5.99,
        estimatedDelivery: '2024-01-17'
      }
    }
  ]);

  const statusOptions = [
    { value: 'processing', label: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusCount = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  return (
    <div className='px-6 py-4 h-screen flex flex-col '>
      {/* Header with Stats - Fixed height */}
      <div className='mb-6 flex-shrink-0'>
        <div className='flex justify-between items-center mb-4'>
          <div>
            <h1 className='text-2xl font-light text-gray-900 mb-1'>Order Management</h1>
            <p className='text-sm text-gray-600'>Admin dashboard for managing customer orders</p>
          </div>
          <div className='text-right'>
            <p className='text-xl font-semibold text-gray-900'>{orders.length} Orders</p>
            <p className='text-xs text-gray-500'>Total in system</p>
          </div>
        </div>

        {/* Status Overview - Compact */}
        <div className='grid grid-cols-5 gap-3'>
          {statusOptions.map((status) => (
            <div key={status.value} className='bg-white p-3 rounded-lg shadow-sm border text-center'>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-1 ${status.color}`}>
                {status.label}
              </div>
              <p className='text-lg font-bold text-gray-900'>{getStatusCount(status.value)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Orders List - Scrollable area */}
      <div className='flex-1 overflow-auto space-y-3 pb-4'>
        {orders.map((order) => (
          <div key={order.id} className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
            {/* Order Summary - Always Visible */}
            <div 
              className='p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200'
              onClick={() => toggleOrder(order.id)}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4 flex-1 min-w-0'>
                  <div className='flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0'>
                    <svg className='w-4 h-4 text-gray-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h3 className='font-semibold text-gray-900 truncate'>{order.id}</h3>
                    <p className='text-xs text-gray-500'>{order.date}</p>
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs text-gray-600'>Customer</p>
                    <p className='font-medium text-gray-900 truncate'>{order.customer.name}</p>
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs text-gray-600'>Email</p>
                    <p className='font-medium text-gray-900 text-xs truncate'>{order.customer.email}</p>
                  </div>
                </div>

                <div className='flex items-center space-x-4 ml-4 flex-shrink-0'>
                  <div className='text-right'>
                    <p className='text-xs text-gray-600'>Total</p>
                    <p className='font-semibold text-gray-900'>${order.total}</p>
                  </div>
                  
                  {/* Status Dropdown */}
                  <div className='relative'>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`appearance-none px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(order.status)} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className='pointer-events-none absolute inset-y-0 right-1 flex items-center'>
                      <svg className='w-3 h-3 text-current' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className={`transform transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-180' : ''}`}>
                    <svg className='w-4 h-4 text-gray-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details - Expandable */}
            {expandedOrder === order.id && (
              <div className='border-t border-gray-100 px-4 py-4 bg-gray-50'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {/* Order Items */}
                  <div>
                    <h4 className='font-semibold text-gray-900 mb-3 text-sm'>Order Items</h4>
                    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                      <div className='overflow-x-auto'>
                        <table className='w-full min-w-[500px]'>
                          <thead className='bg-gray-50'>
                            <tr>
                              <th className='px-3 py-2 text-left text-xs font-medium text-gray-700'>Product</th>
                              <th className='px-3 py-2 text-left text-xs font-medium text-gray-700'>SKU</th>
                              <th className='px-3 py-2 text-left text-xs font-medium text-gray-700'>Qty</th>
                              <th className='px-3 py-2 text-left text-xs font-medium text-gray-700'>Price</th>
                              <th className='px-3 py-2 text-left text-xs font-medium text-gray-700'>Total</th>
                            </tr>
                          </thead>
                          <tbody className='divide-y divide-gray-200'>
                            {order.items.map((item, index) => (
                              <tr key={index}>
                                <td className='px-3 py-2 text-xs font-medium text-gray-900'>{item.name}</td>
                                <td className='px-3 py-2 text-xs text-gray-500'>{item.sku}</td>
                                <td className='px-3 py-2 text-xs text-gray-500'>{item.quantity}</td>
                                <td className='px-3 py-2 text-xs text-gray-500'>${item.price}</td>
                                <td className='px-3 py-2 text-xs font-medium text-gray-900'>
                                  ${(item.price * item.quantity).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className='bg-gray-50'>
                            <tr>
                              <td colSpan="4" className='px-3 py-2 text-xs font-medium text-gray-900 text-right'>Subtotal</td>
                              <td className='px-3 py-2 text-xs font-medium text-gray-900'>
                                ${(order.total - order.shipping.cost).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="4" className='px-3 py-2 text-xs font-medium text-gray-900 text-right'>Shipping</td>
                              <td className='px-3 py-2 text-xs font-medium text-gray-900'>${order.shipping.cost}</td>
                            </tr>
                            <tr>
                              <td colSpan="4" className='px-3 py-2 text-xs font-bold text-gray-900 text-right'>Total</td>
                              <td className='px-3 py-2 text-xs font-bold text-gray-900'>${order.total}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Customer & Shipping Information */}
                  <div className='space-y-4'>
                    {/* Customer Information */}
                    <div className='bg-white rounded-lg border border-gray-200 p-4'>
                      <h4 className='font-semibold text-gray-900 mb-3 text-sm'>Customer Information</h4>
                      <div className='space-y-2 text-xs'>
                        <div className='flex justify-between'>
                          <span className='text-gray-600 font-medium'>Name:</span>
                          <span className='text-gray-900'>{order.customer.name}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-600 font-medium'>Email:</span>
                          <span className='text-gray-900 truncate'>{order.customer.email}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-600 font-medium'>Phone:</span>
                          <span className='text-gray-900'>{order.customer.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div className='bg-white rounded-lg border border-gray-200 p-4'>
                      <h4 className='font-semibold text-gray-900 mb-3 text-sm'>Shipping Information</h4>
                      <div className='space-y-2 text-xs'>
                        <div>
                          <p className='text-gray-900 font-medium'>Address:</p>
                          <p className='text-gray-600 mt-1'>{order.shipping.address}</p>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Carrier: {order.shipping.carrier}</span>
                          <span className='text-blue-600 font-medium'>Track: {order.shipping.tracking}</span>
                        </div>
                        <div className='text-gray-600'>
                          Est. Delivery: {order.shipping.estimatedDelivery}
                        </div>
                        <div className='text-gray-600'>
                          Shipping Cost: ${order.shipping.cost}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;