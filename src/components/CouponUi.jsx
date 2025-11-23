import React, { useRef, useEffect, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import axios from 'axios';
import { supabase } from "../utils/Supabase";

const CouponUi = ({ 
  code = "BLACKFRIDAY50",
  discount_type = "percentage",
  discount_value = 50,
  max_uses = 100,
  valid_from = "2025-10-01T00:00:00Z",
  valid_until = "2025-12-31T23:59:59Z",
  companyName = "Your Company",
  theme = "premium",
  is_active,
  uses_count = 0,
  showDevInfo = true,
  onDelete
}) => {
  const [companyLogo, setCompanyLogo] = useState(null);
  const couponRef = useRef(null);

  useEffect(() => {
    const fetchCompanyLogo = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) return;

        const accessToken = session.access_token;
        const response = await axios.get(
          "http://192.168.100.126:3001/api/settings/account-settings",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.data.data) {
          setCompanyLogo(response.data.data.profile_image_url || null);
        }
      } catch (error) {
        console.error("❌ Error fetching company logo:", error);
      }
    };

    fetchCompanyLogo();
  }, []);

  const downloadCoupon = async () => {
    try {
      if (couponRef.current) {
        // Set mobile-friendly dimensions for download
        const mobileWidth = 375; // Standard mobile width
        const mobileHeight = 200; // Appropriate height for mobile
        
        const dataUrl = await htmlToImage.toPng(couponRef.current, {
          cacheBust: true,
          pixelRatio: 2, // Good quality without being too large
          width: mobileWidth,
          height: mobileHeight,
          style: {
            width: `${mobileWidth}px`,
            height: `${mobileHeight}px`,
            transform: 'none'
          }
        });

        const link = document.createElement('a');
        link.download = `coupon-${code}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Error downloading coupon:', error);
      alert('Error downloading coupon. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isExpired = new Date() > new Date(valid_until);

  const getDiscountText = () => {
    if (discount_type === 'percentage') {
      return `${discount_value}% OFF`;
    } else if (discount_type === 'fixed') {
      return `$${discount_value} OFF`;
    }
    return `${discount_value} OFF`;
  };

  const themes = {
    premium: {
      discountGradient: 'bg-gradient-to-br from-purple-600 via-purple-400 to-pink-400',
      discountText: 'text-white',
      border: 'border-purple-200'
    },
    gold: {
      discountGradient: 'bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-300',
      discountText: 'text-gray-900',
      border: 'border-yellow-200'
    },
    black: {
      discountGradient: 'bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-500',
      discountText: 'text-white',
      border: 'border-gray-300'
    },
    purple: {
      discountGradient: 'bg-gradient-to-br from-purple-900 via-purple-600 to-purple-400',
      discountText: 'text-white',
      border: 'border-purple-200'
    }
  };

  const currentTheme = themes[theme] || themes.gold;

  return (
    <div className="w-full max-w-sm border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className='flex items-center justify-end mb-3'>
        <svg onClick={onDelete}  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 hover:cursor-pointer hover:text-purple-600 transition-all text-gray-400 hover:scale-105">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      {showDevInfo && (
        <div className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm mb-3">
          <div className="text-xs font-semibold text-gray-700 mb-2">COUPON INFO</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <div className="text-gray-600 text-[10px]">Max Uses</div>
              <div className="font-semibold">{max_uses}</div>
            </div>
            <div>
              <div className="text-gray-600 text-[10px]">Coupon Uses</div>
              <div className="font-semibold">{uses_count}</div>
            </div>
            <div>
              <div className="text-gray-600 text-[10px]">Status</div>
              <div className={`font-semibold ${is_active ? 'text-green-500' : 'text-gray-400'}`}>
                {is_active ? 'Active' : 'Expired'}
              </div>
            </div>
            <div>
              <div className="text-gray-600 text-[10px]">Valid From</div>
              <div className="font-semibold text-[10px]">{formatDate(valid_from)}</div>
            </div>
            <div>
              <div className="text-gray-600 text-[10px]">Valid Until</div>
              <div className="font-semibold text-[10px]">{formatDate(valid_until)}</div>
            </div>
            <div>
              <div className="font-semibold text-[10px] py-[5px] text-blue-600">{uses_count === max_uses ? 'Limit Reached' : 'Available'}</div>
            </div>
          </div>
        </div>
      )}

      <div className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm">
        <div 
          ref={couponRef}
          className="flex items-stretch rounded-lg overflow-hidden shadow-lg bg-white"
        >
          {/* Left Side */}
          <div className={`${currentTheme.discountGradient} p-4 flex flex-col justify-center items-center ${currentTheme.discountText} min-w-[80px] relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"></div>
            <div className="text-2xl font-black leading-none relative z-10">{discount_value}</div>
            <div className="text-sm font-bold mt-1 relative z-10">OFF</div>
          </div>

          {/* Middle */}
          <div className="flex-1 p-3 bg-gray-50 flex flex-col justify-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
              Discount Coupon
            </div>
            <div className="text-sm font-black text-gray-900 mb-2">
              {getDiscountText()}
            </div>
            <div className="text-base font-mono font-bold text-gray-800 bg-gray-50 px-3 py-2 rounded border border-dashed border-gray-300">
              {code}
            </div>
            <div className="text-xs text-gray-600 mt-2">
              Valid until: <span className="font-semibold">{formatDate(valid_until)}</span>
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-gray-50 p-3 flex items-center justify-center min-w-[70px] border-l border-gray-200">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                crossOrigin="anonymous"
                className="max-w-[50px] max-h-[40px] object-contain"
              />
            ) : (
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm mx-auto mb-1">
                  {companyName.charAt(0)}
                </div>
                <div className="text-xs font-semibold text-gray-700">{companyName}</div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-3">
          <button
            onClick={downloadCoupon}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Download Coupon
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponUi;