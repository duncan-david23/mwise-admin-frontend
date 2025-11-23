import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose, IoMdCheckmarkCircle } from "react-icons/io";
import { useAppContext } from '../contexts/AppContext';
import axios from 'axios'
import toast from 'react-hot-toast';



const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  const { displayConfirmModal, setDisplayConfirmModal, setConfirmStatus, confirmStatus } = useAppContext();



   const handleCloseDisplayModal = ()=> {
        setDisplayConfirmModal(false)
        setConfirmStatus(false)
        onCancel && onCancel();
   }

   const handleConfirmDelete = () => {
     onConfirm();
     setDisplayConfirmModal(false);
     setConfirmStatus(false);
   };



  return (
    <AnimatePresence>
      {displayConfirmModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"

        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl w-[400px] max-w-[400px] max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex justify-between items-center">
              <h1 className="text-sm text-gray-800 text-center font-thin">Are you sure you want to delete selected item(s)?</h1>
              <button 
                onClick={() => setConfirmStatus(true)}
                className="text-gray-400 hover:text-gray-600 transition-colors "
              >
                <IoMdClose size={24} onClick={handleCloseDisplayModal} />
              </button>
            </div>

           
           

            <div className="mt-[30px] m-auto flex flex-col items-center gap-4">
                 <button onClick={handleConfirmDelete} className='py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all mb-5 w-[200px] text-center m-auto'> Confirm </button>
            </div>
            


           

              
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;