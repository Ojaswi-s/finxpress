-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('student', 'professional');

-- Add new columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN user_type public.user_type,
ADD COLUMN language text DEFAULT 'en',
ADD COLUMN monthly_amount numeric;

-- Update the handle_new_user function to support additional metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_type, language, monthly_amount)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    (NEW.raw_user_meta_data->>'user_type')::user_type,
    COALESCE(NEW.raw_user_meta_data->>'language', 'en'),
    (NEW.raw_user_meta_data->>'monthly_amount')::numeric
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;