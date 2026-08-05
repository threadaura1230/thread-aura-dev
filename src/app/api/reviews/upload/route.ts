import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const subfolder = "reviews";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: "Only image or video files are allowed." },
        { status: 400 }
      );
    }

    // Set size limits: 10MB for video, 5MB for images
    const MAX_SIZE = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the limit (${isVideo ? "10 MB for videos" : "5 MB for images"})`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "-");
    const filename = `${timestamp}-${originalName}`;

    const result = await uploadToCloudinary(buffer, subfolder, file.type, filename);

    return NextResponse.json({
      success: true,
      mediaUrl: result.secure_url,
      mediaType: isVideo ? "video" : "image",
      publicId: result.public_id,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Reviews Upload API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload media file" },
      { status: 500 }
    );
  }
}
