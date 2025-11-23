import React, {useState, useEffect} from 'react'
// import Lottie from "lottie-react";
// import loader_dots from '../animation/loader_dots.json';
import axios from 'axios';
import { supabase } from '../utils/supabase';
import { useAppContext } from '../contexts/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const { setShowAddProduct, selectedProduct, setSelectedProduct } = useAppContext();
  const [colorInput, setColorInput] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [gender, setGender] = useState('');
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [stock, setStock] = useState('');
  const [discountType, setDiscountType] = useState('');
 const [images, setImages] = useState(Array(6).fill(null));
 const [previewIndex, setPreviewIndex] = useState(0);
  const [productData, setProductData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [imgArr, setImgArr] = useState([]);

  

  const prod_data = {
      product_name: productName,
      product_description: description,
      product_price: price,
      product_discount: discount,
      product_stock: stock,
      product_discount_type: discountType,
      product_categories: categories,
      product_sizes: selectedSizes,
      product_colors: selectedColors, 
      product_images: imgArr,
      gender: gender,
      sales_price: (price - (price * (discount / 100))).toFixed(2),
      status: stock > 0 ? 'In Stock' : 'Out of Stock',
      skuid: `SKU${Math.floor(100000 + Math.random() * 900000)}`,
    };

  
    // Submit Product (Create or Update)

 const submitProduct = async () => {
  setIsAdding(true);

  let accessToken = null;
  let userId = null;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    accessToken = session.access_token;
    userId = session.user.id;
  } else {
    console.error("❌ No active session. User is not logged in.");
    setIsAdding(false);
    return;
  }

  try {
    const formData = new FormData();

    // ✅ Append product fields
    formData.append("public_key", userId);
    formData.append("skuid", prod_data.skuid);
    formData.append("product_name", prod_data.product_name);
    formData.append("product_description", prod_data.product_description);
    formData.append("product_price", prod_data.product_price);
    formData.append("sales_price", prod_data.sales_price);
    formData.append("product_discount", prod_data.product_discount);
    formData.append("product_discount_type", prod_data.product_discount_type);
    formData.append("gender", prod_data.gender);
    formData.append("product_stock", prod_data.product_stock);
    formData.append("status", prod_data.status || "In Stock");
    formData.append(
      "product_categories",
      JSON.stringify(prod_data.product_categories || [])
    );
    formData.append(
      "product_sizes",
      JSON.stringify(prod_data.product_sizes || [])
    );
    formData.append(
  "product_colors",
  JSON.stringify(prod_data.product_colors || [])
)

            // ✅ Separate new files vs existing URLs
        const newFiles = imgArr.filter((file) => file instanceof File);
        const existingUrls = imgArr.filter((file) => typeof file === "string");

        // Append new files
        newFiles.forEach((file) => {
          formData.append("product_images", file);
        });

        // Always send existing images (even if empty array)
        formData.append("existing_images", JSON.stringify(existingUrls));

    let response;
    if (selectedProduct) {
      // 🔄 Update existing product
      response = await axios.put(
        `https://mwsie-backend.onrender.com/api/ecommerce/products/${selectedProduct.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      // 🆕 Create new product
      response = await axios.post(
        "https://mwsie-backend.onrender.com/api/ecommerce/products/add-product",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }

    toast.success(`Product ${selectedProduct ? 'updated' : 'added'} successfully!`);

    // Reset state after submit
    setIsAdding(false);
    setCategories([]);
    setInput("");
    setProductName("");
    setDescription("");
    setPrice("");
    setDiscount("");
    setStock("");
    setDiscountType("");
    setSelectedSizes([]);
    setGender("");
    setImages(Array(6).fill(null));
    setImgArr([]);
    setPreviewIndex(0);
    setSelectedProduct(null);
    setShowAddProduct(false);
    setSelectedColors([]);
    setColorInput('');

  } catch (error) {
    setIsAdding(false);
    if (error.response) {
      console.error("❌ API error:", error.response.data);
    } else {
      console.error("❌ Request error:", error.message);
    }
  }
};

const handleColorKeyDown = (e) => {
  if (e.key === 'Enter' && colorInput.trim()) {
    e.preventDefault();
    const color = colorInput.trim();
    if (!selectedColors.includes(color)) {
      setSelectedColors([...selectedColors, color]);
    }
    setColorInput('');
  }
};

const removeColor = (color) => {
  setSelectedColors(selectedColors.filter(c => c !== color));
};



  const handleImageChange = (e, index) => {
  const file = e.target.files[0];
  if (!file) return;

  // Save the actual file instead of just file.name
  setImgArr((prev) => {
    const updated = [...prev];
    updated[index] = file; // ✅ keep the File object
    console.log("Updated imgArr (files):", updated);
    return updated;
  });

  // For preview, still use FileReader
  const reader = new FileReader();
  reader.onload = () => {
    setImages((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = reader.result;
      return updatedImages;
    });
    setPreviewIndex(index);
  };
  reader.readAsDataURL(file);
};


  // Handle adding categories when Enter is pressed

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!categories.includes(input.trim().toLowerCase())) {
        setCategories([...categories, input.trim().toLowerCase()]);
      }
      setInput('');
    }
  };

  const removeCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
  };

  
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const options = ['Male', 'Female', 'Unisex'];

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };


  useEffect(() => {
  if (selectedProduct) {
    setProductName(selectedProduct.product_name || "");
    setDescription(selectedProduct.product_description || "");
    setPrice(selectedProduct.product_price || "");
    setDiscount(selectedProduct.product_discount || "");
    setStock(selectedProduct.product_stock || "");
    setDiscountType(selectedProduct.product_discount_type || "");
    setCategories(selectedProduct.product_categories || []);
    setSelectedSizes(selectedProduct.product_sizes || []);
    setGender(selectedProduct.gender || "");
    setSelectedColors(selectedProduct.product_colors || []); // ✅ colors

    // Prefill images
    if (selectedProduct.product_images?.length) {
      setImages(selectedProduct.product_images.map((url) => url || null));

      // ✅ also push into imgArr for backend
      setImgArr(selectedProduct.product_images);
    } else {
      setImages(Array(6).fill(null));
      setImgArr([]);
    }
  }
}, [selectedProduct]);
  


  return (
    <div className='px-4 sm:px-6 lg:px-[30px] relative pt-20 sm:pt-6 lg:pt-[30px] flex-1 h-screen bg-gray-50 pb-4 sm:pb-6 lg:pb-[50px] overflow-scroll'>
      
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0'>
        <div className='flex items-center gap-2 sm:gap-2.5'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
          </svg>
          <h1 className='text-xl sm:text-2xl'>Add New Product</h1>
        </div>

        <div
          onClick={submitProduct}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full hover:bg-blue-700 transition-all bg-blue-600 cursor-pointer w-full sm:w-auto"
        >
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4 sm:size-5 text-white"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <button className="text-white text-sm sm:text-base">
                {selectedProduct ? "Update Product" : "Add Product"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Product Details Input - Responsive Layout */}
      <div className='mt-4 sm:mt-6 lg:mt-[30px] bg-white p-4 sm:p-6 lg:p-5 rounded-lg flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-5'>
        {/* Left Section - General Information */}
        <div className='w-full lg:w-[65%]'>
          <div className='py-4 sm:py-6 lg:py-5 bg-gray-50 px-4 sm:px-6 lg:px-5 rounded-lg'>
            <h1 className='text-lg sm:text-xl text-gray-600 mb-2 sm:mb-[5px]'>General Information</h1>

            <div className='mt-4 sm:mt-6 lg:mt-5'>
              <h1 className='font-thin text-sm sm:text-base'>Product Name</h1>
              <input 
                type='text' 
                placeholder='' 
                value={productName} 
                onChange={(e) => setProductName(e.target.value)} 
                className='w-full font-thin outline-none border-none bg-gray-100 px-4 sm:px-5 py-2 sm:py-2.5 rounded-md mt-2 sm:mt-5 text-sm sm:text-base' 
              />
            </div>

            <div className='mt-4 sm:mt-6 lg:mt-5'>
              <h1 className='font-thin text-sm sm:text-base'>Product Description</h1>
              <textarea 
                rows={4} 
                placeholder='' 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className='w-full font-thin outline-none border-none bg-gray-100 px-4 sm:px-5 py-2 sm:py-2.5 rounded-md mt-2 sm:mt-5 text-sm sm:text-base resize-none' 
              />
            </div>

            <div className='flex flex-col lg:flex-row mt-4 sm:mt-6 lg:mt-5 gap-4 sm:gap-6 lg:gap-10'>
              {/* Sizes */}
              <div className='w-full lg:w-auto'>
                <h1 className='font-thin text-sm sm:text-base'>Size</h1>
                <p className='text-gray-400 text-xs'>Pick Available Size</p>
                <div className='flex gap-2 sm:gap-2.5 mt-3 sm:mt-5 flex-wrap max-w-[280px]'>
                  {sizes.map((size) => (
                    <div key={size}>
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        className="hidden"
                        checked={selectedSizes.includes(size)}
                        onChange={() => toggleSize(size)}
                      />
                      <label
                        htmlFor={`size-${size}`}
                        className={`w-12 sm:w-[50px] h-10 sm:h-20 flex items-center font-thin justify-center rounded-md cursor-pointer transition-colors text-sm sm:text-base
                          ${selectedSizes.includes(size) ? 'bg-blue-500 text-white' : 'bg-white text-black border border-gray-300'}
                        `}
                      >
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className='w-full lg:w-auto'>
                <h1 className='font-thin text-sm sm:text-base'>Gender</h1>
                <p className='text-gray-400 text-xs'>Pick Available Gender</p>
                <div className="flex items-center gap-3 sm:gap-2.5 mt-3 sm:mt-[25px] flex-wrap">
                  {options.map((option) => (
                    <label
                      key={option}
                      htmlFor={`gender-${option.toLowerCase()}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="gender"
                        id={`gender-${option.toLowerCase()}`}
                        value={option}
                        checked={gender === option}
                        onChange={(e) => setGender(e.target.value)}
                        className="appearance-none w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-400 rounded-full checked:border-blue-600 checked:bg-blue-600 transition-colors"
                      />
                      <span className="text-gray-700 font-thin text-sm sm:text-base">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Upload Image */}
        <div className='w-full lg:w-[35%] border border-gray-50 p-4 sm:p-6 lg:p-5'>
          <h1 className='text-sm text-gray-500 mb-2'>Upload Image</h1>

          {/* Big Preview */}
          <div className='mb-4'>
            {images[previewIndex] ? (
              <img
                src={images[previewIndex]}
                alt='Preview'
                className='w-full h-48 sm:h-64 lg:h-[290px] object-contain rounded-md'
              />
            ) : (
              <div className='w-full h-48 sm:h-64 lg:h-[290px] flex items-center justify-center border border-dashed border-gray-300 rounded-md text-gray-400 text-sm'>
                No image selected
              </div>
            )}
          </div>

          {/* Thumbnails / Upload Slots */}
          <div className='grid grid-cols-3 gap-2'>
            {images?.map((img, idx) => (
              <label key={idx} className='relative cursor-pointer'>
                {img ? (
                  <img
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    onClick={() => setPreviewIndex(idx)}
                    className={`h-20 sm:h-24 w-full object-contain rounded-md border ${
                      previewIndex === idx ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <div className='h-20 sm:h-24 w-full flex items-center justify-center border border-dashed border-gray-300 rounded-md text-xs text-gray-400'>
                    Click to upload
                  </div>
                )}
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleImageChange(e, idx)}
                  className='absolute inset-0 opacity-0 cursor-pointer'
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Stock Section */}
      <div className='mt-4 sm:mt-6 lg:mt-[30px] bg-white p-4 sm:p-6 lg:p-5 rounded-lg flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-5'>
        {/* Left Section - Pricing */}
        <div className='w-full lg:w-[65%] bg-gray-50 p-4 sm:p-6 lg:p-5 rounded-lg'>
          <h1 className='text-lg sm:text-xl text-gray-600 mb-2 sm:mb-[5px]'>Pricing & Stock</h1>
          <div className='mt-4 sm:mt-6 lg:mt-5 flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-5'>
            <div className='w-full sm:w-1/2'>
              <div>
                <label htmlFor="price" className='text-sm text-gray-500 font-thin'>Price</label>
                <input 
                  type="text" 
                  id="price" 
                  placeholder='0.00' 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className='w-full font-thin bg-gray-100 rounded-md p-2 sm:p-2.5 mt-2 text-sm sm:text-base' 
                />
              </div>

              <div className='mt-4 sm:mt-6 lg:mt-5'>
                <label htmlFor="discount" className='text-sm text-gray-500 font-thin'>Discount %</label>
                <input 
                  type="number" 
                  id="discount" 
                  placeholder='0%' 
                  value={discount} 
                  onChange={(e) => setDiscount(e.target.value)} 
                  className='w-full font-thin bg-gray-100 rounded-md p-2 sm:p-2.5 mt-2 text-sm sm:text-base' 
                />
              </div>
            </div>

            <div className='w-full sm:w-1/2'>
              <div>
                <label htmlFor="stock" className='text-sm text-gray-500 font-thin'>Stock</label>
                <input 
                  type="number" 
                  id="stock" 
                  placeholder='0' 
                  value={stock} 
                  onChange={(e) => setStock(e.target.value)} 
                  className='w-full font-thin bg-gray-100 rounded-md p-2 sm:p-2.5 mt-2 text-sm sm:text-base' 
                />
              </div>

              <div className='mt-4 sm:mt-6 lg:mt-5'>
                <label htmlFor="discounttype" className='text-sm text-gray-500 font-thin'>Discount Type</label>
                <select 
                  id="discounttype" 
                  value={discountType} 
                  onChange={(e) => setDiscountType(e.target.value)} 
                  className='w-full font-thin bg-gray-100 rounded-md p-2 sm:p-2.5 mt-2 text-sm sm:text-base'
                >
                  <option value=''></option>
                  <option value='black-friday'>Black Friday</option>
                  <option value='xmas-slash'>Xmas Slash</option>
                  <option value='new-year-deal'>New Year Deal</option>
                  <option value='easter-special'>Easter Special</option>
                  <option value='back-to-school'>Back to School</option>
                  <option value='summer-sale'>Summer Sale</option>
                  <option value='winter-clearance'>Winter Clearance</option>
                  <option value='cyber-monday'>Cyber Monday</option>
                  <option value='flash-sale'>Flash Sale</option>
                  <option value='loyalty-reward'>Loyalty Reward</option>
                  <option value='first-time-user'>First-Time User</option>
                  <option value='regional-holiday'>Regional Holiday</option>
                  <option value='limited-time'>Limited Time</option>
                  <option value='clearance'>Clearance</option>
                  <option value='bundle-deal'>Bundle Deal</option>
                  <option value='student-discount'>Student Discount</option>
                  <option value='military-discount'>Military Discount</option>
                  <option value='birthday-special'>Birthday Special</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Categories & Colors */}
        <div className='w-full lg:w-[35%] bg-gray-50 p-4 sm:p-6 lg:p-5'>
          <h1 className='text-sm text-gray-500 mb-2'>Categories</h1>
          <div className='flex flex-wrap gap-2 mb-3'>
            {categories.map((cat, idx) => (
              <span key={idx} className='bg-purple-100 text-blue-700 px-2 sm:px-2.5 py-1 sm:py-2.5 rounded-lg text-xs flex items-center'>
                {cat}
                <button
                  onClick={() => removeCategory(cat)}
                  className='ml-1 text-blue-500 hover:text-blue-700'
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Type and press Enter...'
            className='w-full bg-gray-100 rounded-md p-2 sm:p-2.5 text-sm sm:text-base'
          />

          <div className="mt-4 sm:mt-6 lg:mt-5">
            <h1 className="font-thin text-sm sm:text-base">Colors</h1>
            <p className="text-gray-400 text-xs mb-2 sm:mb-1.5">Type a color and press Enter</p>

            {/* Selected colors */}
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedColors.map((color, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: color,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px 10px",
                    borderRadius: "9999px",
                    height: "35px",
                    width: "35px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                >
                  <button
                    onClick={() => removeColor(color)}
                    style={{
                      marginLeft: "-2px",
                      color: "#fff",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Input field */}
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyDown={handleColorKeyDown}
              placeholder="e.g. Red, Sky Blue, Dark Green..."
              className="w-full bg-gray-100 rounded-md p-2 sm:p-2.5 text-sm sm:text-base"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProduct