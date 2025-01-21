export interface CloudinaryResponse {
  secure_url: string;
}

export function uploadToCloudinary(filePath: string): Promise<string>;
export function getCloudinaryUrl(publicId: string, options?: Record<string, any>): string; 