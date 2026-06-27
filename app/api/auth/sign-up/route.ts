import { createClient } from "@/lib/supabase/server";
import { devSignUp } from "@/lib/supabase/dev-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, display_name } = await request.json();

    // Validate inputs
    if (!email || !password || !display_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Attempt signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? request.headers.get("origin")}/auth/callback`,
        data: {
          display_name,
        },
      },
    });

    if (error) {
      console.error("[v0] Signup error:", error);
      
      // Check if it's a network error - use fallback dev auth
      if (error.message?.includes("fetch failed") || error.message?.includes("ENOTFOUND")) {
        console.warn("[v0] Supabase unreachable. Using development fallback authentication.");
        
        try {
          const { user: devUser, error: devError } = await devSignUp(
            email,
            password,
            display_name
          );
          
          if (devError) {
            return NextResponse.json(
              { error: devError.message, isDevMode: true },
              { status: 400 }
            );
          }
          
          return NextResponse.json(
            { 
              message: "Account created (development mode). Redirecting...",
              user: devUser,
              isDevMode: true,
              warning: "Running in development mode. Supabase project is not accessible."
            },
            { status: 201 }
          );
        } catch (devErr) {
          console.error("[v0] Dev auth fallback error:", devErr);
          return NextResponse.json(
            { 
              error: "Cannot connect to authentication server. Please check that your Supabase project is active and not paused.",
              details: (devErr as Error).message 
            }, 
            { status: 503 }
          );
        }
      }
      
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Account created. Check your email to confirm.", user: data.user },
      { status: 201 }
    );
  } catch (error) {
    console.error("[v0] Signup exception:", error);
    
    // If it's a Supabase connection error, try dev auth
    if ((error as Error).message?.includes("ENOTFOUND") || (error as Error).message?.includes("fetch failed")) {
      console.warn("[v0] Supabase unreachable. Using development fallback authentication.");
      
      try {
        const { user: devUser, error: devError } = await devSignUp(
          email,
          password,
          display_name
        );
        
        if (devError) {
          return NextResponse.json(
            { error: devError.message, isDevMode: true },
            { status: 400 }
          );
        }
        
        return NextResponse.json(
          { 
            message: "Account created (development mode)",
            user: devUser,
            isDevMode: true
          },
          { status: 201 }
        );
      } catch (devErr) {
        console.error("[v0] Dev auth fallback error:", devErr);
      }
    }
    
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
