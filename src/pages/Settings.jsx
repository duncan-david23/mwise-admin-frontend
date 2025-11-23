import React, { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, Save, User, Mail, Phone } from 'lucide-react';
import axios from 'axios'
import { supabase } from "../utils/supabase";



const AccountSettings = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Essential profile data only
  const [profileData, setProfileData] = useState({
    display_name: 'Admin User',
    email: 'admin@store.com',
    phone_number: '+1 (555) 123-4567',
  });

  const [imagePreview, setImagePreview] = useState('');

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.error("❌ No active session. User not logged in.");
      setIsLoading(false);
      return;
    }

    const accessToken = session.access_token;

    const submitData = new FormData();
    submitData.append("display_name", profileData.display_name);
    submitData.append("phone_number", profileData.phone_number);
    submitData.append("email", profileData.email);

    if (profileData.profile_image) {
      submitData.append("profile_image", profileData.profile_image);
    }

    const response = await axios.put(
      "http://192.168.100.126:3001/api/settings/account-settings",
      submitData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Update successful:", response.data);
  } catch (error) {
    console.error("❌ Error updating account:", error.response?.data || error.message);
  } finally {
    setIsLoading(false);
  }
};


  const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setProfileData(prev => ({
    ...prev,
    profile_image: file
  }));

  const reader = new FileReader();
  reader.onload = (e) => setImagePreview(e.target.result);
  reader.readAsDataURL(file);
};



useEffect(() => {
    const fetchAccountSettings = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          console.error("❌ No active session.");
          return;
        }

        const accessToken = session.access_token;

        const response = await axios.get(
          "http://192.168.100.126:3001/api/settings/account-settings",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.data.data) {
          setProfileData({
            display_name: response.data.data.display_name || '',
            phone_number: response.data.data.phone_number || '',
            email : response.data.data.email,
            profile_image: null, // don’t preload File, keep it null
          });

          if (response.data.data.profile_image_url) {
            setImagePreview(response.data.data.profile_image_url); // ✅ existing image URL
          }
        }
      } catch (error) {
        console.error("❌ Error fetching account settings:", error);
      }
    };

    fetchAccountSettings();
  }, []);





  const handleDeleteAvatar = () => {
    setImagePreview('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Luxury Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white font-light text-sm">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-light text-gray-900 tracking-wide">PROFILE SETTINGS</h1>
                <p className="text-gray-500 text-sm font-light">Admin account information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          {/* Profile Header */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-2 tracking-wide">ADMIN PROFILE</h2>
            <p className="text-gray-500 font-light">Manage your administrator account details</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Image - Luxury Style */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-xl">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex space-x-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="p-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300">
                          <Camera className="w-4 h-4" />
                        </div>
                      </label>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={handleDeleteAvatar}
                          className="p-3 bg-white text-gray-900 border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-light text-gray-900 mb-2">Profile Photo</h3>
                  <p className="text-gray-500 text-sm font-light">
                    JPG, PNG, max 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Essential Form Fields - Luxury Style */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-light text-gray-900 mb-6 tracking-wide">ACCOUNT INFORMATION</h3>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="flex items-center text-sm font-light text-gray-700 tracking-wide">
                      <User className="w-4 h-4 mr-2" />
                      DISPLAY NAME
                    </label>
                    <input
                      type="text"
                      value={profileData.display_name}
                      onChange={(e) => handleProfileChange('display_name', e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 font-light"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center text-sm font-light text-gray-700 tracking-wide">
                      <Mail className="w-4 h-4 mr-2" />
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 font-light"
                      placeholder="admin@store.com"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center text-sm font-light text-gray-700 tracking-wide">
                      <Phone className="w-4 h-4 mr-2" />
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone_number}
                      onChange={(e) => handleProfileChange('phone_number', e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 font-light"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {/* Save Button - Luxury Style */}
                <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                  >
                    <Save className="w-5 h-5" />
                    <span>{isLoading ? 'SAVING...' : 'SAVE CHANGES'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;