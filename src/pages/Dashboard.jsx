import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('week');
  const [salesData, setSalesData] = useState({});

  // Mock data - in real app, this would come from API
  const dashboardData = {
    revenue: 124580,
    totalInventories: 3421,
    totalOrders: 892,
    growth: 12.5,
    previousRevenue: 110650
  };

  const topProducts = [
    { name: 'Premium Chronograph', sales: 156, revenue: 62400 },
    { name: 'Luxury Sneakers', sales: 89, revenue: 26700 },
    { name: 'Designer Handbag', sales: 67, revenue: 40200 },
    { name: 'Signature Perfume', sales: 134, revenue: 26800 },
    { name: 'Limited Edition Watch', sales: 23, revenue: 34500 },
  ];

  // Chart data configuration
  const chartData = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      sales: [12500, 18200, 15800, 19700, 22400, 18900, 17100],
      orders: [45, 78, 62, 89, 104, 92, 76],
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      sales: [65200, 78400, 89200, 101500],
      orders: [210, 256, 298, 345],
    },
    year: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      sales: [98500, 112000, 124500, 118000, 132000, 145000, 156000, 142000, 138000, 151000, 167000, 184000],
      orders: [345, 398, 423, 401, 456, 489, 512, 478, 465, 498, 523, 567],
    },
  };

  const lineChartData = {
    labels: chartData[timeFilter].labels,
    datasets: [
      {
        label: 'Revenue',
        data: chartData[timeFilter].sales,
        borderColor: '#000000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#000000',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  };

  const ordersChartData = {
    labels: chartData[timeFilter].labels,
    datasets: [
      {
        label: 'Orders',
        data: chartData[timeFilter].orders,
        backgroundColor: 'rgba(139, 69, 19, 0.8)',
        borderColor: '#8B4513',
        borderWidth: 1,
      },
    ],
  };

  const productChartData = {
    labels: topProducts.map(product => product.name),
    datasets: [
      {
        data: topProducts.map(product => product.sales),
        backgroundColor: [
          '#000000',
          '#8B4513',
          '#2F4F4F',
          '#696969',
          '#D4AF37',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const ordersChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-screen bg-gray-50 px-6 py-8 w-full overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your luxury commerce dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">REVENUE</h3>
            <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
              <span className="text-green-600 text-xs font-medium">+{dashboardData.growth}%</span>
            </div>
          </div>
          <p className="text-2xl font-light text-gray-900 mb-2">
            ${dashboardData.revenue.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm">
            Previous: ${dashboardData.previousRevenue.toLocaleString()}
          </p>
        </div>

        {/* Inventories Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">INVENTORIES</h3>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <p className="text-2xl font-light text-gray-900 mb-2">
            {dashboardData.totalInventories.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm">Active products in stock</p>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">ORDERS</h3>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <p className="text-2xl font-light text-gray-900 mb-2">
            {dashboardData.totalOrders.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm">Processed this period</p>
        </div>

        {/* Growth Card */}
        <div className="bg-black p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 text-sm font-medium">PERFORMANCE</h3>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <p className="text-2xl font-light mb-2">+{dashboardData.growth}%</p>
          <p className="text-gray-300 text-sm">Revenue growth rate</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">REVENUE ANALYTICS</h3>
            <div className="flex space-x-2">
              {['week', 'month', 'year'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    timeFilter === filter
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">ORDERS VOLUME</h3>
            <div className="text-sm text-gray-500">Total: {dashboardData.totalOrders}</div>
          </div>
          <div className="h-80">
            <Bar data={ordersChartData} options={ordersChartOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-6">TOP SELLING PRODUCTS</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                       style={{ backgroundColor: ['#000000', '#8B4513', '#2F4F4F', '#696969', '#D4AF37'][index] }}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} units sold</p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">${product.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-6">SALES DISTRIBUTION</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={productChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                    },
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;