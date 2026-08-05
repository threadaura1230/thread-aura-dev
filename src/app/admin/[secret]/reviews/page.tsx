"use client";

import { useState, useEffect, useRef } from "react";
import { Star, CheckCircle, XCircle, Trash2, Play, Pause, ExternalLink, Calendar, MapPin, Tag } from "lucide-react";
import Image from "next/image";

interface Review {
  _id: string;
  name: string;
  location: string;
  rating: number;
  productName: string;
  productLink?: string;
  date: string;
  text: string;
  quote: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  posterUrl?: string;
  approved: boolean;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(false);
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(
          reviews.map((r) => (r._id === id ? { ...r, approved: !currentStatus } : r))
        );
      }
    } catch (error) {
      console.error("Error toggling review status:", error);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.filter((r) => r._id !== id));
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const toggleVideo = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingVideoId === id) {
      video.pause();
      setPlayingVideoId(null);
    } else {
      if (playingVideoId) {
        videoRefs.current[playingVideoId]?.pause();
      }
      video.play();
      setPlayingVideoId(id);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="font-serif text-[28px] md:text-[32px] font-medium text-[#0f3a2a] tracking-tight flex items-center gap-3">
              Customer Reviews Moderation
            </h1>
            <p className="text-sm text-black/60 max-w-xl font-light">
              Review, approve, and manage user-submitted photo/video reviews. Approved reviews will immediately display on the live website.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="bg-[#0f3a2a]/5 px-4 py-3 rounded-xl border border-[#0f3a2a]/[0.08]">
              <span className="text-[10px] uppercase font-bold text-[#0f3a2a]/60 block">Pending Approval</span>
              <span className="text-2xl font-serif font-bold text-[#b13d33]">
                {reviews.filter((r) => !r.approved).length}
              </span>
            </div>
            <div className="bg-[#0f3a2a]/5 px-4 py-3 rounded-xl border border-[#0f3a2a]/[0.08]">
              <span className="text-[10px] uppercase font-bold text-[#0f3a2a]/60 block">Live Reviews</span>
              <span className="text-2xl font-serif font-bold text-green-700">
                {reviews.filter((r) => r.approved).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-black/[0.06] gap-6">
        {(["all", "pending", "approved"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-4 px-2 text-sm font-semibold capitalize transition-all border-b-2 -mb-[2px] cursor-pointer ${
              filter === tab
                ? "border-[#0f3a2a] text-[#0f3a2a]"
                : "border-transparent text-black/40 hover:text-black/70"
            }`}
          >
            {tab} Reviews ({reviews.filter((r) => (tab === "all" ? true : tab === "pending" ? !r.approved : r.approved)).length})
          </button>
        ))}
      </div>

      {/* List / Table */}
      {loading ? (
        <div className="text-center py-20 text-black/40">Loading reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-20 bg-white border border-black/[0.06] rounded-2xl text-black/40 font-light">
          No reviews found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredReviews.map((review) => {
            const isVideo = review.mediaType === "video";
            const isPlaying = playingVideoId === review._id;

            return (
              <div
                key={review._id}
                className="bg-white border border-black/[0.06] rounded-2xl shadow-sm p-6 flex flex-col lg:flex-row gap-6 hover:border-black/[0.12] transition-colors"
              >
                {/* Media Section */}
                <div className="w-full lg:w-56 aspect-[4/5] lg:h-64 relative rounded-xl overflow-hidden bg-black/[0.03] border border-black/[0.04] shrink-0">
                  {isVideo ? (
                    <div
                      className="w-full h-full relative cursor-pointer"
                      onClick={() => toggleVideo(review._id)}
                    >
                      <video
                        ref={(el) => {
                          videoRefs.current[review._id] = el;
                        }}
                        src={review.mediaUrl}
                        poster={review.posterUrl}
                        className="w-full h-full object-cover"
                        loop
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <button className="w-12 h-12 rounded-full bg-white/90 text-[#0f3a2a] flex items-center justify-center shadow">
                          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
                        </button>
                      </div>
                      <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Video
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <Image
                        src={review.mediaUrl}
                        alt="Review media"
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-[#d4af37] text-[#0f3a2a] text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Photo
                      </span>
                    </div>
                  )}
                </div>

                {/* Info & Content Section */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Top Row: Stars and Info tags */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-[#d4af37] text-[#d4af37]" : "text-black/10"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-black/50">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {review.location}
                        </span>
                      </div>
                    </div>

                    {/* Headline and details */}
                    <div>
                      <h3 className="text-lg font-serif font-medium text-[#0f3a2a] italic">
                        &ldquo;{review.quote}&rdquo;
                      </h3>
                      <p className="text-sm text-black/70 mt-1 font-light leading-relaxed">
                        {review.text}
                      </p>
                    </div>

                    {/* Item referenced */}
                    <div className="flex items-center gap-1.5 text-xs bg-[#0f3a2a]/5 text-[#0f3a2a] px-3 py-1.5 rounded-lg w-max border border-[#0f3a2a]/[0.08]">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="font-semibold">{review.productName}</span>
                      {review.productLink && (
                        <a href={review.productLink} target="_blank" rel="noreferrer" className="hover:text-[#b13d33]">
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions & Author Details */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/[0.06]">
                    <div>
                      <span className="text-xs text-black/40 block">Submitted By</span>
                      <span className="text-sm font-semibold text-[#0f3a2a]">{review.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Approve Toggle */}
                      <button
                        onClick={() => handleApproveToggle(review._id, review.approved)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                          review.approved
                            ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                            : "bg-[#0f3a2a] border-transparent text-white hover:bg-[#b13d33]"
                        }`}
                      >
                        {review.approved ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Live / Approved</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>Approve Review</span>
                          </>
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="p-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
