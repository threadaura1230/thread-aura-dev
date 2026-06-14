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
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {label}
            </label>

            <div
                className={`relative flex items-center justify-center rounded-xl border-2 border-dashed transition-colors cursor-pointer
        ${value
                        ? "border-[#073623]/25 bg-[#073623]/[0.03]"
                        : "border-black/[0.1] bg-[#F1EFE7]/60 hover:border-[#073623]/40 hover:bg-[#F1EFE7]"}
        ${uploading ? "pointer-events-none opacity-70" : ""}`}
                style={{ minHeight: "140px" }}
                onClick={() => !uploading && inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {uploading ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-[#073623]">
                        <Loader2 size={28} className="animate-spin" />
                        <span className="text-[12px] font-semibold">Uploading...</span>
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
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow border border-black/[0.08] text-slate-400 hover:text-[#8C2323] hover:border-[#8C2323]/30 transition-colors"
                        >
                            <X size={14} />
                        </button>

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#073623] bg-white/90 border border-black/[0.06] rounded-full px-3 py-0.5 shadow-sm">
                                <Upload size={10} /> Click to replace
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
                        <ImageIcon size={28} />

                        <div className="text-center">
                            <p className="text-[13px] font-medium text-slate-700">
                                Click or drag & drop
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                PNG, JPG, WebP up to 5 MB
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1 px-4 py-1.5 bg-[#073623] rounded-lg text-white text-[12px] font-medium shadow-sm hover:bg-[#0c4a31] transition-colors">
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
                <p className="text-[12px] text-[#8C2323] font-medium">{uploadError}</p>
            )}

            {value && (
                <p
                    className="text-[11px] text-slate-400 font-mono truncate"
                    title={value}
                >
                    {value}
                </p>
            )}
        </div>
    );
}