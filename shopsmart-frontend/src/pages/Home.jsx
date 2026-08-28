import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, recommendationService, uploadService } from '../services/api';
import SearchBar from '../components/SearchBar';
import AISearch from '../components/AISearch';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import { PlusCircle, Sparkles, ShoppingBag, UploadCloud, Loader2 } from 'lucide-react';

export default function Home({ addToCart }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: 25,
    category: 'Electronics',
    specs: '',
    description: '',
    battery: '',
    rating: 4.0,
    image: ''
  });

  const token = localStorage.getItem('shopsmart_token');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await productService.getProducts({ limit: 100 });
    setProducts(data || []);
    setFilteredProducts(data || []);
    loadRecommendations(data || []);
  };

  const loadRecommendations = async (allProducts) => {
    if (token) {
      try {
        const recs = await recommendationService.getRecommendations();
        if (recs && recs.length > 0) {
          setRecommendations(recs);
          return;
        }
      } catch (err) {
        console.error('Failed to load user recommendations:', err);
      }
    }
    setRecommendations(allProducts.slice(0, 3));
  };

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(result);
  }, [searchTerm, activeCategory, products]);

  const handleAISearch = (results) => {
    setFilteredProducts(results);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const cloudUrl = await uploadService.uploadImage(file);
      setNewProduct((prev) => ({ ...prev, image: cloudUrl }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload image to Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    await productService.addProduct({
      ...newProduct,
      stock: Number(newProduct.stock) || 25
    });
    setNewProduct({
      name: '',
      price: '',
      stock: 25,
      category: 'Electronics',
      specs: '',
      description: '',
      battery: '',
      rating: 4.0,
      image: ''
    });
    setShowAddForm(false);
    loadProducts();
  };

  const handleEditProduct = async (id, updatedData) => {
    if (!token) {
      navigate('/login');
      return;
    }
    await productService.updateProduct(id, updatedData);
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (!token) {
      navigate('/login');
      return;
    }
    await productService.deleteProduct(id);
    loadProducts();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="w-full flex flex-col items-center gap-6">
        <AISearch onFilterResults={handleAISearch} onAddToCart={addToCart} />

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-6 border-gray-100">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0">
          Discover Catalog <span className="text-sm font-normal text-gray-500">({filteredProducts.length} items available)</span>
        </h2>
        <button
          onClick={() => {
            if (!token) navigate('/login');
            else setShowAddForm(!showAddForm);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Add Product
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddProduct}
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Product Title</label>
            <input
              type="text"
              required
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Sony Bravia 55-inch 4K TV"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Price (₹)</label>
            <input
              type="number"
              required
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="₹"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Stock Units</label>
            <input
              type="number"
              required
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="25"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Category</label>
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Technical Specifications (comma-separated)
            </label>
            <input
              type="text"
              required
              value={newProduct.specs}
              onChange={(e) => setNewProduct({ ...newProduct, specs: e.target.value })}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 55-inch 4K UHD, 120Hz Refresh, Dolby Vision, 3x HDMI"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Short Description</label>
            <input
              type="text"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Cinema-grade smart television with ultra-crisp HDR10+ visual clarity."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Battery Rating (Optional)</label>
            <select
              value={newProduct.battery}
              onChange={(e) => setNewProduct({ ...newProduct, battery: e.target.value })}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700"
            >
              <option value="">None / Not Applicable</option>
              <option value="Great">Great (12h - 24h backup)</option>
              <option value="Excellent">Excellent (All-day / Heavy backup)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cloudinary Image</label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-1.5 p-2 border border-dashed border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:border-indigo-500 cursor-pointer bg-slate-50">
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" /> Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5 text-indigo-600" /> Choose File
                  </>
                )}
                <input type="file" accept="image/*" disabled={uploading} onChange={handleImageUpload} className="hidden" />
              </label>
              {newProduct.image && (
                <img src={newProduct.image} alt="Preview" className="w-9 h-9 rounded-lg object-cover border" />
              )}
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-2 flex gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition cursor-pointer disabled:bg-gray-400"
            >
              Save Product Entry
            </button>
          </div>
        </form>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl shadow-xs">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-base font-medium">No products match your active search filters.</p>
          <button onClick={loadProducts} className="mt-2 text-sm text-indigo-600 font-bold hover:underline cursor-pointer">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      <div className="mt-16 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-xl space-y-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-white m-0">
            <Sparkles className="w-5 h-5 text-amber-400" /> Recommended For You
          </h3>
          <p className="text-slate-400 text-sm mt-1 m-0">
            Dynamically personalized based on your browsing category history and viewed specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recommendations.map((p) => (
            <div
              key={p._id}
              className="bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center hover:bg-white/10 transition gap-4"
            >
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-sm text-white truncate m-0">{p.name}</h4>
                <p className="text-xs text-indigo-300 font-bold mt-1 m-0">₹{Number(p.price).toLocaleString('en-IN')}</p>
              </div>
              <button
                onClick={() => addToCart(p)}
                className="text-xs font-bold bg-white text-slate-900 px-3 py-2 rounded-xl hover:bg-gray-100 transition shrink-0 cursor-pointer"
              >
                Add Quick
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}