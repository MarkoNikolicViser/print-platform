// app/api/upload-url/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const runtime = 'nodejs'; // ensure Node runtime (not Edge)

export async function GET(req: NextRequest) {
  try {
    const bucket = process.env.AWS_BUCKET_NAME!;
    const region = process.env.AWS_REGION!;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
    if (!bucket || !region || !accessKeyId || !secretAccessKey) {
      return NextResponse.json({ error: 'Missing required server env vars.' }, { status: 500 });
    }

    const search = new URL(req.url).searchParams;
    const fileName = search.get('fileName');
    const contentType = search.get('contentType');

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'Missing fileName or contentType' }, { status: 400 });
    }

    // Optional: only permit specific types
    const allowedContentTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedContentTypes.includes(contentType)) {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }

    // Prefix to keep uploads organized & policy‑scoped
    const key = `clients-uploads/${Date.now()}_${encodeURIComponent(fileName)}`;

    const s3 = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      // Optional: ACL: 'public-read',
    });

    // URL valid for 60 seconds (adjust to your needs)
    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    // Public URL if bucket is public OR if you serve via CloudFront
    const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return NextResponse.json({ url, publicUrl, key });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Failed to create signed URL' },
      { status: 500 },
    );
  }
}
