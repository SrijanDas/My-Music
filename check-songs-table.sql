-- Diagnostic: Check current songs table structure
-- Run this first to see what columns exist in your songs table

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'songs' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Also check if there are any existing records
SELECT COUNT(*) as record_count FROM public.songs;

-- Show sample of existing data if any
SELECT * FROM public.songs LIMIT 5;
