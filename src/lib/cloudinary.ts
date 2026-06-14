import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Root folder
const BASE_FOLDER = "enteropia";

/**
 * @param file      - Buffer, base64 data URI, or a remote URL
 * @param subfolder - Subfolder under the base folder
 * @param mimeType  - MIME type of the file
 * @param filename  - Optional public_id override (without extension)
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  subfolder: string,
  mimeType?: string,
  filename?: string
): Promise<UploadApiResponse> {
  const folder = `${BASE_FOLDER}/${subfolder}`;

  // Convert Buffer → base64 data URI using the real MIME type
  let uploadSource: string;
  if (Buffer.isBuffer(file)) {
    const mime = mimeType || "image/jpeg";
    uploadSource = `data:${mime};base64,${file.toString("base64")}`;
  } else {
    uploadSource = file;
  }

  const options: UploadApiOptions = {
    folder,
    ...(filename && { public_id: filename }),
    overwrite: false,
    resource_type: "auto",
  };

  return cloudinary.uploader.upload(uploadSource, options);
}

// Delete an asset from Cloudinary by its public_id
export async function deleteFromCloudinary(
  publicId: string
): Promise<{ result: string }> {
  return cloudinary.uploader.destroy(publicId);
}

// Derive the Cloudinary public_id from a secure_url
export function getPublicIdFromUrl(secureUrl: string): string {
  const afterUpload = secureUrl.split("/upload/")[1];
  if (!afterUpload) throw new Error("Invalid Cloudinary URL");
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  return withoutVersion.replace(/\.[^/.]+$/, "");
}

/**
 * Rename a Cloudinary folder by moving all assets from old folder to new folder
 * @param oldFolder - Old folder path (e.g., "agritech-mart/listing-requests/temp-123")
 * @param newFolder - New folder path (e.g., "agritech-mart/listing-requests/507f1f77bcf86cd799439011")
 * @param imageUrls - Array of current image URLs that need to be updated
 * @returns Array of updated image URLs with new folder path
 */
export async function renameCloudinaryFolder(
  oldFolder: string,
  newFolder: string,
  imageUrls: string[]
): Promise<string[]> {
  const updatedUrls: string[] = [];

  for (const url of imageUrls) {
    try {
      // Extract public_id from URL
      const publicId = getPublicIdFromUrl(url);
      
      // Get the filename from the public_id
      const filename = publicId.split('/').pop();
      
      // Create new public_id with new folder
      // Note: newFolder should NOT include the BASE_FOLDER prefix as we prepend it here
      const newPublicId = `${BASE_FOLDER}/${newFolder}/${filename}`;
      
      // Rename the asset in Cloudinary
      await cloudinary.uploader.rename(publicId, newPublicId, {
        overwrite: false,
        invalidate: true,
      });
      
      // Construct new URL
      const newUrl = url.replace(`${BASE_FOLDER}/${oldFolder}`, `${BASE_FOLDER}/${newFolder}`);
      updatedUrls.push(newUrl);
    } catch (error) {
      console.error(`Failed to rename asset ${url}:`, error);
      // If rename fails, keep the original URL
      updatedUrls.push(url);
    }
  }

  return updatedUrls;
}

export default cloudinary;