import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Offers from './pages/Offers'
import Newsletter from './pages/Newsletter'
import Messages from './pages/Messages'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import Inventory from './pages/Inventory'
import Sidebar from './components/Sidebar'
import { useLocation } from 'react-router-dom'
import AuthWrapper from './components/AuthWrapper'
import AddProduct from './pages/AddProduct'
import { Toaster } from 'react-hot-toast'


const App = () => {
  const location = useLocation()
  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname)

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    )
  }

  return (
    <>
      <Toaster />
      <div className="flex">
        <Sidebar />
        <Routes>
          <Route path="/dashboard" element={
            <AuthWrapper>
              <Dashboard />
            </AuthWrapper>
          } />
          <Route path="/products" element={
            <AuthWrapper>
            <Products />
          </AuthWrapper>
        } />
        <Route path="/orders" element={
          <AuthWrapper>
            <Orders />
          </AuthWrapper>
        } />
        <Route path="/offers" element={
          <AuthWrapper>
            <Offers />
          </AuthWrapper>
        } />
        <Route path="/newsletter" element={
          <AuthWrapper>
            <Newsletter />
          </AuthWrapper>
        } />
        <Route path="/messages" element={
          <AuthWrapper>
            <Messages />
          </AuthWrapper>
        } />
        <Route path="/settings" element={
          <AuthWrapper>
            <Settings />
          </AuthWrapper>
        } />
        <Route path="/inventory" element={
          <AuthWrapper>
            <Inventory />
          </AuthWrapper>
        } />
        <Route path="/products/add-product" element={
          <AuthWrapper>
            <AddProduct />
          </AuthWrapper>
        } />
      </Routes>
    </div>
    </>
  )
}

export default App