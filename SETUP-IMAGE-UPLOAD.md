# Setup Image Upload untuk Essentials

Panduan lengkap untuk mengaktifkan fitur upload gambar pada essentials.

## 1. Setup Database Migration

Jalankan migration SQL di Supabase SQL Editor:

```bash
# Buka Supabase Dashboard
# Navigasi ke: SQL Editor
# Copy dan jalankan file: supabase-migrations/add-essentials-image.sql
```

Atau jalankan query berikut di Supabase SQL Editor:

```sql
-- Add image_url column to essentials table
ALTER TABLE essentials 
ADD COLUMN image_url TEXT;

-- Create storage bucket for essential images
INSERT INTO storage.buckets (id, name, public)
VALUES ('essential-images', 'essential-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for essential-images bucket
CREATE POLICY "Users can upload essential images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'essential-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own essential images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'essential-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own essential images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'essential-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view essential images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'essential-images');
```

## 2. Verifikasi Storage Bucket

1. Buka Supabase Dashboard
2. Navigasi ke: **Storage** > **Buckets**
3. Pastikan bucket `essential-images` sudah dibuat
4. Bucket harus berstatus **Public**

## 3. Konfigurasi Next.js untuk Images

Tambahkan domain Supabase ke `next.config.ts`:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
```

## 4. Test Upload Functionality

1. Login ke aplikasi
2. Navigasi ke: **More** > **School Essentials**
3. Klik **Add Essential**
4. Upload gambar (max 2MB, format: PNG, JPG, JPEG)
5. Isi form dan submit
6. Verifikasi gambar muncul di card

## 5. Troubleshooting

### Error: "Failed to upload image"

**Solusi:**
- Pastikan bucket `essential-images` sudah dibuat
- Pastikan bucket berstatus **Public**
- Cek storage policies sudah diterapkan

### Error: "Image not displaying"

**Solusi:**
- Pastikan `next.config.ts` sudah dikonfigurasi dengan benar
- Restart development server: `npm run dev`
- Clear browser cache

### Error: "Unauthorized"

**Solusi:**
- Pastikan user sudah login
- Cek RLS policies di Supabase
- Verifikasi auth token masih valid

## 6. File Structure

```
├── supabase-migrations/
│   └── add-essentials-image.sql          # Database migration
├── lib/
│   └── storage/
│       └── essentials.ts                  # Storage helper functions
├── components/
│   └── essentials/
│       ├── ImageUpload.tsx                # Image upload component
│       ├── EssentialForm.tsx              # Updated form with image
│       └── EssentialCard.tsx              # Updated card with image
├── actions/
│   └── essentials.ts                      # Updated server actions
└── types/
    └── database.types.ts                  # Updated types
```

## 7. Features

✅ Upload gambar produk (max 2MB)
✅ Preview gambar sebelum upload
✅ Hapus gambar yang sudah diupload
✅ Tampilkan gambar di card
✅ Fallback ke icon jika tidak ada gambar
✅ Storage policies untuk keamanan
✅ Public access untuk viewing
✅ Private upload per user

## 8. Security

- Setiap user hanya bisa upload ke folder mereka sendiri
- File disimpan dengan struktur: `{user_id}/{timestamp}.{ext}`
- Public read access untuk semua gambar
- Private write/delete access per user
- Validasi file type dan size di client-side

## 9. Performance

- Gambar di-cache selama 1 jam
- Lazy loading dengan Next.js Image component
- Optimized image delivery dari Supabase CDN
- Responsive images untuk mobile

## 10. Next Steps

Setelah setup selesai, Anda bisa:
- Test upload gambar
- Verifikasi tampilan di card
- Test edit dan delete
- Deploy ke production
