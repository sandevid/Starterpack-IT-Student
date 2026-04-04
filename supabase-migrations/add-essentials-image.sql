-- Migration: Add image support to essentials
-- Run this in Supabase SQL Editor

-- Add image_url column to essentials table
ALTER TABLE essentials 
ADD COLUMN image_url TEXT;

-- Create storage bucket for essential images
INSERT INTO storage.buckets (id, name, public)
VALUES ('essential-images', 'essential-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for essential-images bucket
-- Allow authenticated users to upload images
CREATE POLICY "Users can upload essential images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'essential-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update own essential images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'essential-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own essential images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'essential-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to images
CREATE POLICY "Public can view essential images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'essential-images');
