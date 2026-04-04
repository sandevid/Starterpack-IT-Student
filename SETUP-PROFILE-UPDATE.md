# Setup Profile Update Feature

Fitur ini memungkinkan user untuk mengedit nama dan foto profile mereka, serta setup profile pertama kali untuk user baru.

## Database Migration

Jalankan migration berikut di Supabase SQL Editor:

### 1. Setup Storage Bucket untuk Profile Images

```sql
-- File: supabase-migrations/add-profile-storage.sql

-- IMPORTANT: Make sure full_name can be NULL initially for new users
-- This allows users to complete profile setup after first login
ALTER TABLE profiles ALTER COLUMN full_name DROP NOT NULL;

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile images
CREATE POLICY "Users can upload own profile image"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own profile image"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own profile image"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Profile images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');
```

## Cara Menjalankan Migration

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project Anda
3. Klik "SQL Editor" di sidebar
4. Copy paste isi file `supabase-migrations/add-profile-storage.sql`
5. Klik "Run" untuk menjalankan migration

## Struktur Database

Tabel `profiles` sudah memiliki kolom yang diperlukan:
- `avatar_url` (TEXT) - untuk menyimpan URL foto profile
- `full_name` (TEXT, nullable) - untuk menyimpan nama lengkap user

## Fitur yang Ditambahkan

### 1. Setup Profile untuk User Baru
- Halaman `/setup-profile` untuk user yang baru pertama kali login
- Upload foto profile (optional, max 2MB)
- Input nama lengkap (required)
- Tombol "Skip for now" untuk skip setup
- Auto redirect ke setup jika profile belum lengkap

### 2. ProfileForm Component
- Upload foto profile (max 2MB)
- Preview foto sebelum upload
- Hapus foto profile
- Edit nama lengkap
- Validasi file type dan size

### 3. Profile Actions
- `setupProfile()` - Setup profile pertama kali untuk user baru
- `updateProfile()` - Update nama lengkap
- `uploadProfileImage()` - Upload foto profile ke Supabase Storage
- `deleteProfileImage()` - Hapus foto profile

### 4. Updated ProfileClient
- Tombol "Edit Profile" untuk masuk ke mode edit
- Tampilan foto profile atau placeholder jika belum ada
- Toggle antara view mode dan edit mode

### 5. Middleware Protection
- Auto redirect ke `/setup-profile` jika user belum lengkapi profile
- Check `full_name` untuk menentukan apakah profile sudah lengkap
- Protect semua route kecuali `/login`, `/auth`, dan `/setup-profile`

### 6. Auth Callback Update
- Tidak auto-fill `full_name` dari OAuth metadata
- Redirect ke `/setup-profile` untuk user baru
- Check existing profile sebelum redirect

## Flow User Baru

1. User login via OAuth (Google, dll)
2. Auth callback membuat profile baru tanpa `full_name`
3. Redirect ke `/setup-profile`
4. User mengisi nama dan upload foto (optional)
5. Klik "Continue" atau "Skip for now"
6. Redirect ke home page

## Flow User Existing

1. User login
2. Middleware check profile
3. Jika `full_name` ada, langsung ke home
4. Jika `full_name` null, redirect ke `/setup-profile`

## Cara Menggunakan

### Setup Profile (User Baru)
1. Login pertama kali
2. Akan otomatis diarahkan ke halaman setup
3. Upload foto (optional) dan isi nama
4. Klik "Continue"

### Edit Profile (User Existing)
1. Buka halaman Profile
2. Klik tombol "Edit Profile"
3. Upload foto atau edit nama
4. Klik "Save Changes"

## Storage Structure

Foto profile disimpan di bucket `profiles` dengan struktur:
```
profiles/
  {user_id}/
    {timestamp}.{ext}
```

Setiap user hanya bisa upload/update/delete foto mereka sendiri berkat RLS policies.
