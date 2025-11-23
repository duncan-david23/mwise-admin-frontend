import React, { useEffect, useState } from "react";
import imagePlaceholder from "../assets/image_placeholder.jpg";
import { useAppContext } from "../contexts/AppContext";
import { supabase } from "../utils/supabase";
import axios from "axios";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import toast from "react-hot-toast";
// import AddProduct from "./AddProduct";
import { useNavigate } from "react-router-dom";




const Products = () => {
  const { showAddProduct, setShowAddProduct,currency, setDisplayConfirmModal, confirmStatus, displayConfirmModal, showEditProduct, allProducts, setAllProducts, setShowEditProduct, selectedProduct, setSelectedProduct } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("Newest");
  const [selectedIds, setSelectedIds] = useState([]); // ✅ store selected product IDs
  const [searchTerm, setSearchTerm] = useState("");


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://mwsie-backend.onrender.com/api/ecommerce/products"
        );
        setProducts(response.data.products);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


   const navigate = useNavigate();
    
  

  // ✅ Filter by search term (name, sku, category)
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.product_name?.toLowerCase().includes(term) ||
      product.skuid?.toLowerCase().includes(term) ||
      product.product_categories?.some((cat) =>
        cat.toLowerCase().includes(term)
      )
    );
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "Newest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "Oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "Price (Low to High)":
        return a.product_price - b.product_price;
      case "Price (High to Low)":
        return b.product_price - a.product_price;
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
  setCurrentPage(1);
}, [searchTerm]);

  // ✅ Handle checkbox change
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // ✅ Select all on current page
  const toggleSelectAll = () => {
    const currentPageIds = paginatedProducts.map((p) => p.id);
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      // unselect all
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      // select all
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  // ✅ Delete selected products

const notify = () => toast.success('Deleted successfully');

  const deleteSelected = () => {
  if (selectedIds.length === 0) return;
  setDisplayConfirmModal(true); // show modal
};


  const confirmDelete = async () => {
  if (selectedIds.length === 0) return;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.error("❌ No active session. User is not logged in.");
      return;
    }

    const accessToken = session.access_token;

    await axios.delete("https://mwsie-backend.onrender.com/api/ecommerce/products", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: { ids: selectedIds }, // ✅ pass array of ids to backend
    });

    // ✅ Update UI
    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setDisplayConfirmModal(false);
    notify();
  } catch (err) {
    console.error("❌ Error deleting products:", err);
  }
};



const handleEditProduct = (product) => {
  setSelectedProduct(product);
  setShowAddProduct(true);
  navigate('/products/add-product');
}












  return (
    <>
    <div className={`px-[30px] bg-gray-50 relative pt-[65px] flex-1 h-screen overflow-y-auto pb-[50px] `}>
      <h1 className="font-bold text-xl">All Products</h1>

      {/* Create Product Button */}
      <div className="flex gap-2 absolute top-[50px] right-[30px]">
        <button onClick={() => navigate('/products/add-product')} className="bg-blue-600 md:w-[180px] flex items-center gap-2.5 justify-center text-white px-2.5 py-2.5 rounded-md hover:bg-blue-700 transition-all">
          <p className="md:block hidden">Create Product</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      {/* Filter + Sort */}
      <div className="mt-[70px]">
          <div className="flex gap-2.5 mb-5 items-center justify-between border border-gray-300 rounded px-3 text-sm w-[330px]">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none py-2.5 w-full"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 hover:cursor-pointer hover:text-purple-600 transition-all text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

          </div>
        <div className="flex gap-5 items-center bg-gray-100 px-5 py-2.5 rounded-lg">
          <div className="bg-white flex items-center gap-[5px] rounded-lg text px-5 py-2.5">
            <h1 className="text-xs text-black">Filter</h1>
          </div>

          <div className="flex gap-2.5 items-center">
            <h1 className="text-xs">Sort By:</h1>
            <select
              className="border-none outline-none text-xs px-5 py-2.5 rounded-md"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Price (Low to High)</option>
              <option>Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="mt-2.5">
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-thin flex items-center gap-[5px]">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={paginatedProducts.every((p) =>
                        selectedIds.includes(p.id)
                      )}
                    />
                    {selectedIds.length > 0 && (
                      <>
                      <div className=" text-gray-500 hover:text-blue-600 transition-all ml-3 cursor-pointer"
                          onClick={deleteSelected}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>

                      </div>
                      </>
                      )}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-thin">
                    Product Details
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-thin">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-thin">
                    Discount (%)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-thin">
                    Sales Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-thin">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-thin">
                    Category(ies)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-thin">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-thin">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-5 text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-5 text-gray-500"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b-1-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
                     
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                        />
                      </td>
                      <td className="pr-10 py-3">
                        <div className="flex items-center gap-5">
                          <img
                            src={product.product_images?.[0] || imagePlaceholder}
                            alt="img"
                            className="w-[50px] h-[50px] rounded object-cover"
                          />
                          <div className="flex flex-col gap-[3px] justify-center">
                            <div className="font-thin text-sm">
                              {product.product_name}
                            </div>
                            <div className="text-xs text-gray-500 font-thin">
                              {product.skuid || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-thin">
                        {currency}{product.product_price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm font-thin">
                        {product.product_discount || 0}%
                      </td>
                      <td className="px-4 py-3 text-sm font-thin">
                        {currency}{product.sales_price?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-3 text-sm font-thin">
                        {product.product_stock || 0}
                      </td>
                      <td className="px-4 py-3 text-sm font-thin">
                        {product.product_categories?.join(", ") ||
                          "Uncategorized"}
                      </td>
                      <td className="px-4 py-3 text-sm font-thin">
                        <span
                          className={`px-2 py-1 rounded text-xs font-thin ${
                            product.status === "In Stock"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-thin" onClick={() => handleEditProduct(product)} >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-gray-400 hover:scale-110 hover:text-purple-600 transition-all">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                          
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 font-thin text-sm">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 font-thin text-sm"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-purple-600 text-white font-thin text-sm"
                      : "bg-gray-200 font-thin text-sm"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 font-thin text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    {displayConfirmModal && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setDisplayConfirmModal(false)}
        />
      )}
    </>
  );
};

export default Products;
