import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const [msg, setMsg] = useState('')
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    });

        if (error) {
            setMsg(error.message);
            return
        }
  
      // setUserAuth(data.user);
      navigate('/products');
      notify();
  } catch (error) {
    console.error('Error signing in:', error);
    setMsg( 'An error occurred during sign in, please check your details and try again.');
  }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-50 px-4 py-6 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900">AdminKit</span>
        </div>
      </div>

      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 lg:py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left">
            {/* Desktop Logo */}
            <div className="hidden lg:flex items-center mb-8">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">AdminKit</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Sign in to dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto lg:mx-0">
              Enter your credentials to access your admin panel
            </p>
          </div>
              <p className='text-sm mt-[30px] mb-[-30px]'>{msg}</p>
          <div className="mt-8 lg:mt-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 text-base"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 text-base"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <label htmlFor="rememberMe" className="block ml-2 text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-gray-700 hover:text-black transition-colors duration-200 text-sm">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 font-medium text-base"
                >
                  Sign in
                </button>
                <div>
                  <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="/register" className="font-medium text-gray-700 hover:text-black transition-colors duration-200">
                      Sign up
                    </a>
                  </p>
                </div>
              </div>
            </form>

            {/* Mobile Stats */}
            <div className="lg:hidden mt-8">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">99.9%</div>
                  <div className="text-xs text-gray-600">Uptime</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">256-bit</div>
                  <div className="text-xs text-gray-600">Encryption</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">24/7</div>
                  <div className="text-xs text-gray-600">Support</div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Secure admin access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Illustration (Desktop only) */}
      <div className="hidden lg:flex relative flex-1 bg-line-to-br from-gray-50 to-gray-100">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-8 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ecommerce Admin Suite
            </h3>
            <p className="text-gray-600 mb-8">
              Manage your store, track orders, and analyze performance from one powerful dashboard.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-gray-900">256-bit</div>
                <div className="text-sm text-gray-600">Encryption</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login