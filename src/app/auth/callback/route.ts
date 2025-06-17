import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successful email confirmation - redirect to home page with welcome message
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'

      const redirectUrl = isLocalEnv
        ? `${origin}/?welcome=true`
        : forwardedHost
          ? `https://${forwardedHost}/?welcome=true`
          : `${origin}/?welcome=true`

      return NextResponse.redirect(redirectUrl)
    }
  }

  // If there's an error or no code, redirect to login with error message
  return NextResponse.redirect(`${origin}/login?message=auth_error`)
}
