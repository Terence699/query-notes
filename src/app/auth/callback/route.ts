import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successful email confirmation - redirect to login with success message
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // In development, redirect to login with success message
        return NextResponse.redirect(`${origin}/login?message=signup_success`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}/login?message=signup_success`)
      } else {
        return NextResponse.redirect(`${origin}/login?message=signup_success`)
      }
    }
  }

  // If there's an error or no code, redirect to login with error message
  return NextResponse.redirect(`${origin}/login?message=auth_error`)
}
