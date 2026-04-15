import { Client, Storage, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

export const storage = new Storage(client);

export const APPWRITE_BUCKET_ID = "screenshots";

/**
 * Upload payment screenshot to Appwrite storage
 */
export async function uploadPaymentScreenshot(
  file: File
): Promise<{ fileId: string; fileUrl: string }> {
  try {
    const fileId = ID.unique();

    const uploadedFile = await storage.createFile(
      APPWRITE_BUCKET_ID,
      fileId,
      file
    );

    // Generate preview URL (Appwrite stores files with direct access)
    const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

    return {
      fileId: uploadedFile.$id,
      fileUrl,
    };
  } catch (error) {
    console.error("Error uploading file to Appwrite:", error);
    throw new Error("Failed to upload payment screenshot");
  }
}

/**
 * Delete payment screenshot from Appwrite storage
 */
export async function deletePaymentScreenshot(fileId: string): Promise<void> {
  try {
    await storage.deleteFile(APPWRITE_BUCKET_ID, fileId);
  } catch (error) {
    console.error("Error deleting file from Appwrite:", error);
    throw new Error("Failed to delete payment screenshot");
  }
}

/**
 * Get file preview URL
 */
export function getFilePreviewUrl(fileId: string): string {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_ID}/files/${fileId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
}
