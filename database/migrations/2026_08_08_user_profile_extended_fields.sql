-- Add extended profile fields for ProfileBuilder
-- Run after: base schema.sql

-- Add missing fields to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS district text,
ADD COLUMN IF NOT EXISTS maslak text,
ADD COLUMN IF NOT EXISTS education jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS experience jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female', 'other'));

-- Add index for district-based searches
CREATE INDEX IF NOT EXISTS idx_user_profiles_district ON public.user_profiles(district) WHERE district IS NOT NULL;

-- Update the updated_at timestamp trigger if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Comments for documentation
COMMENT ON COLUMN public.user_profiles.bio IS 'User biography/about section';
COMMENT ON COLUMN public.user_profiles.district IS 'District/region for location-based matching';
COMMENT ON COLUMN public.user_profiles.maslak IS 'Islamic school of thought (e.g., Deobandi, Ahle Sunnat)';
COMMENT ON COLUMN public.user_profiles.education IS 'Array of education entries: [{institution, degree, year, result}]';
COMMENT ON COLUMN public.user_profiles.experience IS 'Array of work experience: [{title, organization, duration, description}]';
