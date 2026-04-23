import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = "ludicamente";

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export async function uploadImage(
  file: Buffer | string,
  options?: { publicId?: string; subfolder?: string },
): Promise<UploadResult> {
  const folder = options?.subfolder ? `${FOLDER}/${options.subfolder}` : FOLDER;

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
  }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options?.publicId,
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error("Upload failed"));
        else resolve(result);
      },
    );

    if (typeof file === "string") {
      // base64 data URL
      cloudinary.uploader.upload(
        file,
        { folder, public_id: options?.publicId },
        (error, result) => {
          if (error || !result) reject(error ?? new Error("Upload failed"));
          else resolve(result);
        },
      );
    } else {
      uploadStream.end(file);
    }
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
