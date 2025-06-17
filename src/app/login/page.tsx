import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const params = await searchParams;

  // Check for different message types
  const isSignupSuccess = params?.message === "signup_success";
  const isAuthError = params?.message === "auth_error";
  const isLoginError = params?.message === "Could not authenticate user";
  
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/");
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
        <div className="w-full space-y-6">
          {/* Success message for email confirmation */}
          {isSignupSuccess && (
            <div className="animate-in">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5"
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
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    🎉 You&apos;ve successfully signed up!
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Please sign in with your account to get started.
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Login form */}
          <form
            className="animate-in flex flex-col w-full gap-2 text-foreground"
            action={signIn}
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
              Sign In
            </button>
            <Link
              href="/signup"
              className="border border-primary/30 rounded-md px-4 py-2 text-primary mb-2 text-center hover:bg-primary/5 hover:border-primary/50 transition-all"
            >
              Sign Up
            </Link>
            {/* Error messages */}
            {(isLoginError || isAuthError) && (
              <p className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 text-center rounded-md">
                {isAuthError ? "There was an error with email confirmation. Please try signing up again." : params.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 