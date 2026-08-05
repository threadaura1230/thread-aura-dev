"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Play, Pause, CheckCircle2, ShoppingBag, Volume2, VolumeX, X, Upload, Loader2, Filter, ChevronRight, Eye } from "lucide-react";

interface Review {
  _id?: string;
  id?: number;
  name: string;
  location: string;
  rating: number;
  productName: string;
  productLink?: string;
  date: string | Date;
  text: string;
  quote: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  posterUrl?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | number | null>(null);
  const [mutedVideoId, setMutedVideoId] = useState<string | number | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redesign States
  const [activeFilter, setActiveFilter] = useState<"all" | "media" | "top">("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [lightboxVideoPlaying, setLightboxVideoPlaying] = useState(true);
  const [lightboxVideoMuted, setLightboxVideoMuted] = useState(true);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formProductName, setFormProductName] = useState("");
  const [formQuote, setFormQuote] = useState("");
  const [formText, setFormText] = useState("");
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState("");
  const [uploadedMediaType, setUploadedMediaType] = useState<"image" | "video">("image");
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  // Fetch reviews on load
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handlePlayPause = (id: string | number) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingVideoId === id) {
      video.pause();
      setPlayingVideoId(null);
    } else {
      if (playingVideoId !== null) {
        videoRefs.current[playingVideoId]?.pause();
      }
      video.play();
      setPlayingVideoId(id);
    }
  };

  const toggleMute = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    video.muted = !video.muted;
    if (video.muted) {
      setMutedVideoId(id);
    } else {
      setMutedVideoId(null);
    }
  };

  // Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(true);
    setErrorMessage("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/reviews/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setUploadedMediaUrl(data.mediaUrl);
        setUploadedMediaType(data.mediaType);
      } else {
        setErrorMessage(data.error || "Failed to upload file.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error uploading file.");
    } finally {
      setUploadProgress(false);
    }
  };

  // Submit Handler
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedMediaUrl) {
      setErrorMessage("Please upload a photo or video review.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          location: formLocation,
          rating: formRating,
          productName: formProductName,
          quote: formQuote,
          text: formText,
          mediaType: uploadedMediaType,
          mediaUrl: uploadedMediaUrl,
          posterUrl: uploadedMediaType === "video" ? uploadedMediaUrl : undefined, // simple poster URL fallback
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
          // Reset form
          setFormName("");
          setFormLocation("");
          setFormRating(5);
          setFormProductName("");
          setFormQuote("");
          setFormText("");
          setUploadedMediaUrl("");
          setFileInputKey(Date.now());
        }, 3000);
      } else {
        setErrorMessage(data.error || "Submission failed.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent body scroll when modal or lightbox is open
  useEffect(() => {
    if (isModalOpen || selectedReview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, selectedReview]);

  // Filtered reviews calculation
  const filteredReviews = reviews.filter((review) => {
    if (activeFilter === "media") {
      return review.mediaUrl && review.mediaUrl.length > 0;
    }
    if (activeFilter === "top") {
      return review.rating === 5;
    }
    return true;
  });

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-[#151510] pb-24" style={{ fontFamily: "var(--font-body)" }}>
      {/* Hero Section */}
      <section className="relative py-28 md:py-36 bg-[#0f3a2a] text-white flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-[#d4af37]/20">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#d4af37] font-bold" style={{ fontFamily: "var(--font-label)" }}>
            Our Global Community
          </p>
          <h1 className="text-4xl md:text-7xl font-extralight tracking-tight leading-none" style={{ fontFamily: "var(--font-display)" }}>
            Voices of <span className="italic font-normal text-[#d4af37]">Thread Aura</span>
          </h1>
          <p className="text-sm md:text-lg text-white/70 max-w-xl mx-auto font-light leading-relaxed">
            Real styling impressions, authentic reviews, and shared stories of conscious luxury craftsmanship.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-transparent hover:bg-white text-white hover:text-[#0f3a2a] border border-[#d4af37] px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.03] cursor-pointer"
            >
              Share Your Story
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Content Controls */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#0f3a2a]/10 pb-6">
          {/* Header Title */}
          <div>
            <h2 className="text-xl md:text-2xl font-light text-[#0f3a2a]" style={{ fontFamily: "var(--font-display)" }}>
              Patron <span className="italic">Testimonials</span>
            </h2>
            <p className="text-xs text-[#151510]/50 mt-1">Showing {filteredReviews.length} stories of craftsmanship</p>
          </div>

          {/* Luxury Filter Tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#0f3a2a]/5 rounded-full border border-[#0f3a2a]/[0.06]">
            {(["all", "media", "top"] as const).map((filterOpt) => (
              <button
                key={filterOpt}
                onClick={() => setActiveFilter(filterOpt)}
                className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                  activeFilter === filterOpt
                    ? "bg-[#0f3a2a] text-white shadow-sm"
                    : "text-[#151510]/60 hover:text-[#0f3a2a] hover:bg-black/5"
                }`}
              >
                {filterOpt === "all" && "All Reviews"}
                {filterOpt === "media" && "With Photos/Videos"}
                {filterOpt === "top" && "Top-Rated (5★)"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Grid Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {loadingReviews ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#d4af37]" />
            <p className="text-xs text-[#151510]/50 font-semibold uppercase tracking-widest">Retrieving stories...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#0f3a2a]/10 rounded-3xl bg-white/50">
            <Filter className="w-8 h-8 text-[#0f3a2a]/20 mx-auto mb-3" />
            <p className="text-base text-[#151510]/60 font-light">No reviews found matching the filter.</p>
            <button 
              onClick={() => setActiveFilter("all")} 
              className="text-xs font-bold uppercase tracking-wider text-[#d4af37] mt-2 underline"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReviews.map((review, index) => {
              const reviewId = review._id || review.id || `review-${index}`;
              const isVideo = review.mediaType === "video";

              return (
                <div
                  key={reviewId}
                  className="group bg-white rounded-2xl border border-[#0f3a2a]/[0.06] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#d4af37]/30 transition-all duration-500 flex flex-col cursor-pointer"
                  onClick={() => {
                    setSelectedReview(review);
                    setLightboxVideoPlaying(true);
                  }}
                >
                  {/* Media Visual Area */}
                  {review.mediaUrl ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
                      <Image
                        src={isVideo ? (review.posterUrl || review.mediaUrl) : review.mediaUrl}
                        alt={`Preview of review by ${review.name}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-[#0f3a2a]/10 group-hover:bg-[#0f3a2a]/30 transition-colors duration-500" />
                      
                      {/* Interactive Badge overlay */}
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#0f3a2a] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm border border-[#0f3a2a]/10">
                        {isVideo ? "Video Story" : "Photo"}
                      </span>

                      {/* Visual indicator icon */}
                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-[#0f3a2a] p-2.5 rounded-full shadow-md transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 border border-[#0f3a2a]/10">
                        {isVideo ? (
                          <Play className="w-4 h-4 fill-current text-[#d4af37]" />
                        ) : (
                          <Eye className="w-4 h-4 text-[#d4af37]" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-6 bg-[#0f3a2a]/[0.02]" />
                  )}

                  {/* Info Area */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Rating and Verification */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating ? "fill-[#d4af37] text-[#d4af37]" : "text-[#151510]/10"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-[#0f3a2a] text-[10px] uppercase font-bold tracking-wider opacity-70">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          <span>Verified</span>
                        </div>
                      </div>

                      {/* Testimonial Quote */}
                      <p 
                        className="text-lg md:text-xl font-light text-[#0f3a2a] italic leading-tight line-clamp-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        &ldquo;{review.quote}&rdquo;
                      </p>

                      {/* Description Text */}
                      <p className="text-xs text-[#151510]/70 font-light leading-relaxed line-clamp-3">
                        {review.text}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#0f3a2a]/[0.06]">
                      {/* Featured product info */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-wider text-[#151510]/40 font-bold">Featured Item</span>
                          <span className="font-medium text-[#0f3a2a] mt-0.5 line-clamp-1">{review.productName}</span>
                        </div>
                        <span className="text-[#d4af37] group-hover:translate-x-1 transition-transform">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>

                      {/* Reviewer Meta info */}
                      <div className="flex items-center justify-between pt-1 text-[11px] text-[#151510]/50 font-light">
                        <div>
                          <span className="font-semibold text-[#0f3a2a] block text-xs">{review.name}</span>
                          <span className="text-[10px]">{review.location}</span>
                        </div>
                        <span>
                          {new Date(review.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Write a review prompt section */}
      <section className="bg-[#0f3a2a] text-white py-24 px-4 text-center relative overflow-hidden mt-16 border-y border-[#d4af37]/20">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-light leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Contribute to Our <span className="italic font-normal text-[#d4af37]">Styling Legacy</span>
          </h2>
          <p className="text-sm text-white/70 font-light max-w-md mx-auto leading-relaxed">
            Every garment tells a personal story. We invite you to capture your styling moments, share authentic feedback, and inspire our community.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#d4af37] hover:bg-[#b13d33] text-[#0f3a2a] hover:text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.03] cursor-pointer"
            >
              Submit A Review
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox / Rich Detail Modal */}
      {selectedReview && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 overflow-y-auto p-4 md:p-8 bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedReview(null);
          }}
        >
          <div className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#0f3a2a]/[0.08] flex flex-col md:flex-row my-8 max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 right-4 z-30 p-2 bg-white/90 backdrop-blur-md rounded-full shadow hover:bg-white text-[#0f3a2a] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Visual Media Display */}
            {selectedReview.mediaUrl ? (
              <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-0">
                {selectedReview.mediaType === "video" ? (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <video
                      autoPlay={lightboxVideoPlaying}
                      src={selectedReview.mediaUrl}
                      loop
                      muted={lightboxVideoMuted}
                      playsInline
                      className="w-full h-full object-contain max-h-[80vh]"
                      ref={(el) => {
                        if (el) {
                          el.muted = lightboxVideoMuted;
                          if (lightboxVideoPlaying) {
                            el.play().catch(() => {});
                          } else {
                            el.pause();
                          }
                        }
                      }}
                    />
                    {/* Video controllers */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20">
                      <button
                        onClick={() => setLightboxVideoPlaying(!lightboxVideoPlaying)}
                        className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-sm"
                      >
                        {lightboxVideoPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>
                      <button
                        onClick={() => setLightboxVideoMuted(!lightboxVideoMuted)}
                        className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-sm"
                      >
                        {lightboxVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full relative aspect-[4/5] md:aspect-auto md:absolute md:inset-0">
                    <Image
                      src={selectedReview.mediaUrl}
                      alt={`Review by ${selectedReview.name}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full md:w-1/3 bg-[#0f3a2a]/5" />
            )}

            {/* Right Column: Review Details */}
            <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto flex flex-col justify-between space-y-8 bg-[#fcfbf9]">
              <div className="space-y-6">
                {/* Rating & Verified */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < selectedReview.rating ? "fill-[#d4af37] text-[#d4af37]" : "text-[#151510]/15"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[#0f3a2a] text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Verified Purchase</span>
                  </div>
                </div>

                {/* Review Headline */}
                <h3
                  className="text-2xl md:text-3xl font-light text-[#0f3a2a] italic leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  &ldquo;{selectedReview.quote}&rdquo;
                </h3>

                {/* Body Text */}
                <p className="text-sm text-[#151510]/80 font-light leading-relaxed">
                  {selectedReview.text}
                </p>
              </div>

              <div className="space-y-6">
                {/* Product Widget Card */}
                <div className="flex items-center justify-between bg-white border border-[#0f3a2a]/[0.08] p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#0f3a2a]/5 flex items-center justify-center text-[#0f3a2a]">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#151510]/40 font-bold">Featured Garment</span>
                      <h4 className="text-sm font-semibold text-[#0f3a2a] mt-0.5">{selectedReview.productName}</h4>
                    </div>
                  </div>
                  <Link
                    href={selectedReview.productLink || "/collections"}
                    className="bg-[#0f3a2a] text-white hover:bg-[#b13d33] px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
                  >
                    Shop Now
                  </Link>
                </div>

                {/* Reviewer Info Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#0f3a2a]/10 text-xs">
                  <div>
                    <h4 className="font-semibold text-sm text-[#0f3a2a]">{selectedReview.name}</h4>
                    <p className="text-xs text-[#151510]/50 mt-0.5">{selectedReview.location}</p>
                  </div>
                  <span className="text-xs text-[#151510]/40 font-light">
                    {new Date(selectedReview.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Submit Review Modal */}
      {isModalOpen && (
        <div 
          data-lenis-prevent
          className="fixed inset-0 z-50 overflow-y-auto p-4 bg-black/70 backdrop-blur-sm flex items-start justify-center animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-10 text-[#151510] flex flex-col space-y-6 border border-[#0f3a2a]/[0.08] my-8 animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#0f3a2a]/[0.08]">
              <div>
                <h3 className="text-2xl font-light text-[#0f3a2a]" style={{ fontFamily: "var(--font-display)" }}>
                  Write a <span className="italic font-normal">Customer Review</span>
                </h3>
                <p className="text-xs text-[#151510]/50 mt-1">We value your authentic feedback and community styling stories.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#0f3a2a]/5 text-[#151510]/60 hover:text-[#0f3a2a] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-light text-[#0f3a2a]" style={{ fontFamily: "var(--font-display)" }}>
                  Thank you for <span className="italic">your feedback</span>
                </h4>
                <p className="text-sm text-[#151510]/70 max-w-sm font-light">
                  Your review has been successfully submitted and is currently being processed by our moderation team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-6">
                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium border border-red-100">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0f3a2a]/70" style={{ fontFamily: "var(--font-label)" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Priyanjali Roy"
                      className="w-full px-4 py-2.5 border border-[#0f3a2a]/20 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] bg-[#fcfbf9] transition-colors"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0f3a2a]/70" style={{ fontFamily: "var(--font-label)" }}>
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Pune, India"
                      className="w-full px-4 py-2.5 border border-[#0f3a2a]/20 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] bg-[#fcfbf9] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Rating */}
                  <div className="space-y-1.5 flex flex-col justify-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0f3a2a]/70" style={{ fontFamily: "var(--font-label)" }}>
                      Product Rating
                    </label>
                    <div className="flex gap-2 items-center pt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          className="hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 cursor-pointer ${
                              star <= formRating
                                ? "fill-[#d4af37] text-[#d4af37]"
                                : "text-[#151510]/15 hover:text-[#d4af37]/60"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0f3a2a]/70" style={{ fontFamily: "var(--font-label)" }}>
                      Featured Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formProductName}
                      onChange={(e) => setFormProductName(e.target.value)}
                      placeholder="e.g. Textured Sage Linen Blazer"
                      className="w-full px-4 py-2.5 border border-[#0f3a2a]/20 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] bg-[#fcfbf9] transition-colors"
                    />
                  </div>
                </div>

                {/* Review Headline (Quote) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#0f3a2a]/70" style={{ fontFamily: "var(--font-label)" }}>
                    Review Headline / Quote
                  </label>
                  <input
                    type="text"
                    required
                    value={formQuote}
                    onChange={(e) => setFormQuote(e.target.value)}
                    placeholder="e.g. Sartorial perfection meets sustainable luxury. Fits like a glove."
                    className="w-full px-4 py-2.5 border border-[#0f3a2a]/20 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] bg-[#fcfbf9] transition-colors"
                  />
                </div>

                {/* Full Testimonial */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#0f3a2a]/70" style={{ fontFamily: "var(--font-label)" }}>
                    Detailed Feedback
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    placeholder="Tell us about the fabric feel, sizing, craftsmanship, or your styling experience..."
                    className="w-full px-4 py-2.5 border border-[#0f3a2a]/20 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] bg-[#fcfbf9] transition-colors resize-none"
                  />
                </div>

                {/* Media File Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#0f3a2a]/70 block" style={{ fontFamily: "var(--font-label)" }}>
                    Upload Photo or Video (Max: Image 5MB, Video 10MB)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        key={fileInputKey}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="media-upload-input"
                      />
                      <label
                        htmlFor="media-upload-input"
                        className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-[#0f3a2a]/20 hover:border-[#d4af37] bg-[#fcfbf9] rounded-2xl px-4 py-6 cursor-pointer text-center text-xs font-semibold text-[#0f3a2a]/70 hover:text-[#0f3a2a] transition-all"
                      >
                        {uploadProgress ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-[#d4af37]" />
                            <span className="mt-1">Uploading styling story...</span>
                          </>
                        ) : uploadedMediaUrl ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-green-700 mt-1">Uploaded {uploadedMediaType === "video" ? "Video" : "Photo"} Successfully!</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-[#0f3a2a]/50" />
                            <span className="mt-1 text-[#0f3a2a]">Click to upload image or video</span>
                          </>
                        )}
                      </label>
                    </div>

                    {uploadedMediaUrl && (
                      <div className="w-20 h-20 relative rounded-2xl overflow-hidden border border-[#0f3a2a]/10 bg-black/5 flex items-center justify-center shadow-inner">
                        {uploadedMediaType === "video" ? (
                          <div className="text-[10px] uppercase font-bold text-[#0f3a2a] flex flex-col items-center gap-1">
                            <Play className="w-4 h-4 fill-current" />
                            <span>Video</span>
                          </div>
                        ) : (
                          <Image
                            src={uploadedMediaUrl}
                            alt="Uploaded thumbnail"
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0f3a2a]/[0.08]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#151510]/60 hover:text-[#151510] hover:bg-[#0f3a2a]/5 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadProgress}
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#0f3a2a] hover:bg-[#b13d33] disabled:bg-[#0f3a2a]/40 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
