-- Create OTP codes table for 2FA
CREATE TABLE public.otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own OTP codes (needed for verification)
CREATE POLICY "Users can view their own OTP codes" 
ON public.otp_codes 
FOR SELECT 
USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR auth.uid()::text = user_id::text);

-- Create index for faster lookups
CREATE INDEX idx_otp_codes_email_code ON public.otp_codes(email, code);
CREATE INDEX idx_otp_codes_expires_at ON public.otp_codes(expires_at);

-- Auto-delete expired OTPs (cleanup function)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.otp_codes WHERE expires_at < now() OR used = true;
END;
$$;