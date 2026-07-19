export interface CloudinaryWidget {
  open: () => void;
}

export interface CloudinaryGlobal {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: unknown, result: CloudinaryResult) => void,
  ) => CloudinaryWidget;
}

export interface CloudinaryResult {
  event: string;
  info?: {
    secure_url?: string;
  };
}

declare global {
  interface Window {
    cloudinary?: CloudinaryGlobal;
  }
}
