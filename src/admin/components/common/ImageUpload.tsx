// src/components/admin/ImageUpload.tsx
"use client";

import { useRef, useState } from "react";
import { ImageIcon, Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    folder: string;
    secret: string;
    label?: string;
}

export default function ImageUpload({
    value,
    onChange,
    folder,
    secret,
    label = "Image",
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const handleFile = async (file: File) => {
        setUploadError("");

        // Validate file size (5 MB limit)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            setUploadError("Image size must be under 5 MB.");
            return;
        }

        setUploading(true);

        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("subfolder", folder);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                headers: {
                    "x-admin-secret": secret,
                },
                body: fd,
            });

            const json = await res.json();

            if (json.success) {
                onChange(json.imageUrl);
            } else {
                setUploadError(json.error ?? "Upload failed");
            }

        } catch {
            setUploadError("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = "";
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider">
                {label}
            </label>

            <div
                className={`relative flex items-center justify-center rounded-xl border-2 border-dashed transition-colors cursor-pointer
        ${value
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-purple-900/30 bg-[#221035] hover:border-purple-500 hover:bg-[#2b1642]"}
        ${uploading ? "pointer-events-none opacity-70" : ""}`}
                style={{ minHeight: "140px" }}
                onClick={() => !uploading && inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {uploading ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-emerald-400">
                        <Loader2 size={28} className="animate-spin" />
                        <span className="text-xs font-semibold">Uploading...</span>
                    </div>
                ) : value ? (
                    <>
                        <img
                            src={value}
                            alt="preview"
                            className="max-h-[200px] max-w-full object-contain rounded-lg p-2"
                        />

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                            }}
                            className="absolute top-2 right-2 p-1 bg-[#140620] rounded-full shadow border border-purple-900/30 text-purple-400 hover:text-red-400 hover:border-red-500/50 transition-colors"
                        >
                            <X size={14} />
                        </button>

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-[#140620]/90 border border-emerald-950/40 rounded-full px-3 py-0.5 shadow-sm">
                                <Upload size={10} /> Click to replace
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 py-8 text-purple-400/80">
                        <ImageIcon size={28} />

                        <div className="text-center">
                            <p className="text-sm font-semibold text-white">
                                Click or drag & drop
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                PNG, JPG, WebP up to 5 MB
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1 px-4 py-1.5 bg-emerald-600 rounded-lg text-white text-xs font-bold shadow-sm hover:bg-emerald-700 transition-colors">
                            <Upload size={13} /> Upload Image
                        </div>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    className="hidden"
                    onChange={handleInputChange}
                />
            </div>

            {uploadError && (
                <p className="text-xs text-red-500 font-medium">{uploadError}</p>
            )}

            {value && (
                <p
                    className="text-[11px] text-gray-400 font-mono truncate"
                    title={value}
                >
                    {value}
                </p>
            )}
        </div>
    );
}