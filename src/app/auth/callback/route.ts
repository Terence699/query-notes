import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  console.log('Auth callback called with:', {
    code: code ? 'present' : 'missing',
    origin,
    searchParams: Object.fromEntries(searchParams.entries())
  });

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log('Exchange code result:', {
      success: !error,
      error: error?.message,
      user: data?.user?.email
    });

    if (!error) {
      // Successful email confirmation - redirect to home page with welcome message
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'

      const redirectUrl = isLocalEnv
        ? `${origin}/?welcome=true`
        : forwardedHost
          ? `https://${forwardedHost}/?welcome=true`
          : `${origin}/?welcome=true`

      console.log('Successful auth, redirecting to:', redirectUrl);
      return NextResponse.redirect(redirectUrl)
    } else {
      console.error('Auth exchange failed:', error);
    }
  } else {
    console.error('No code parameter found in callback');
  }

  // If there's an error or no code, redirect to login with error message
  console.log('Redirecting to login with auth_error');
  return NextResponse.redirect(`${origin}/login?message=auth_error`)
}
