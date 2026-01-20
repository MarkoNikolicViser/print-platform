import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export const allowedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];

export interface UploadFileResult {
  success: boolean;
  url?: string;
  error?: string;
  pageCount?: number;
}

export const useFileUpload = () => {
  const [loading, setLoading] = useState(false);

  const uploadFile = async (file: File): Promise<UploadFileResult> => {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedFileTypes.includes(ext)) {
      return { success: false, error: 'File type not allowed' };
    }

    setLoading(true);
    let pageCount: number | undefined;

    try {
      if (ext === '.pdf') {
        const buf = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buf);
        pageCount = pdf.getPageCount();
      }

      const params = new URLSearchParams({
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
      });

      const presignRes = await fetch(`/api/upload-url?${params.toString()}`, { method: 'GET' });
      if (!presignRes.ok) {
        const data = await presignRes.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to get upload URL');
      }
      const { url, publicUrl } = await presignRes.json();

      const putRes = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      });

      if (!putRes.ok) {
        throw new Error('Upload failed');
      }

      setLoading(false);
      return {
        success: true,
        url: publicUrl,
        ...(pageCount !== undefined && { pageCount }),
      };
    } catch (e: any) {
      setLoading(false);
      return { success: false, error: e?.message || 'Upload failed' };
    }
  };

  return { uploadFile, loading };
};
