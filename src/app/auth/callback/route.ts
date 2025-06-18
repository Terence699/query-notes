import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  console.log('Auth callback called with:', {
    code: code ? 'present' : 'missing',
    tokenHash: tokenHash ? 'present' : 'missing',
    type,
    origin,
    searchParams: Object.fromEntries(searchParams.entries())
  });

  const supabase = await createClient()

  // Handle code-based authentication (OAuth, etc.)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log('Exchange code result:', {
      success: !error,
      error: error?.message,
      user: data?.user?.email
    });

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      const redirectUrl = isLocalEnv
        ? `${origin}/?welcome=true`
        : forwardedHost
          ? `https://${forwardedHost}/?welcome=true`
          : `${origin}/?welcome=true`

      console.log('Successful code auth, redirecting to:', redirectUrl);
      return NextResponse.redirect(redirectUrl)
    } else {
      console.error('Auth exchange failed:', error);
    }
  }
  // Handle token-based authentication (email confirmation)
  else if (tokenHash && type) {
    console.log('Attempting token-based verification');

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as 'signup' | 'email_change' | 'recovery' | 'invite'
    })

    console.log('Token verification result:', {
      success: !error,
      error: error?.message,
      user: data?.user?.email
    });

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      const redirectUrl = isLocalEnv
        ? `${origin}/?welcome=true`
        : forwardedHost
          ? `https://${forwardedHost}/?welcome=true`
          : `${origin}/?welcome=true`

      console.log('Successful token auth, redirecting to:', redirectUrl);
      return NextResponse.redirect(redirectUrl)
    } else {
      console.error('Token verification failed:', error);
    }
  } else {
    console.error('No valid authentication parameters found');
  }

  // If there's an error or no valid params, redirect to login with error message
  console.log('Redirecting to login with auth_error');
  return NextResponse.redirect(`${origin}/login?message=auth_error`)
}
