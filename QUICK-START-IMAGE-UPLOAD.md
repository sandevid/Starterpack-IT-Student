# Quick Start: Image Upload untuk Essentials

## Langkah Cepat Setup (5 menit)

### 1. Jalankan Migration Database

Buka **Supabase Dashboard** → **SQL Editor** → Copy paste query ini:

```sql
-- Add image_url column
ALTER TABLE essentials ADD COLUMN image_url TEXT;

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('essential-images', 'essential-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload essential images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'essential-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own essential images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'essential-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own essential images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'essential-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view essential images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'essential-images');
```

Klik **Run** ✅

### 2. Restart Development Server

```bash
# Stop server (Ctrl+C)
# Start ulang
npm run dev
```

### 3. Test Upload

1. Login ke aplikasi
2. Buka **More** → **School Essentials**
3. Klik **Add Essential**
4. Upload gambar (max 2MB)
5. Submit form

**Done!** 🎉

## Verifikasi

✅ Kolom `image_url` ada di tabel `essentials`
✅ Bucket `essential-images` ada di Storage
✅ Bucket berstatus **Public**
✅ Gambar bisa diupload dan ditampilkan

## Troubleshooting Cepat

**Gambar tidak muncul?**
- Restart dev server
- Clear browser cache
- Cek console untuk error

**Upload gagal?**
- Pastikan file < 2MB
- Pastikan format PNG/JPG
- Cek bucket sudah dibuat

**Need help?** Lihat `SETUP-IMAGE-UPLOAD.md` untuk detail lengkap.
