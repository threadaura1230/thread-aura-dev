"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, Upload, Check, AlertCircle, Box } from "lucide-react";

interface Collection {
  _id: string;
  name: string;
}

interface SubCollection {
  _id: string;
  name: string;
  collection: string | { _id: string };
}

interface ProductDetailItem {
  title: string;
  content: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  collection: {
    _id: string;
    name: string;
  } | null;
  subCollection: {
    _id: string;
    name: string;
  } | null;
  material: string;
  tag: string;
  bgColor: string;
  sizes: string[];
  details: ProductDetailItem[];
  isActive: boolean;
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [subCollections, setSubCollections] = useState<SubCollection[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filterCollection, setFilterCollection] = useState("");
  const [filterSubCollection, setFilterSubCollection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [collectionId, setCollectionId] = useState("");
  const [subCollectionId, setSubCollectionId] = useState("");
  const [material, setMaterial] = useState("");
  const [tag, setTag] = useState("");
  const [bgColor, setBgColor] = useState("#1f332a");
  const [sizes, setSizes] = useState<string[]>(["2.4", "2.6", "2.8"]);
  const [details, setDetails] = useState<ProductDetailItem[]>([]);
  const [isActive, setIsActive] = useState(true);

  // Dynamic details input states
  const [newDetailTitle, setNewDetailTitle] = useState("");
  const [newDetailContent, setNewDetailContent] = useState("");

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchFilterData();
    fetchProducts();
  }, [filterCollection, filterSubCollection]);

  const fetchFilterData = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        fetch("/api/manage-products/category"),
        fetch("/api/manage-products/subcat"),
      ]);

      const catData = await catRes.json();
      const subData = await subRes.json();

      if (catData.success) setCollections(catData.collections || []);
      if (subData.success) setSubCollections(subData.subCollections || []);
    } catch (err) {
      console.error("Error loading filter options:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCollection) params.append("collection", filterCollection);
      if (filterSubCollection) params.append("subCollection", filterSubCollection);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`/api/manage-products/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter subcollections based on selected collection in form
  const getFilteredSubCollections = (colId: string) => {
    return subCollections.filter((sub) => {
      const parentId = typeof sub.collection === "object" ? sub.collection?._id : sub.collection;
      return parentId === colId;
    });
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setDescription("");
    setImages([]);
    const defaultCol = collections[0]?._id || "";
    setCollectionId(defaultCol);
    const subOptions = getFilteredSubCollections(defaultCol);
    setSubCollectionId(subOptions[0]?._id || "");
    setMaterial("");
    setTag("");
    setBgColor("#1f332a");
    setSizes(["2.4", "2.6", "2.8"]);
    setDetails([]);
    setIsActive(true);
    setNewDetailTitle("");
    setNewDetailContent("");
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(String(prod.price));
    setDescription(prod.description);
    setImages(prod.images || []);
    const colId = prod.collection?._id || "";
    setCollectionId(colId);
    setSubCollectionId(prod.subCollection?._id || "");
    setMaterial(prod.material || "");
    setTag(prod.tag || "");
    setBgColor(prod.bgColor || "#1f332a");
    setSizes(prod.sizes || []);
    setDetails(prod.details || []);
    setIsActive(prod.isActive);
    setNewDetailTitle("");
    setNewDetailContent("");
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("subfolder", "products");

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          uploadedUrls.push(data.imageUrl);
        } else {
          setError(data.error || "Failed to upload one of the images");
        }
      }

      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (err) {
      console.error(err);
      setError("Network error uploading images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSizeToggle = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const addDetailRow = () => {
    if (!newDetailTitle || !newDetailContent) return;
    setDetails((prev) => [...prev, { title: newDetailTitle, content: newDetailContent }]);
    setNewDetailTitle("");
    setNewDetailContent("");
  };

  const removeDetailRow = (index: number) => {
    setDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !price || !collectionId || !subCollectionId) {
      setError("Name, price, collection, and sub-collection are required");
      return;
    }

    const payload = {
      name,
      price: Number(price),
      description,
      images,
      collection: collectionId,
      subCollection: subCollectionId,
      material,
      tag,
      bgColor,
      sizes,
      details,
      isActive,
    };

    const url = editingProduct
      ? `/api/manage-products/products/${editingProduct._id}`
      : "/api/manage-products/products";
    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(editingProduct ? "Product updated successfully" : "Product created successfully");
        fetchProducts();
        setTimeout(() => setModalOpen(false), 800);
      } else {
        setError(data.error || "Failed to save product");
      }
    } catch (err) {
      console.error(err);
      setError("Network error saving product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/manage-products/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Network error deleting product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/[0.06] pb-6">
        <div>
          <h1 className="font-serif text-[24px] md:text-[28px] font-medium text-[#0f3a2a]">
            Manage Products
          </h1>
          <p className="text-[12px] text-slate-500 mt-1">
            Add and manage products in the store catalog.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={collections.length === 0 || subCollections.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#073623] hover:bg-[#0c4a31] text-white text-[12px] font-semibold tracking-wider uppercase rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-black/[0.05] bg-white">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products by name, description, material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
            className="w-full rounded-lg border border-black/[0.08] px-3.5 py-2 text-[12px] focus:outline-none focus:border-[#073623]"
          />
        </div>

        {/* Collection Filter */}
        <div className="w-full md:w-48">
          <select
            value={filterCollection}
            onChange={(e) => {
              setFilterCollection(e.target.value);
              setFilterSubCollection("");
            }}
            className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-[12px] focus:outline-none cursor-pointer"
          >
            <option value="">All Collections</option>
            {collections.map((col) => (
              <option key={col._id} value={col._id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-Collection Filter */}
        <div className="w-full md:w-48">
          <select
            value={filterSubCollection}
            onChange={(e) => setFilterSubCollection(e.target.value)}
            disabled={!filterCollection}
            className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-[12px] focus:outline-none cursor-pointer disabled:opacity-50"
          >
            <option value="">All Sub-Collections</option>
            {getFilteredSubCollections(filterCollection).map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchProducts}
          className="px-5 py-2 bg-[#073623] hover:bg-[#0c4a31] text-white text-[12px] font-semibold tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
        >
          Search
        </button>
      </div>

      {/* Warning if no data exists */}
      {(collections.length === 0 || subCollections.length === 0) && !loading && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <span>You must create at least one **Collection** and one **Sub-Collection** before creating products.</span>
        </div>
      )}

      {/* Grid of Products */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-3 border-[#073623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 border border-dashed border-black/[0.08] rounded-xl bg-white">
          <Box className="h-12 w-12 text-slate-300 mb-4" />
          <p className="text-[13px] font-semibold text-slate-600">No products found</p>
          <p className="text-[11px] text-slate-400 mt-1">Add a product to start listing items.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div
              key={prod._id}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Content */}
              <div>
                {/* Image Grid/Box */}
                <div 
                  className="relative aspect-[4/5] w-full flex items-center justify-center overflow-hidden border-b border-black/[0.04] transition-all duration-500"
                  style={{ backgroundColor: prod.bgColor || "#12221c" }}
                >
                  {prod.images && prod.images.length > 0 ? (
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
                      Product Image
                    </span>
                  )}
                  {/* Status & Tag badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {prod.tag && (
                      <span className="bg-white text-slate-900 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-[2px]">
                        {prod.tag}
                      </span>
                    )}
                  </div>
                  <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    prod.isActive 
                      ? "bg-[#073623]/20 text-white border border-white/20 backdrop-blur-sm" 
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}>
                    {prod.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Information */}
                <div className="p-5 space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif text-[18px] font-semibold text-[#0f3a2a] leading-tight line-clamp-1">
                      {prod.name}
                    </h3>
                    <span className="text-[14px] font-bold text-slate-800 flex-shrink-0">
                      ${prod.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[10px] font-medium text-slate-400">
                    <span>Material: <strong className="text-slate-600">{prod.material || "Unspecified"}</strong></span>
                    <span>•</span>
                    <span>Collection: <strong className="text-[#073623]">{prod.collection?.name || "Unassigned"}</strong></span>
                    {prod.subCollection && (
                      <>
                        <span>•</span>
                        <span>Sub: <strong className="text-[#8b926d]">{prod.subCollection?.name}</strong></span>
                      </>
                    )}
                  </div>

                  <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-3">
                    {prod.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 p-5 border-t border-black/[0.04] bg-[#FDFBF7]">
                <button
                  onClick={() => openEditModal(prod)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-black/[0.08] hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prod._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-200 hover:bg-red-50 text-[11px] font-semibold text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#F1EFE7] rounded-2xl shadow-xl border border-black/[0.06] flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-black/[0.05] bg-white rounded-t-2xl">
              <h2 className="font-serif text-[18px] font-medium text-[#0f3a2a]">
                {editingProduct ? "Edit Product" : "Create Product"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-pulse">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Grid 1: Name, Price, Material, Tag */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Imperial Emerald Wrap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#073623]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 145.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#073623]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Material
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Silk & Gold Thread"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#073623]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Tag / Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller, Limited"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#073623]"
                  />
                </div>
              </div>

              {/* Grid 2: Collection & Subcollection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Collection *
                  </label>
                  <select
                    value={collectionId}
                    onChange={(e) => {
                      setCollectionId(e.target.value);
                      const subOptions = getFilteredSubCollections(e.target.value);
                      setSubCollectionId(subOptions[0]?._id || "");
                    }}
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#073623] cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select collection</option>
                    {collections.map((col) => (
                      <option key={col._id} value={col._id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Sub-Collection *
                  </label>
                  <select
                    value={subCollectionId}
                    onChange={(e) => setSubCollectionId(e.target.value)}
                    disabled={!collectionId}
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#073623] cursor-pointer disabled:opacity-50"
                    required
                  >
                    <option value="" disabled>Select sub-collection</option>
                    {getFilteredSubCollections(collectionId).map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid 3: Color hex & Sizes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Background Color Hex (for cards)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 border border-black/[0.08] rounded-xl cursor-pointer p-1 bg-white"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#1f332a"
                      className="flex-1 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#073623]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Available Sizes (Inner Bangle Diameter)
                  </label>
                  <div className="flex items-center gap-4 py-2">
                    {["2.4", "2.6", "2.8"].map((size) => (
                      <label key={size} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                          className="w-4.5 h-4.5 accent-[#073623] rounded"
                        />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Images Multi-uploader */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Product Images
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {images.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl border border-black/[0.08] bg-white overflow-hidden group">
                      <img src={imgUrl} alt={`Product ${idx}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-0.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload box */}
                  <label className="relative aspect-square rounded-xl border border-dashed border-black/[0.12] hover:border-black/[0.24] bg-white/50 hover:bg-white flex flex-col items-center justify-center cursor-pointer transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <Upload className="h-5 w-5 text-slate-400" />
                    <span className="text-[9px] font-semibold text-slate-400 uppercase mt-1">
                      {uploading ? "Uploading" : "Add Image"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Description
                </label>
                <textarea
                  placeholder="Enter detailed description of the product design..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#073623] resize-none"
                />
              </div>

              {/* Dynamic details section */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Additional Details / Collapsible Sections
                </label>
                
                {/* Existing detail list */}
                {details.length > 0 && (
                  <div className="space-y-2">
                    {details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-4 p-3 bg-white border border-black/[0.04] rounded-xl text-xs">
                        <div className="space-y-0.5">
                          <strong className="text-slate-800 uppercase tracking-wide text-[10px]">{detail.title}</strong>
                          <p className="text-slate-500 leading-relaxed">{detail.content}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDetailRow(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new detail row input form */}
                <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border border-black/[0.05] bg-white/40">
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      placeholder="Title (e.g. Care Instructions)"
                      value={newDetailTitle}
                      onChange={(e) => setNewDetailTitle(e.target.value)}
                      className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-[#073623]"
                    />
                  </div>
                  <div className="flex-1 sm:flex-[2] space-y-1.5">
                    <input
                      type="text"
                      placeholder="Content details..."
                      value={newDetailContent}
                      onChange={(e) => setNewDetailContent(e.target.value)}
                      className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-[#073623]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addDetailRow}
                    className="py-1.5 px-4 bg-[#073623]/10 hover:bg-[#073623]/25 text-[#073623] hover:text-[#0c4a31] text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer self-start sm:self-center"
                  >
                    Add Row
                  </button>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-black/[0.05] bg-white">
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-slate-800">Active Status</span>
                  <p className="text-[11px] text-slate-400">Whether this product is listed live in the customer store.</p>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 accent-[#073623] rounded cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t border-black/[0.05] bg-transparent">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-black/[0.08] bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 rounded-xl bg-[#073623] hover:bg-[#0c4a31] text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
