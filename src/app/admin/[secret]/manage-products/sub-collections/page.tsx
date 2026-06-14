"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, Upload, Check, AlertCircle, FolderTree } from "lucide-react";

interface Collection {
  _id: string;
  name: string;
}

interface SubCollection {
  _id: string;
  name: string;
  slug: string;
  description: string;
  collection: {
    _id: string;
    name: string;
  };
  image: string;
  isActive: boolean;
}

export default function SubCollectionsManager() {
  const [subCollections, setSubCollections] = useState<SubCollection[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubCollection, setEditingSubCollection] = useState<SubCollection | null>(null);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, catRes] = await Promise.all([
        fetch("/api/manage-products/subcat"),
        fetch("/api/manage-products/category"),
      ]);

      const subData = await subRes.json();
      const catData = await catRes.json();

      if (subData.success) {
        setSubCollections(subData.subCollections || []);
      }
      if (catData.success) {
        setCollections(catData.collections || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSubCollection(null);
    setName("");
    setDescription("");
    setCollectionId(collections[0]?._id || "");
    setImage("");
    setIsActive(true);
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const openEditModal = (sub: SubCollection) => {
    setEditingSubCollection(sub);
    setName(sub.name);
    setDescription(sub.description);
    setCollectionId(sub.collection?._id || "");
    setImage(sub.image);
    setIsActive(sub.isActive);
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subfolder", "sub-collections");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.imageUrl);
      } else {
        setError(data.error || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      setError("Network error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !collectionId) {
      setError("Name and parent collection are required");
      return;
    }

    const payload = { name, description, collection: collectionId, image, isActive };
    const url = editingSubCollection 
      ? `/api/manage-products/subcat/${editingSubCollection._id}` 
      : "/api/manage-products/subcat";
    const method = editingSubCollection ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(editingSubCollection ? "Sub-collection updated successfully" : "Sub-collection created successfully");
        fetchData();
        setTimeout(() => setModalOpen(false), 800);
      } else {
        setError(data.error || "Failed to save sub-collection");
      }
    } catch (err) {
      console.error(err);
      setError("Network error saving sub-collection");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sub-collection?")) return;
    setError(null);
    
    try {
      const res = await fetch(`/api/manage-products/subcat/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Failed to delete sub-collection");
      }
    } catch (err) {
      console.error(err);
      alert("Network error deleting sub-collection");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/[0.06] pb-6">
        <div>
          <h1 className="font-serif text-[24px] md:text-[28px] font-medium text-[#0f3a2a]">
            Manage Sub-Collections
          </h1>
          <p className="text-[12px] text-slate-500 mt-1">
            Create and edit sub-categories nested under main collections.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={collections.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#073623] hover:bg-[#0c4a31] text-white text-[12px] font-semibold tracking-wider uppercase rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Sub-Collection
        </button>
      </div>

      {/* Warning if no parent collections exist */}
      {collections.length === 0 && !loading && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <span>You must create at least one main **Collection** first before creating sub-collections.</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-3 border-[#073623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : subCollections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 border border-dashed border-black/[0.08] rounded-xl bg-white">
          <FolderTree className="h-12 w-12 text-slate-300 mb-4" />
          <p className="text-[13px] font-semibold text-slate-600">No sub-collections found</p>
          <p className="text-[11px] text-slate-400 mt-1">Create a sub-collection to link your products.</p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subCollections.map((sub) => (
            <div
              key={sub._id}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                {/* Image Cover */}
                <div className="relative aspect-[16/9] w-full bg-slate-100 flex items-center justify-center overflow-hidden border-b border-black/[0.04]">
                  {sub.image ? (
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                      No Image
                    </span>
                  )}
                  {/* Status badge */}
                  <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    sub.isActive 
                      ? "bg-[#073623]/10 text-[#073623] border border-[#073623]/20" 
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}>
                    {sub.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-[18px] font-semibold text-[#0f3a2a]">
                      {sub.name}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-1 text-[10px] font-semibold">
                    <code className="text-[#8b926d]">slug: {sub.slug}</code>
                    <span className="text-slate-400">Parent: <strong className="text-[#073623]">{sub.collection?.name || "Unassigned"}</strong></span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-3">
                    {sub.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 p-5 border-t border-black/[0.04] bg-[#FDFBF7]">
                <button
                  onClick={() => openEditModal(sub)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-black/[0.08] hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sub._id)}
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#F1EFE7] rounded-2xl shadow-xl border border-black/[0.06] flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-black/[0.05] bg-white rounded-t-2xl">
              <h2 className="font-serif text-[18px] font-medium text-[#0f3a2a]">
                {editingSubCollection ? "Edit Sub-Collection" : "Create Sub-Collection"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
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

              {/* Name */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Silk Bangles"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#073623] transition-colors"
                  required
                />
              </div>

              {/* Parent Collection Select */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Parent Collection *
                </label>
                <select
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#073623] transition-colors cursor-pointer"
                  required
                >
                  <option value="" disabled>Select parent collection</option>
                  {collections.map((col) => (
                    <option key={col._id} value={col._id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Cover Image
                </label>
                <div className="flex gap-4 items-center">
                  <div className="h-16 w-16 bg-white border border-black/[0.08] rounded-xl flex items-center justify-center overflow-hidden relative">
                    {image ? (
                      <img src={image} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <Upload className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      id="subcollection-image-file"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="subcollection-image-file"
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-black/[0.08] bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 cursor-pointer transition-all ${
                        uploading ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {uploading ? "Uploading..." : "Upload Image"}
                    </label>
                    {image && (
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="ml-3 text-[11px] text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Description
                </label>
                <textarea
                  placeholder="Enter sub-collection details..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#073623] transition-colors resize-none"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-black/[0.05] bg-white">
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-slate-800">Active Status</span>
                  <p className="text-[11px] text-slate-400">Whether this sub-collection is visible to customers.</p>
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
                  Save Sub-Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
