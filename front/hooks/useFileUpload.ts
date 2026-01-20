// useFileUpload.ts
import { useState } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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

    let pageCount: number | undefined = undefined;

    try {
      if (ext === '.pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        pageCount = pdfDoc.getPageCount();
      }

      const s3 = new S3Client({
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
        },
      });

      const fileKey = `${Date.now()}_${file.name}`;
      const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: fileKey,
        Body: file,
        ContentType: file.type,
      });

      await s3.send(command);

      setLoading(false);

      return {
        success: true,
        url: `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`,
        ...(pageCount !== undefined && { pageCount }),
      };
    } catch (error: any) {
      setLoading(false);
      return { success: false, error: error.message || 'Upload failed' };
    }
  };

  return { uploadFile, loading };
};
