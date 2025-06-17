import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const params = await searchParams;

  // Check if this is the email confirmation success state
  const isEmailConfirmationSent = params?.message === "Check email to continue sign in process";
  
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = process.env.NEXT_PUBLIC_SITE_URL;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/signup?message=Could not authenticate user");
    }

    return redirect("/signup?message=Check email to continue sign in process");
  };

  return (
    <div className="min-h-screen flex flex-col w-full px-8 sm:max-w-md mx-auto">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      {/* Main content area - properly centered */}
      <div className="flex-1 flex items-center justify-center py-16">
        {isEmailConfirmationSent ? (
          // Email confirmation success state - prominent and clear
          <div className="animate-in flex flex-col w-full gap-6 text-center">
            {/* Success icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Main message */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Check Your Email
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                We&apos;ve sent you a confirmation link. Please check your email and click the link to complete your sign-up.
              </p>
            </div>

            {/* Additional instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <strong>Next steps:</strong>
                <br />
                1. Check your email inbox (and spam folder)
                <br />
                2. Click the confirmation link
                <br />
                3. You&apos;ll be redirected back to sign in
              </p>
            </div>

            {/* Back to login link */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-primary/30 rounded-md text-primary hover:bg-primary/5 hover:border-primary/50 transition-all"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          // Regular signup form
          <form
            className="animate-in flex flex-col w-full gap-2 text-foreground"
            action={signUp}
          >
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-background border border-border text-foreground mb-6 focus:outline-none focus:ring-2 focus:ring-primary"
              name="email"
              placeholder="you@example.com"
              required
            />
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-md px-4 py-2 bg-background border border-border text-foreground mb-6 focus:outline-none focus:ring-2 focus:ring-primary"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
            <button className="bg-primary rounded-md px-4 py-2 text-primary-foreground mb-2 hover:opacity-90 transition-opacity">
              Sign Up
            </button>
            <Link
              href="/login"
              className="border border-primary/30 rounded-md px-4 py-2 text-primary mb-2 text-center hover:bg-primary/5 hover:border-primary/50 transition-all"
            >
              Already have an account? Sign In
            </Link>
            {params?.message && !isEmailConfirmationSent && (
              <p className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 text-center rounded-md">
                {params.message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
} 