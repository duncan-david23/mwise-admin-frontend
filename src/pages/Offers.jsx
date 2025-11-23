import React, { useState, useEffect } from 'react';
import CouponUi from '../components/CouponUi';
import CreateCouponForm from '../components/CreateCoupon';
import axios from 'axios';
import { supabase } from '../utils/Supabase';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { useAppContext } from '../contexts/AppContext';

const Coupons = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const { setDisplayConfirmModal, displayConfirmModal } = useAppContext();

  // Filter coupons based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCoupons(coupons);
    } else {
      const filtered = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.discount_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCoupons(filtered);
    }
  }, [searchTerm, coupons]);

  const handleCreateCoupon = async (couponData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const accessToken = session.access_token;
      const response = await axios.post(
        'http://192.168.100.126:3001/api/coupons/add-coupon',
        couponData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const newCoupon = response.data.coupon;
      setCoupons((prev) => [...prev, newCoupon]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  const handleDeleteCoupon = (couponId) => {
    setCouponToDelete(couponId);
    setDisplayConfirmModal(true);
  };

  const confirmDeleteCoupon = async () => {
    try {
      const token = await supabase.auth.getSession().then(({ data: { session } }) => session?.access_token);
      if (!token) throw new Error('User not authenticated');

      const response = await axios.delete(
        'http://192.168.100.126:3001/api/coupons/delete-coupon',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: couponToDelete },
        }
      );

      console.log('✅ Coupon deleted:', response.data);
      setCoupons((prev) => prev.filter((c) => c.id !== couponToDelete));
      setCouponToDelete(null);
      setDisplayConfirmModal(false);
    } catch (error) {
      console.error('❌ Error deleting coupon:', error.response?.data || error.message);
      setDisplayConfirmModal(false);
    }
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const accessToken = session.access_token;
        const response = await axios.get('http://192.168.100.126:3001/api/coupons/get-coupons', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCoupons(response.data.coupons);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };

    fetchCoupons();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <>
      <div className='px-[30px] relative flex-1 pt-[30px] w-[1000px] h-[100vh] overflow-y-auto pb-[50px]'>
        <CreateCouponForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleCreateCoupon} />

        <h1 className='font-bold text-xl'>All Coupons</h1>

        <div className='flex gap-2 absolute top-[80px] right-[30px]'>
          <button
            className='bg-blue-600 w-[180px] flex items-center gap-[10px] justify-center text-white px-[10px] py-[10px] rounded-md hover:bg-blue-700 transition-all'
            onClick={() => setIsFormOpen(true)}
          >
            Create Coupon
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='size-5'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
          </button>
        </div>

        <div className='flex gap-[10px] mt-[100px] mb-[20px] items-center justify-between border border-gray-300 rounded px-3 text-sm w-[330px]'>
          <input
            type='text'
            placeholder='Search coupons...'
            value={searchTerm}
            onChange={handleSearch}
            className='outline-none py-[10px] w-full'
          />
          {searchTerm ? (
            <button onClick={clearSearch} className='hover:text-red-500 transition-all'>
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='size-6'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          ) : (
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='size-6 hover:cursor-pointer hover:text-purple-600 transition-all text-gray-400'>
              <path strokeLinecap='round' strokeLinejoin='round' d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' />
            </svg>
          )}
        </div>

        {/* Search results info */}
        {searchTerm && (
          <div className='mb-4 text-sm text-gray-600'>
            Found {filteredCoupons.length} coupon{filteredCoupons.length !== 1 ? 's' : ''} matching "{searchTerm}"
            {filteredCoupons.length === 0 && coupons.length > 0 && (
              <button 
                onClick={clearSearch}
                className='ml-2 text-blue-600 hover:text-blue-800 underline'
              >
                Clear search
              </button>
            )}
          </div>
        )}

        <div className='flex items-center gap-[15px]'>
          <button className='outline-none border-green-300 text-green-600 border px-[10px] py-[3px] text-xs rounded-lg'>Active</button>
        </div>

        <div className='mt-[20px] flex flex-wrap items-center gap-[30px]'>
          {filteredCoupons.length > 0 ? (
            filteredCoupons.map((coupon) => (
              <CouponUi key={coupon.id} {...coupon} onDelete={() => handleDeleteCoupon(coupon.id)} />
            ))
          ) : searchTerm ? (
            <div className='w-full text-center py-8 text-gray-500'>
              No coupons found matching "{searchTerm}"
            </div>
          ) : coupons.length === 0 ? (
            <div className='w-full text-center py-8 text-gray-500'>
              No coupons created yet. Click "Create Coupon" to get started.
            </div>
          ) : null}
        </div>
      </div>

      {displayConfirmModal && (
        <ConfirmDeleteModal
          onConfirm={confirmDeleteCoupon}
          onCancel={() => setDisplayConfirmModal(false)}
        />
      )}
    </>
  );
};

export default Coupons;