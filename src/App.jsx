import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
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
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    )
  }

  return (
    <>
      <Toaster />
      <div className="flex">
        <Sidebar />
        <Routes>
          <Route path="/products" element={
            <AuthWrapper>
            <Products />
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